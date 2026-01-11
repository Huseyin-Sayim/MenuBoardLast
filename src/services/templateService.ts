"use server"

import prisma from "@/generated/prisma";
import { NextResponse } from "next/server";

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

export const getTemplateByUserId = async (userId: string) => {
  try {
    if (!userId) {
      return
    }

    return await prisma.templateConfig.findMany({
      where: {
        userId : userId
      },
      select: {
        Template: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })


  } catch (error: any) {
    throw new Error('kullanıcı şablon verisi getirilemedi', error.message);
  }
}