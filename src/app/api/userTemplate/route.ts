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

    const userTemplates = await prisma.templateConfig.findMany({
      where: {
        userId: user.id,
      },
      select: {
        Template: {
          select: {
            id: true,
            name: true,
            path: true,
            component: true,
          }
        }
      }
    });

    const templates = userTemplates.map((ut: any) => ut.Template).filter(Boolean);

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