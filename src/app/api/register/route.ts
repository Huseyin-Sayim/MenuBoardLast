import { NextResponse } from "next/server";
import { register } from "@/services/authServices";
import { registerBackendSchema } from "@/lib/validate/validatesSchemas";

export async function POST (req : Request) {
  try {
    const data = await req.json();

    // Zod validation - Backend'de de kontrol ediyoruz
    const validatedData = registerBackendSchema.parse(data);

    const user = await register(validatedData);

    return NextResponse.json({
      message: "Kullanıcı başarıyla eklendi",
      data: user
    }, {status: 201})

  } catch (error: any) {
    // Zod validation hatası
    if (error.errors) {
      const errorMessages = error.errors.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return NextResponse.json({
        message: `Validasyon hatası: ${errorMessages}`
      }, {status: 400})
    }

    // Diğer hatalar
    return NextResponse.json({
      message: error.message || "Beklenmedik bir hata oluştu"
    }, {status: 400})
  }
}