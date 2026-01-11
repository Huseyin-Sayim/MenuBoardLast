import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllTemplateConfigs } from "@/services/templateServices";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user')?.value;

    if (!userCookies) {
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookies) as { id: string };
    const configs = await getAllTemplateConfigs(user.id, templateId);

    return NextResponse.json({
      message: 'Konfigrasyonlar başarıyla getirildi.',
      data: configs,
      count: configs.length
    }, { status: 200 });

  } catch (err: any) {
    console.error('Konfigrasyonlar getirilirken hata:', err);
    return NextResponse.json(
      { message: 'Konfigrasyonlar getirilemedi: ' + err.message },
      { status: 500 }
    );
  }
}

