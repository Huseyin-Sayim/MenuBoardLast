import { prisma } from '@/generated/prisma'

export async function saveTemplateConfig(
  userId: string,
  templateId: string,
  configData: { category: any; data: any[] },
  configId?: string,
) {
  try {
    console.log('saveTemplateConfig çağrıldı:', { userId, templateId, configData, configId });
    
    let dbTemplateId = templateId;
    
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      const templateName = templateId === 'template-1' ? 'Şablon 1' : 
                   templateId === 'template-2' ? 'Şablon 2' : 
                   templateId === 'template-3' ? 'Şablon 3' : 
                   templateId === 'template-4' ? 'Şablon 4' :
                   templateId === 'template-5' ? 'Şablon 5' :
                   templateId === 'template-6' ? 'Şablon 6' : 'Şablon';
      const component = templateId;
      
      let template = await prisma.template.findFirst({
        where: { path: path },
      });

      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}. Lütfen önce template'i oluşturun.`);
      }
      
      dbTemplateId = template.id;
    } else {
      const existingTemplate = await prisma.template.findUnique({
        where: { id: templateId },
      });
      
      if (!existingTemplate) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
    }
    
    console.log('Kullanılacak dbTemplateId:', dbTemplateId);
    
    let saveConfig;
    
    // Eğer configId varsa, mevcut config'i güncelle
    if (configId) {
      const existingConfig = await prisma.templateConfig.findFirst({
        where: {
          id: configId,
          userId, // Güvenlik: sadece kullanıcının kendi config'ini güncelleyebilir
        },
      });
      
      if (!existingConfig) {
        throw new Error(`Config bulunamadı veya yetkiniz yok: ${configId}`);
      }
      
      saveConfig = await prisma.templateConfig.update({
        where: {
          id: configId,
        },
        data: {
          configData: configData as any,
          updatedAt: new Date(),
        },
      });
      console.log('Config güncellendi:', saveConfig);
    } else {
      // Yeni config oluştur
      saveConfig = await prisma.templateConfig.create({
        data: {
          userId,
          templateId: dbTemplateId,
          configData: configData as any,
        },
      });
      console.log('Config oluşturuldu:', saveConfig);
    }
    
    console.log('saveConfig sonucu:', saveConfig);
    
    if (!saveConfig) {
      console.error('saveConfig null veya undefined döndü');
      throw new Error("Tamplate verisi kaydedilemedi !!");
    }
    
    return saveConfig;
  } catch (err: any) {
    console.error("Template verisi kaydedilirken hata oluştu:", err);
    console.error("Hata detayı:", err.message);
    console.error("Hata stack:", err.stack);
    
    if (err.code) {
      throw new Error(`Tamplate verisi kaydedilemedi: ${err.code} - ${err.message}`);
    }
    
    throw new Error(`Tamplate verisi kaydedilemedi: ${err.message}`);
  }
}

export async function getTemplateConfig(userId: string, templateId: string, configId?: string) {
  try {
    // Eğer configId verilmişse, direkt o config'i getir
    if (configId) {
      const config = await prisma.templateConfig.findFirst({
        where: {
          id: configId,
          userId, // Güvenlik: sadece kullanıcının kendi config'ini getirebilir
        },
      });
      
      if (!config) {
        throw new Error(`Config bulunamadı veya yetkiniz yok: ${configId}`);
      }
      
      return config;
    }
    
    let dbTemplateId = templateId;
    
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      
      let template = await prisma.template.findFirst({
        where: { path: path },
      });

      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}. Lütfen önce template'i oluşturun.`);
      }
      
      dbTemplateId = template.id;
    }
    
    return await prisma.templateConfig.findFirst({
      where: {
        userId,
        templateId: dbTemplateId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err : any) {
    console.log('Template verisi getirilirken hata oluştu: ',err.message);
    throw new Error('Tamplate verisi getirilemedi !!',err)
  }

}

export async function getAllTemplateConfigs(userId: string, templateId: string) {
  try {
    let dbTemplateId = templateId;
    
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      
      let template = await prisma.template.findFirst({
        where: { path: path },
      });
      
      if (!template) {
        return []; // Template yoksa boş liste döndür
      }
      
      dbTemplateId = template.id;
    }
    
    return await prisma.templateConfig.findMany({
      where: {
        userId,
        templateId: dbTemplateId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err: any) {
    console.error('Template config listesi getirilirken hata oluştu:', err.message);
    throw new Error('Template config listesi getirilemedi: ' + err.message);
  }
}

export async function getAllTemplates() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!templates || !Array.isArray(templates)) {
      return [];
    }

    return templates;
  } catch (err: any) {
    console.error('Template listesi getirilirken hata oluştu:', err.message);
    return [];
  }
}

export async function createTemplate(data: { name: string; path: string; component: string }) {
  try {
    const template = await prisma.template.create({
      data: {
        name: data.name,
        path: data.path,
        component: data.component,
      },
    });

    return template;
  } catch (err: any) {
    console.error('Template oluşturulurken hata oluştu:', err.message);
    throw new Error('Template oluşturulamadı: ' + err.message);
  }
}

export async function acquireTemplate(userId: string, templateId: string) {
  try {
    let dbTemplateId = templateId;
    let template;
    
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      template = await prisma.template.findFirst({
        where: { path: path },
      });
      
      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
      
      dbTemplateId = template.id;
    } else {
      template = await prisma.template.findUnique({
        where: { id: templateId },
      });
      
      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
    }
    
    // Her zaman yeni config oluştur (mevcut config kontrolü yok)
    let defaultConfig: any = {};
    if (template.component === 'template-1' || template.component === 'template-5' || template.component === 'template-6') {
      defaultConfig = { category: "", data: [] };
    } else if (template.component === 'template-2') {
      defaultConfig = { categories: {}, data: {} };
    } else {
      defaultConfig = {};
    }
    
    const templateConfig = await prisma.templateConfig.create({
      data: {
        userId,
        templateId: dbTemplateId,
        configData: defaultConfig,
      },
    });
    
    // Config ve component bilgisini döndür
    return {
      ...templateConfig,
      component: template.component,
    };
  } catch (err: any) {
    console.error('Template alınırken hata oluştu:', err);
    throw new Error(`Template alınamadı: ${err.message}`);
  }
}




















