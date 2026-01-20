import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Bu email adresine kayıtlı kullanıcı bulunamadı" }, { status: 404 });
    }
    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { email },
      data: {
        resetCode: code,
        resetCodeExpires: expires
      }
    });
    await sendPasswordResetEmail(email, code);
    return NextResponse.json({ message: "Doğrulama kodu gönderildi" });
  } catch (error: any) {
    console.error('SERVER ERROR (forgot-password):', error);
    return NextResponse.json({ message: "Bir hata oluştu: " + error.message }, { status: 500 });
  }
}