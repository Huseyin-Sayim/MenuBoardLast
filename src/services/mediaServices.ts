"use server"
import prisma from "@/generated/prisma";
import path from "path";
import fs from "fs/promises"

// Base URL for media files
const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const getMedia = async (id: string) => {
  try {
    return await prisma.media.findMany({
      where: {
        userId : id
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (error: any) {
    throw new Error('Media verisine erişilemedi: ' + error.message)
  }
}

export const getMediaById = async (id: string) => {
  try {
    return await prisma.media.findFirst({
      where: {id: id}
    })
  } catch (error: any) {
    throw new Error('Media verisi getirilmedi' + error.message);
  }
}

export const createMedia = async (formData: FormData, userId: string, signal?: AbortSignal) =>   {
  const file = formData.get('file') as File;
  const fileExtension = path.extname(file.name);
  const fileName = file.name;
  let subDir = "other";

  if (file.type.startsWith('image/')) {
    subDir = "images";
  } else if (file.type.startsWith('video/')) {
    subDir = 'videos';
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
  const filePath = path.join(uploadDir, fileName);
  const relativePath = `/uploads/${subDir}/${fileName}`;
  const publicUrl = `${getBaseUrl()}${relativePath}`;

  try {
    await fs.mkdir(uploadDir, {recursive: true})
    
    // Dosya yazma işlemi
    // Abort signal kontrolü
    if (signal?.aborted) {
      throw new Error('Upload cancelled');
    }
    
    // File'ı stream olarak oku ve yaz
    // Büyük dosyalar için daha verimli
    const arrayBuffer = await file.arrayBuffer();
    
    // Tekrar abort kontrolü
    if (signal?.aborted) {
      throw new Error('Upload cancelled');
    }
    
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return await prisma.media.create({
      data: {
        name: fileName,
        user: {
          connect: {id: userId}
        },
        extension: fileExtension,
        url: publicUrl
      }
    })
  } catch (error: any) {
    // Hata durumunda yüklenen dosyayı temizle
    try {
      await fs.unlink(filePath).catch(() => {});
    } catch {}
    
    throw new Error('Media eklenmedi: ' + error.message);
  }
}


export const updateMediaName = async (id: string, newName: string) => {
  try {
    return await prisma.media.update({
      where: { id: id },
      data: { name: newName }
    });
  } catch (error: any) {
    throw new Error(`DB Güncellenemedi: ${error.message}`);
  }
}

export const getFormattedMedia = async (userId: string) => {
  const rawData = await getMedia(userId); // Mevcut getMedia fonksiyonunu kullanır

  return rawData.map((item: { extension: string; id: any; name: any; url: any; createdAt: { toLocaleDateString: (arg0: string) => any; }; }) => {
    const isVideo = ["mp4", "webm", "ogg", "mov"].includes(
      item.extension.toLowerCase().replace(".", "")
    );

    // URL'yi tam URL formatına dönüştür (eğer zaten tam URL değilse)
    const baseUrl = getBaseUrl();
    const fullUrl = item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`;

    return {
      id: item.id,
      name: item.name,
      type: (isVideo ? "video" : "image") as "video" | "image",
      url: fullUrl,
      uploadedAt: item.createdAt.toLocaleDateString("tr-TR"),
      duration: 0,
    };
  });
};

export const deleteMedia = async (id: string)=> {
  try {
    return await prisma.media.delete({
      where: { id: id }
    })
  } catch (error: any) {
    throw new Error('Media silme başarısız: ', error.message);
  }
}