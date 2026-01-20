import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (!user.resetCode || user.resetCode !== code || !user.resetCodeExpires || new Date() > user.resetCodeExpires) {
      return NextResponse.json({ message: "Geçersiz veya süresi dolmuş işlem" }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
        resetCode: null,
        resetCodeExpires: null
      }
    });
    return NextResponse.json({ message: "Şifreniz başarıyla güncellendi" });
  } catch (error: any) {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}