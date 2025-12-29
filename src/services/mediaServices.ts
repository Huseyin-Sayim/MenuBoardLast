"use server"
import prisma from "@/generated/prisma";
import path from "path";
import fs from "fs/promises"

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
    throw new Error('Media verisine erişilemedi: ', error.message)
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

export const createMedia = async (formData: FormData, userId: string) =>   {
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
  const publicUrl = `/uploads/${subDir}/${fileName}`;

  try {
    await fs.mkdir(uploadDir, {recursive: true})
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath,buffer);

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
    throw new Error('Media eklenmedi: ', error.message);
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

  return rawData.map((item) => {
    const isVideo = ["mp4", "webm", "ogg", "mov"].includes(
      item.extension.toLowerCase().replace(".", "")
    );

    return {
      id: item.id,
      name: item.name,
      type: (isVideo ? "video" : "image") as "video" | "image",
      url: item.url,
      uploadedAt: item.createdAt.toLocaleDateString("tr-TR"),
      duration: 0,
    };
  });
};