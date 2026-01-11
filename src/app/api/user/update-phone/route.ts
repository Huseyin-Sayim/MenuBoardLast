import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;

    if (!userCookie) {
      return NextResponse.json(
        {
          error: "Kullanıcı oturumu bulunamadı",
        },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie) as { id: string };
    const { phoneNumber } = await req.json();

    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim() === '') {
      return NextResponse.json(
        {
          error: "Telefon numarası gereklidir",
        },
        { status: 400 }
      );
    }

    const trimmedPhoneNumber = phoneNumber.trim();

    // Telefon numarasının başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber: trimmedPhoneNumber,
        NOT: {
          id: user.id
        }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Bu telefon numarası zaten kullanılıyor",
        },
        { status: 409 }
      );
    }

    // Telefon numarasını güncelle
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        phoneNumber: trimmedPhoneNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      }
    });

    return NextResponse.json(
      {
        message: "Telefon numarası başarıyla güncellendi",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Telefon numarası güncellenirken hata:', error);
    
    // Prisma unique constraint hatası
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: "Bu telefon numarası zaten kullanılıyor",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Telefon numarası güncellenirken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}

