"use server"
import prisma from "@/generated/prisma";

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

export const createScreen = async (data: {name: string, userId: string, width: number, height: number, deviceId?: string, device?: string}) => {
  try {
    const {name, userId, width, height, deviceId, device} = data;
    const finalDeviceId = deviceId || device;

    if (!finalDeviceId) {
      throw new Error('deviceId veya device parametresi gerekli');
    }

    return await prisma.screen.create({
      data: {
        name: name,
        deviceId: finalDeviceId,
        user: {
          connect: {id: userId}
        },
        width: width,
        height: height
      }
    })
  } catch (error: any) {
    // Unique constraint hatasını daha anlaşılır hale getir
    if (error.code === 'P2002' && error.meta?.target?.includes('deviceId')) {
      throw new Error('Bu deviceId zaten kullanılıyor. Farklı bir deviceId kullanın.');
    }
    throw new Error('Ekran eklenmedi: ' + error.message);
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

export const updateScreenConfig = async (
  screenId: string,
  configs: {mediaId: string, mediaIndex: number, duration:number}[]
) => {
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














