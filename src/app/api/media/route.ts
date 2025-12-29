import { createMedia } from "@/services/mediaServices";
import { NextResponse } from "next/server";

const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: "Dosya (file) bulunamadı!" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User ID bulunamadı!" }, { status: 400 });
    }

    const saveMedia = await createMedia(formData, userId);

    return NextResponse.json({
      message: "Başarıyla yüklendi!",
      data: saveMedia
    }, {status: 201});

  } catch (error: any) {
    return NextResponse.json({
      error: "Yükleme başarısız!",
      details: error.message
    }, { status: 500 });
  }
}