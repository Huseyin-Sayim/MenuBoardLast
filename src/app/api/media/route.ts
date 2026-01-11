import prisma from "@/generated/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

// App Router için zorunlu ayarlar
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let filePath: string | null = null;

  try {
    // 1. Bilgileri Query Params ve Header'dan al (FormData kullanmıyoruz!)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const fileNameHeader = req.headers.get('x-file-name');
    const fileType = req.headers.get('content-type') || '';

    if (!userId || !fileNameHeader) {
      return NextResponse.json({ error: "UserId veya Dosya adı eksik!" }, { status: 400 });
    }

    const decodedFileName = decodeURIComponent(fileNameHeader);

    // 2. Klasör Belirleme
    const subDir = fileType.startsWith('image/') ? "images" : (fileType.startsWith('video/') ? "videos" : "other");
    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeFileName = `${Date.now()}-${decodedFileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
    filePath = path.join(uploadDir, safeFileName);
    const publicUrl = `/uploads/${subDir}/${safeFileName}`;

    // 3. STREAMING: Gelen ham veriyi (Body) doğrudan diske yaz
    if (!req.body) {
      throw new Error("Request body boş!");
    }

    // Web stream'i Node stream'ine çevir
    const nodeReadableStream = Readable.fromWeb(req.body as any);
    const writeStream = fs.createWriteStream(filePath);

    // Veriyi akıt (RAM'i şişirmez, limiti aşar)
    await pipeline(nodeReadableStream, writeStream);

    // 4. Veritabanı Kaydı
    const saveMedia = await prisma.media.create({
      data: {
        name: safeFileName,
        user: {
          connect: { id: userId }
        },
        extension: path.extname(decodedFileName),
        url: publicUrl
      }
    });

    return NextResponse.json({
      message: "Başarıyla yüklendi!",
      data: saveMedia
    }, { status: 201 });

  } catch (error: any) {
    console.error('CRITICAL SERVER ERROR:', error);

    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }

    return NextResponse.json({
      error: "Sunucu hatası!",
      details: error.message
    }, { status: 500 });
  }
}