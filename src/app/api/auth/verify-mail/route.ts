import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "Geçersiz token" }, { status: 400 });
  }
  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "Geçersiz veya süresi dolmuş token" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isValidate: true,
      verifyToken: null,
    },
  });
  const loginUrl = new URL("/?verified=true", request.url);
  return NextResponse.redirect(loginUrl);
}