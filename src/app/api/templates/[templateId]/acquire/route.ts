import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { acquireTemplate } from "@/services/templateServices";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;

    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user')?.value;

    if (!userCookies) {
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı.' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookies) as { id: string };

    const result = await acquireTemplate(user.id, templateId);

    return NextResponse.json({
      message: 'Şablon başarıyla alındı.',
      data: result
    }, { status: 200 });

  } catch (err: any) {
    console.error('Şablon alınırken hata:', err);
    return NextResponse.json(
      { message: 'Şablon alınamadı: ' + err.message },
      { status: 500 }
    );
  }
}