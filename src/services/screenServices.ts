"use server"
import prisma from "@/generated/prisma";
import * as crypto from "crypto";

export const getScreen = async (user_id: string) => {
  try {
    return await prisma.screen.findMany({
      where: {
        userId: user_id
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (error: any) {
    throw new Error('Ekran verisine erişilemedi: ', error.messa.ge)
  }
}

export const createScreen = async (code: string) => {
  try {
    if (!code) {
      throw new Error('Doğrulama kodu gerekli');
    }

    const deviceCode = await prisma.deviceScreenCode.findFirst({
      where: {
        code: code
      }
    })

    if (!deviceCode) {
      throw new Error('Device Kod yok. Lütfen tekrar deneyin');
    }

    if (deviceCode.code !== code) {
      throw new Error('Kod eşleşmiyor');
    }

    const newScreen = await prisma.screen.create({
      data: {
        name: deviceCode.deviceId,
        deviceId: deviceCode.deviceId,
        user: {
          connect: { id: deviceCode.userId }
        },
        width: deviceCode.width,
        height: deviceCode.height
      }
    })

    await prisma.deviceScreenCode.deleteMany({
      where: {
        code: code,
        OR: [
          { deviceId: deviceCode.deviceId }
        ]
      },
    });

    return newScreen;

  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('Bu Cihaz zaten kullanılıyor. Farklı bir Cihaz kullanın.');
    }
    throw new Error('Ekran eklenmedi: ' + error.message);
  }
}

export const createScreenCode = async (data: { userId: string, width: number, height: number, deviceId: string }) => {
  try {
    const { userId, width, height, deviceId } = data;
    let attempts = 0;
    const maxAttempts = 5;

    if (!deviceId || deviceId === "") {
      throw new Error('Cihaz id eksik');
    }

    const isExistsScreen = await prisma.screen.findFirst({
      where: {
        deviceId: deviceId
      }
    });

    if (isExistsScreen) {
      throw new Error('Bu cihaza tanımlanmış bir ekran zaten var');
    }

    await prisma.deviceScreenCode.deleteMany({
      where: {
        deviceId: deviceId
      }
    })

    while (attempts < maxAttempts) {
      const code = crypto.randomInt(100000, 1000000).toString();
      try {
        await prisma.deviceScreenCode.create({
          data: {
            deviceId: deviceId,
            user: {
              connect: { id: userId }
            },
            width: width,
            height: height,
            code: code
          }
        })

        return code;
      } catch (error: any) {
        if (error.code === "P2002") {
          attempts++;
          continue;
        }
        throw new Error('kod üretilirken bir hata oluştu');
      }
    }
  } catch (error: any) {
    throw new Error('Doğrulama kodu oluşturulamadı', error.message);
  }
}

export const getScreenByDeviceId = async (deviceId: string) => {
  try {
    return await prisma.screen.findMany({
      where: {
        deviceId: deviceId
      }
    })
  } catch (error: any) {
    throw new Error('Ekran verisine erişilemedi: ', error.message)
  }
}

export const updateScreenConfig = async (screenId: string, configs: { mediaId?: string, templateId?: string, templateConfigId?: string, mediaIndex: number, duration: number }[], sortmatic: boolean = false) => {
  try {
    await prisma.screenConfig.deleteMany({
      where: {
        screenId: screenId
      }
    });

    if (!configs || configs.length === 0) {
      console.log('No configs to save, returning empty array');
      return [];
    }

    const templateComponentMap = new Map<string, string>();
    for (const config of configs) {
      if (config.templateId && config.templateId.startsWith('template-')) {
        const component = config.templateId;
        if (!templateComponentMap.has(component)) {
          const path = `/design/${component}`;
          console.log(`Looking for template with path: ${path}`);

          let template = await prisma.template.findFirst({
            where: { path: path }
          });

          if (!template) {
            const name = component === 'template-1' ? 'Şablon 1' :
              component === 'template-2' ? 'Şablon 2' :
                component === 'template-3' ? 'Şablon 3' : 'Şablon';

            console.log(`Template not found, creating new template: ${name}, path: ${path}, component: ${component}`);

            template = await prisma.template.create({
              data: {
                name,
                path,
                component,
              },
            });

            console.log(`Template created with ID: ${template.id}`);
          } else {
            console.log(`Template found with ID: ${template.id}`);
          }

          templateComponentMap.set(component, template.id);
        }
      }
    }

    console.log('Template component map:', Array.from(templateComponentMap.entries()));

    const createPromises = configs.map((config, index) => {
      console.log(`Processing config ${index + 1}:`, JSON.stringify(config, null, 2));

      const data: any = {
        screen: {
          connect: { id: screenId }
        },
        mediaIndex: config.mediaIndex,
        displayDuration: config.duration || 10,
        sortmatic: sortmatic
      };

      if (config.mediaId) {
        console.log(`Adding Media connection for mediaId: ${config.mediaId}`);
        data.Media = {
          connect: { id: config.mediaId }
        };
      }

      if (config.templateConfigId) {
        // TemplateConfig ID'si kullanılıyor (her config ayrı)
        console.log(`Adding TemplateConfig connection for templateConfigId: ${config.templateConfigId}`);
        data.TemplateConfig = {
          connect: { id: config.templateConfigId }
        };
      } else if (config.templateId) {
        let templateDbId = config.templateId;

        if (config.templateId.startsWith('template-')) {
          const component = config.templateId; // template-1
          const foundId = templateComponentMap.get(component);
          if (foundId) {
            templateDbId = foundId;
            console.log(`Template component ${component} mapped to DB ID: ${templateDbId}`);
          } else {
            console.error(`Template ID bulunamadı for component: ${component}`);
            throw new Error(`Template ID bulunamadı: ${component}`);
          }
        }

        console.log(`Adding Template connection for templateId: ${templateDbId}`);
        data.Template = {
          connect: { id: templateDbId }
        };
      }

      if (!config.mediaId && !config.templateId && !config.templateConfigId) {
        console.error(`Config ${index + 1} has neither mediaId, templateId nor templateConfigId`);
        throw new Error('Config için mediaId, templateId veya templateConfigId gereklidir');
      }

      console.log(`Creating ScreenConfig with data:`, JSON.stringify(data, null, 2));

      return prisma.screenConfig.create({
        data: data
      });
    });

    const results = await Promise.all(createPromises);
    return results;

  } catch (error: any) {
    console.error('updateScreenConfig error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    // Preserve Prisma error properties
    const newError: any = new Error('Screen config güncellenemedi: ' + error.message);
    newError.code = error.code;
    newError.meta = error.meta;
    throw newError;
  }
}

export const getScreenConfig = async (screenId: string) => {
  try {
    console.log('getScreenConfig called with screenId:', screenId);

    const configs = await prisma.screenConfig.findMany({
      where: {
        screenId: screenId
      },
      orderBy: {
        mediaIndex: 'asc'
      }
    });

    const result = await Promise.all(configs.map(async (config: any) => {
      const media = config.mediaId ? await prisma.media.findUnique({
        where: { id: config.mediaId }
      }) : null;

      const template = config.templateId ? await prisma.template.findUnique({
        where: { id: config.templateId }
      }) : null;

      // TemplateConfig varsa, Template bilgisini de al
      let templateConfig = null;
      if (config.templateConfigId) {
        templateConfig = await prisma.templateConfig.findUnique({
          where: { id: config.templateConfigId },
          include: { Template: true }
        });
        // TemplateConfig varsa, Template bilgisini TemplateConfig'den al
        if (templateConfig && templateConfig.Template) {
          const templateFromConfig = templateConfig.Template;
          return {
            ...config,
            Media: media,
            Template: templateFromConfig, // TemplateConfig'deki Template'i kullan
            TemplateConfig: templateConfig,
            screen: await prisma.screen.findUnique({
              where: { id: config.screenId }
            })
          };
        }
      }

      const screen = await prisma.screen.findUnique({
        where: { id: config.screenId }
      });

      return {
        ...config,
        Media: media,
        Template: template,
        TemplateConfig: templateConfig,
        screen: screen
      };
    }));

    console.log('getScreenConfig result:', JSON.stringify(result, null, 2));
    return result;
  } catch (err: any) {
    console.error('getScreenConfig error:', err);
    console.error('Error stack:', err.stack);
    console.error('Error code:', err.code);
    console.error('Error meta:', err.meta);
    throw new Error('Screen config verisi getirilemedi: ' + err.message)
  }
}

export const getScreenName = async (id: string) => {
  try {
    return await prisma.screen.findUnique({
      where: {
        id: id
      },
      select: {
        name: true
      }
    })
  } catch (err: any) {
    throw new Error(`Screen name getirilemedi: ${err.message}`)
  }
}

export const deleteScreen = async (id: string) => {
  try {
    return await prisma.screen.delete({
      where: {
        id: id
      }
    })
  } catch (error: any) {
    throw new Error('Ekran silme başarısız: ', error.message);
  }
}

