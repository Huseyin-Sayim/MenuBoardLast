import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { deviceId, screenConfig } = await req.json();

    if (!deviceId || !screenConfig) {
      return NextResponse.json({ error: "Eksik veri gönderdin!" }, { status: 400 });
    }

    // @ts-ignore
    const io = global.io;

    if (io) {
      io.to(deviceId).emit("SCREEN_CONFIG_UPDATE", screenConfig);
      console.log(`> [API] ${deviceId} için güncelleme gönderildi.`);
      return NextResponse.json({success: true, message: 'Cihaz güncelleniyor'});
    } else {
      return NextResponse.json({ error: "Soket sunucusuna bağlanamadı!" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucuda bir sıkıntı oluştu" }, { status: 500 })
  }
}