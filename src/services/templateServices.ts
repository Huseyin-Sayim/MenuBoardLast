import { prisma } from '@/generated/prisma'

export async function saveTemplateConfig(
  userId: string,
  templateId: string,
  configData: { category: any; data: any[] },
) {
  try {
    console.log('saveTemplateConfig çağrıldı:', { userId, templateId, configData });
    
    let dbTemplateId = templateId;
    
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      const name = templateId === 'template-1' ? 'Şablon 1' : 
                   templateId === 'template-2' ? 'Şablon 2' : 
                   templateId === 'template-3' ? 'Şablon 3' : 'Şablon';
      const component = templateId;
      
      let template = await prisma.template.findFirst({
        where: { path: path },
      });
      
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
      const existingTemplate = await prisma.template.findUnique({
        where: { id: templateId },
      });
      
      if (!existingTemplate) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
    }
    
    console.log('Kullanılacak dbTemplateId:', dbTemplateId);
    
    const existingConfig = await prisma.templateConfig.findFirst({
      where: {
        userId,
        templateId: dbTemplateId,
      },
    });
    
    let saveConfig;
    if (existingConfig) {
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
    let dbTemplateId = templateId;
    
    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      
      let template = await prisma.template.findFirst({
        where: { path: path },
      });
      
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
