import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";
export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    if (!user.resetCode || user.resetCode !== code) {
      return NextResponse.json({ message: "Geçersiz kod" }, { status: 400 });
    }
    if (!user.resetCodeExpires || new Date() > user.resetCodeExpires) {
      return NextResponse.json({ message: "Kodun süresi dolmuş" }, { status: 400 });
    }
    return NextResponse.json({ message: "Kod doğrulandı" });
  } catch (error: any) {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}