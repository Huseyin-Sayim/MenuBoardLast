import { getMedia } from "@/services/mediaServices";
import { NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function GET(req: Request, {params} : {params: Promise<{id:string}>}) {
  try {
    const {id: userId} = await params;

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID'si eksik!" }, { status: 400 });
    }

    // Token'dan kullanıcı bilgisini al
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value;
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.split(' ')[1];
    const token = headerToken || cookieToken;

    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        const currentUserId = (payload as any).userId;
        const userRole = (payload as any).role;

        // Admin değilse sadece kendi medyasını görebilir
        if (userRole !== "admin" && currentUserId !== userId) {
          return NextResponse.json({ 
            error: "Bu işlem için yetkiniz yok. Sadece kendi medyanızı görebilirsiniz." 
          }, { status: 403 });
        }
      } catch (tokenError) {
        return NextResponse.json({ 
          error: "Geçersiz token" 
        }, { status: 401 });
      }
    } else {
      return NextResponse.json({ 
        error: "Yetkisiz erişim" 
      }, { status: 401 });
    }

    const userMedia = await getMedia(userId);

    return NextResponse.json({
      data: userMedia
    }, {status: 200});
  } catch (error: any) {
    console.error("Kullanıcı medyası çekilirken hata:", error);
    return NextResponse.json({ error: error.message || "Veriler çekilemedi!" }, { status: 500 });
  }
}