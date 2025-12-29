import { NextResponse } from "next/server";
import { getScreen } from "@/services/screenServices";

export async function GET(req: Request, {params} : {params: Promise<{id:string}>}) {
  try {
    const {id: userId} = await params;

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı ID'si eksik!" }, { status: 400 });
    }

    const userScreen = await getScreen(userId);

    return NextResponse.json({
      data: userScreen
    }, {status: 200})

  } catch (error: any) {
    return NextResponse.json({
      message: 'Kullanıcı ekranları getirilmedi: ' + error.message
    }, {status: 500})
  }
}