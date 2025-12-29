import { NextResponse } from "next/server";
import { createScreen } from "@/services/screenServices";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newScreen = await createScreen(data);

    return NextResponse.json({
      newScreen,
      message: "Ekran başarıyla eklendi"
    }, {status: 201});

  } catch (error: any) {
    console.error('Screen creation error:', error);
    return NextResponse.json({
      message: 'Ekran ekleme başarısız oldu',
      error: error.message || 'Bilinmeyen hata'
    }, {status: 500})
  }
}