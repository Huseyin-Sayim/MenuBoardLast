import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/generated/prisma";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user')?.value;

    if (!userCookies) {
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı.' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookies) as { id: string };

    const userConfigs = await prisma.templateConfig.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        Template: {
          select: {
            id: true,
            name: true,
            path: true,
            component: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Her config için template bilgisini içeren objeler oluştur
    // Aynı template'in farklı config'lerini ayırt etmek için isimlendirme
    const templateConfigCounts = new Map<string, number>();
    const templates = userConfigs.map((config: any) => {
      const templateKey = config.Template.component || config.Template.id;
      const currentCount = (templateConfigCounts.get(templateKey) || 0) + 1;
      templateConfigCounts.set(templateKey, currentCount);
      
      // Her config için benzersiz isim oluştur
      const baseName = config.Template.name;
      const configName = currentCount > 1 
        ? `${baseName} - Config ${currentCount}` 
        : baseName;
      
      return {
        id: config.id, // Config ID'si - unique key için
        templateId: config.Template.id, // Template ID'si
        name: configName, // Her config için benzersiz isim
        path: config.Template.path,
        component: config.Template.component,
        configId: config.id, // Config ID'si (referans için)
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      };
    });

    return NextResponse.json({
      data: templates,
      count: templates.length
    }, { status: 200 });

  } catch (err: any) {
    console.error('Kullanıcı template\'leri getirilirken hata:', err);
    return NextResponse.json(
      { message: 'Template\'ler getirilemedi: ' + err.message },
      { status: 500 }
    );
  }
}