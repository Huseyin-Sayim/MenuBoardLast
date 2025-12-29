import { NextResponse } from "next/server";
import { getScreenByDeviceId } from "@/services/screenServices";

export async function GET(req: Request, {params} : {params: Promise<{deviceId: string}>} ) {
  try {
    const {deviceId} = await params;
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID'si eksik!" }, { status: 400 });
    }

    const deviceScreen = await getScreenByDeviceId(deviceId);

    if (!deviceScreen) {
      return NextResponse.json({error: "Ekran bulunamadı"}, {status: 404});
    }

    return NextResponse.json({
      deviceScreen
    }, {status: 200})

  } catch (error: any) {
    console.error("SCREEN_GET_ERROR:", error);
    return NextResponse.json({
      error: 'Sunucu tarafında bir hata oluştu.',
      details: error.message
    }, { status: 500 });
  }
}