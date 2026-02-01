import { NextResponse } from "next/server";
import { prisma } from "@/generated/prisma";

/**
 * POST /api/templates/seed
 * Tüm varsayılan template'leri veritabanına ekler
 */
export async function POST(req: Request) {
    try {
        const defaultTemplates = [
            { name: "Şablon 1", path: "/design/template-1", component: "template-1" },
            { name: "Şablon 2", path: "/design/template-2", component: "template-2" },
            { name: "Şablon 3", path: "/design/template-3", component: "template-3" },
            { name: "Şablon 4", path: "/design/template-4", component: "template-4" },
            { name: "Şablon 5", path: "/design/template-5", component: "template-5" },
            { name: "Şablon 6", path: "/design/template-6", component: "template-6" },
            { name: "Şablon 7", path: "/design/template-7", component: "template-7" },
            { name: "Şablon 8", path: "/design/template-8", component: "template-8" },
            { name: "Şablon 9", path: "/design/template-9", component: "template-9" },
            { name: "Şablon 10", path: "/design/template-10", component: "template-10" },
            { name: "Şablon 11", path: "/design/template-11", component: "template-11" },
            { name: "Şablon 12", path: "/design/template-12", component: "template-12" },
            { name: "Şablon 13", path: "/design/template-13", component: "template-13" },
        ];

        const results = [];

        for (const template of defaultTemplates) {
            // Mevcut template var mı kontrol et
            const existing = await prisma.template.findFirst({
                where: { path: template.path }
            });

            if (existing) {
                results.push({ ...template, status: "already_exists", id: existing.id });
            } else {
                // Yeni template oluştur
                const created = await prisma.template.create({
                    data: template
                });
                results.push({ ...template, status: "created", id: created.id });
            }
        }

        const createdCount = results.filter(r => r.status === "created").length;
        const existingCount = results.filter(r => r.status === "already_exists").length;

        return NextResponse.json({
            message: `${createdCount} yeni template eklendi, ${existingCount} template zaten mevcut`,
            data: results
        }, { status: 200 });

    } catch (err: any) {
        console.error('Seed templates error:', err);
        return NextResponse.json({
            message: 'Template ekleme hatası: ' + err.message,
            error: err.message
        }, { status: 500 });
    }
}

/**
 * GET /api/templates/seed
 * Mevcut template listesini döndürür
 */
export async function GET(req: Request) {
    try {
        const templates = await prisma.template.findMany({
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({
            message: `${templates.length} template bulundu`,
            data: templates
        }, { status: 200 });

    } catch (err: any) {
        console.error('Get templates error:', err);
        return NextResponse.json({
            message: 'Template listesi alınamadı: ' + err.message,
            error: err.message
        }, { status: 500 });
    }
}
