import { NextResponse } from "next/server";
import { createScreen, createScreenCode } from "@/services/screenServices";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const code = await createScreenCode(data)

    return NextResponse.json({
      code
    }, {status: 200})

  } catch (error: any) {
    console.error('Screen creation error:', error);
    return NextResponse.json({
      message: 'Ekran ekleme başarısız oldu',
      error: error.message || 'Bilinmeyen hata',
    }, {status: 500})
  }
}