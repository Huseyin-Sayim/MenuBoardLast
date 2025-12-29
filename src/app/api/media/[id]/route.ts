import { NextResponse } from "next/server";
import prisma from "@/generated/prisma";

export async function GET(req: Request, {params} : {params: Promise<{id:string}>}) {
  try {
    const {id} = await params;
    if (!id) {
      return NextResponse.json({ error: "media id'si eksik!" }, { status: 400 });
    }

    const media = await prisma.media.findFirst({
      where: {
        id: id
      }
    });

    return NextResponse.json({
      data: media
    }, {status: 200});

  } catch (error: any) {
    return NextResponse.json({
      message: "media getirilemedi"
    }, {status: 500});
  }
}