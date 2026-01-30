"use server"
import prisma from "@/generated/prisma";
import path from "path";
import fs from "fs/promises";

// Base URL for gallery files
const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function getAllGalleryImages() {
  try {
    return await prisma.gallery.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (err: any) {
    console.error('Galeri getirilirken hata oluştu: ' + err.message);
    throw new Error('Galeri getirme hatası: ' + err.message);
  }
}

export async function createGalleryImage(formData: FormData) {
  const file = formData.get('file') as File;
  const fileExtension = path.extname(file.name);
  const originalFileName = file.name;

  // Güvenli dosya adı oluştur (özel karakterleri temizle)
  const safeFileName = `${Date.now()}-${originalFileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;

  if (!file.type.startsWith('image/')) {
    throw new Error('Sadece resim dosyaları eklenebilir.');
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  const filePath = path.join(uploadDir, safeFileName);
  const relativePath = `/uploads/gallery/${safeFileName}`;
  const publicUrl = `${getBaseUrl()}${relativePath}`;

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return await prisma.gallery.create({
      data: {
        name: safeFileName,
        extension: fileExtension,
        url: publicUrl
      }
    })
  } catch (err: any) {
    console.error('Galeriye resim eklenirken hata oluştu: ' + err.message);
    throw new Error('Gallery resim ekleme hatası: ' + err.message);
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const galleryImage = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!galleryImage) {
      throw new Error('Galeri resmi bulunamadı.');
    }

    const deleted = await prisma.gallery.delete({
      where: { id }
    })

    try {
      const filePath = path.join(process.cwd(), "public", galleryImage.url)
      await fs.unlink(filePath)
    } catch (err: any) {
      console.error('Dosya silinirken hata oluştu: ' + err.message);
    }
    return deleted;

  } catch (err: any) {
    console.error('Galeri resim silme işleminde hata oluştu: ' + err.message);
    throw new Error('Gallery resim silme hatası : ' + err.message);
  }
}






















