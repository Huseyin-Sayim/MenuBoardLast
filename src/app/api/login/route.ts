import { login } from "@/services/authServices";
import { NextResponse } from "next/server";

export async function POST (req : Request) {
  try {
    const data = await req.json();

    const result = await login(data);

    return NextResponse.json({
      message: "Giriş Başarılı",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }, {status: 200})

  } catch (error : any) {
    return NextResponse.json({
      message: error.message || "Giriş işlemi sırasında bir hata oluştu"
    }, { status: 401 });
  }
}