"use server"

import prisma from "@/generated/prisma";

export async function getAllTemplates() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!templates || !Array.isArray(templates)) {
      return [];
    }

    return templates;
  } catch (err: any) {
    console.error('Template listesi getirilirken hata oluştu:', err.message);
    return [];
  }
}