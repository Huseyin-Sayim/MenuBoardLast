import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";

export async function GET(req: Request) {
  try {
    // Tüm kullanıcıları getir - sadece gerekli alanları seç
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
      orderBy: {
        name: 'asc', // İsme göre alfabetik sıralama
      }
    });

    return NextResponse.json({
      message: "Kullanıcılar başarıyla getirildi",
      data: users,
      count: users.length
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      message: error.message || "Kullanıcılar getirilirken bir hata oluştu"
    }, { status: 500 });
  }
}

