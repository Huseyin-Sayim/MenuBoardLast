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
          connect: {id: deviceCode.userId}
        },
        width: deviceCode.width,
        height: deviceCode.height
      }
    })

    await prisma.deviceScreenCode.deleteMany({
      where: {
        code: code,
        OR: [
          {deviceId: deviceCode.deviceId}
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

export const createScreenCode = async (data: {userId: string, width: number, height: number, deviceId: string}) => {
  try {
    const {userId, width, height, deviceId} = data;
    let attempts = 0;
    const maxAttempts = 5;

    if (!deviceId || deviceId === "" ) {
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
              connect: {id: userId}
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
    throw new Error('Doğrulama kodu oluşturulamadı',error.message);
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

export const updateScreenConfig = async (screenId: string, configs: {mediaId: string, mediaIndex: number, duration:number}[]) => {
  try {
    // Önce mevcut config'leri sil (veri yoksa hiçbir şey yapmaz, hata vermez)
    await prisma.screenConfig.deleteMany({
      where: {
        screenId: screenId
      }
    });

    // Configs array'i boşsa, sadece silme işlemini yaptık, bitir
    if (!configs || configs.length === 0) {
      return [];
    }

    // Yeni config'leri ekle
    const createPromises = configs.map((config) =>
      prisma.screenConfig.create({
        data: {
          screen: {
            connect: { id: screenId }
          },
          Media: {
            connect: { id: config.mediaId }
          },
          mediaIndex: config.mediaIndex,
          displayDuration: config.duration || 10
        }
      })
    );

    const results = await Promise.all(createPromises);
    return results;

  } catch (error: any) {
    throw new Error('Screen config güncellenemedi: ' + error.message);
  }
}

export const getScreenConfig = async (screenId:string) => {
  try {
    return await prisma.screenConfig.findMany({
      where: {
        screenId: screenId
      },
      include: {
        Media:true,
        screen:true
      },
      orderBy: {
        mediaIndex: 'asc'
      }
    })
  } catch (err: any) {
    throw new Error('Screen config verisi getirilemedi: ',err.message)
  }
}

export const getScreenName = async (id:string) => {
  try {
    return await prisma.screen.findUnique({
      where: {
        id:id
      },
      select: {
        name:true
      }
    })
  } catch (err : any) {
    throw new Error(`Screen name getirilemedi: ${err.message}`)
  }
}

