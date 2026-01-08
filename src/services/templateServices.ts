import { prisma } from '@/generated/prisma'

export async function saveTemplateConfig(
  userId: string,
  templateId: string,
  configData: { category: any; data: any[] },
) {
  try {
    console.log('saveTemplateConfig çağrıldı:', { userId, templateId, configData });
    
    // Template ID'yi path'e göre bul veya oluştur
    let dbTemplateId = templateId;
    
    // Eğer templateId "template-1" gibi bir string ise, veritabanında path'e göre bul
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      const name = templateId === 'template-1' ? 'Şablon 1' : 
                   templateId === 'template-2' ? 'Şablon 2' : 
                   templateId === 'template-3' ? 'Şablon 3' : 'Şablon';
      const component = templateId;
      
      // Template'i path'e göre bul
      let template = await prisma.template.findFirst({
        where: { path: path },
      });
      
      // Yoksa oluştur
      if (!template) {
        template = await prisma.template.create({
          data: {
            name,
            path,
            component,
          },
        });
        console.log('Template oluşturuldu:', template);
      } else {
        console.log('Template bulundu:', template);
      }
      
      dbTemplateId = template.id;
    } else {
      // UUID formatında ise direkt kullan, ama önce var mı kontrol et
      const existingTemplate = await prisma.template.findUnique({
        where: { id: templateId },
      });
      
      if (!existingTemplate) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
    }
    
    console.log('Kullanılacak dbTemplateId:', dbTemplateId);
    
    // Önce mevcut config'i kontrol et
    const existingConfig = await prisma.templateConfig.findFirst({
      where: {
        userId,
        templateId: dbTemplateId,
      },
    });
    
    let saveConfig;
    if (existingConfig) {
      // Varsa güncelle
      saveConfig = await prisma.templateConfig.update({
        where: {
          id: existingConfig.id,
        },
        data: {
          configData: configData as any,
          updatedAt: new Date(),
        },
      });
      console.log('Config güncellendi:', saveConfig);
    } else {
      // Yoksa oluştur
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
    
    // Prisma hatası ise daha detaylı mesaj
    if (err.code) {
      throw new Error(`Tamplate verisi kaydedilemedi: ${err.code} - ${err.message}`);
    }
    
    throw new Error(`Tamplate verisi kaydedilemedi: ${err.message}`);
  }
}

export async function getTemplateConfig(userId: string, templateId: string) {
  try {
    // Template ID'yi path'e göre bul veya oluştur
    let dbTemplateId = templateId;
    
    // Eğer templateId "template-1" gibi bir string ise, veritabanında path'e göre bul
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      
      // Template'i path'e göre bul
      let template = await prisma.template.findFirst({
        where: { path: path },
      });
      
      // Yoksa oluştur
      if (!template) {
        const name = templateId === 'template-1' ? 'Şablon 1' : 
                     templateId === 'template-2' ? 'Şablon 2' : 
                     templateId === 'template-3' ? 'Şablon 3' : 'Şablon';
        const component = templateId;
        
        template = await prisma.template.create({
          data: {
            name,
            path,
            component,
          },
        });
      }
      
      dbTemplateId = template.id;
    }
    
    // findFirst kullanarak composite unique constraint'i kontrol et
    return await prisma.templateConfig.findFirst({
      where: {
        userId,
        templateId: dbTemplateId,
      },
    });
  } catch (err : any) {
    console.log('Template verisi getirilirken hata oluştu: ',err.message);
    throw new Error('Tamplate verisi getirilemedi !!',err)
  }

}
