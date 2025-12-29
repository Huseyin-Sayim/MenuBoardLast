import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Kullanıcı ID'si gerekli",
        },
        { status: 400 }
      );
    }

    // Önce kullanıcıyı bul ve rolünü kontrol et
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Kullanıcı bulunamadı",
        },
        { status: 404 }
      );
    }

    // Admin kullanıcılar silinemez
    if (user.role === "admin") {
      return NextResponse.json(
        {
          message: "Admin rolündeki kullanıcılar silinemez",
        },
        { status: 403 }
      );
    }

    // Kullanıcıyı sil
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Kullanıcı başarıyla silindi",
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Kullanıcı bulunamadı hatası
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          message: "Kullanıcı bulunamadı",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: error.message || "Kullanıcı silinirken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

