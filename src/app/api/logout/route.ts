import { NextResponse } from "next/server";
import { logout } from "@/services/authServices";

export async function POST (req : Request) {
  try {
    const data = await req.json();

    const user = await logout(data);

    return NextResponse.json({
      message: "Kullanıcı başarıyla çıkış yaptı",
      data: user
    }, {status: 200})

  } catch (error: any) {
    return NextResponse.json({
      message: error.message || "Beklenmedik bir hata oluştu"
    }, {status: 400})
  }
}