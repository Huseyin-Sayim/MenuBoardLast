import prisma from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
  try {
    const users= await prisma.user.findMany()

    return NextResponse.json({
      message: "Kullanıcılar getirildi",
      data: users
    }, {status: 200});
  } catch (error: any) {
    return NextResponse.json({
      message: error.message
    }, {status: 500})
  }
}