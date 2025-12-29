import { getMedia } from "@/services/mediaServices";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : {params: Promise<{id:string}>}) {
  try {
    const {id: userId} = await params;

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID'si eksik!" }, { status: 400 });
    }

    const userMedia = await getMedia(userId);

    return NextResponse.json({
      data: userMedia
    }, {status: 200});
  } catch (error: any) {
    console.error("Kullanıcı medyası çekilirken hata:", error);
    return NextResponse.json({ error: "Veriler çekilemedi!" }, { status: 500 });
  }
}