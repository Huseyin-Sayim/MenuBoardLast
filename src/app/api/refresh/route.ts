import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";
import jwt from "jsonwebtoken";

export async function POST (req: Request){
  const {refreshToken} = await req.json();

  if (!refreshToken) {
    return NextResponse.json({ message: "Token bulunamadı" }, { status: 401 });
  }

  try {
    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      if (savedToken) await prisma.refreshToken.delete({ where: { id: savedToken.id } });
      return NextResponse.json({ message: "Geçersiz refresh token" }, { status: 403 });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {userId: string};

    const newAccessToken = jwt.sign(
      { userId: savedToken.user.id, email: savedToken.user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      {expiresIn: '15m'}
    )

    return NextResponse.json({accessToken: newAccessToken});

  } catch (error: any) {
    return NextResponse.json({ message: "Oturum yenilenemedi" }, { status: 403 });
  }

}