import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";

export async function POST(req: Request) {
  try {
    const { email, phoneNumber } = await req.json()

    const results = {
      emailAvailable: true,
      phoneAvailable: true,
      emailMessage: "",
      phoneMessage: "",
    }

    if (email) {
      const checkEmail = await prisma.user.findFirst({
        where:{
          email: email.trim().toLowerCase()
        }
      })

      if (checkEmail) {
        results.emailAvailable = false;
        results.emailMessage = 'Bu mail zaten kayıtlı.'
      }
    }

    if (phoneNumber) {
      const checkPhoneNumber = await prisma.user.findFirst({
        where: {
          phoneNumber: phoneNumber.trim()
        }
      })

      if (checkPhoneNumber) {
        results.phoneAvailable = false;
        results.phoneMessage = 'Bu telefon numarası zaten kayıtlı.'
      }
    }

    return NextResponse.json(results,{status:200});

  } catch (err: any) {
    return NextResponse.json({
      error: err.message || 'Kontrol sırasında bir hata oluştu.'
    }, {status: 500});
  }
}

