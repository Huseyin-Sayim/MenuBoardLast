import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import {
    getTemplateConfigAsMenuData,
    saveTemplateConfigWithMenuData,
    getDeviceIdsByConfigId,
} from "@/services/menuDataServices";
import { normalizeDashboardDataToMenuData } from "@/utils/menuDataUtils";

/**
 * GET: Template config'ini IMenuData formatında getir
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1] || request.cookies.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        const userId = payload.userId as string;

        const { searchParams } = new URL(request.url);
        const templateId = searchParams.get("templateId");
        const configId = searchParams.get("configId");

        if (!templateId && !configId) {
            return NextResponse.json(
                { message: "templateId veya configId gerekli" },
                { status: 400 }
            );
        }

        const result = await getTemplateConfigAsMenuData(
            userId,
            templateId || "",
            configId || undefined
        );

        if (!result) {
            return NextResponse.json(
                { message: "Config bulunamadı" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            config: result.config,
            menuData: result.menuData,
        });
    } catch (error: any) {
        console.error("GET /api/menu-data hatası:", error.message);
        return NextResponse.json(
            { message: error.message || "Sunucu hatası" },
            { status: 500 }
        );
    }
}

/**
 * POST: Template config'ini IMenuData formatında kaydet
 */
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1] || request.cookies.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        const userId = payload.userId as string;

        const body = await request.json();
        const { templateId, configId, menuData, rawData, notifyDevices = true } = body;

        if (!templateId) {
            return NextResponse.json(
                { message: "templateId gerekli" },
                { status: 400 }
            );
        }

        // rawData geldiyse IMenuData formatına dönüştür
        const normalizedMenuData = rawData
            ? normalizeDashboardDataToMenuData(rawData)
            : menuData;

        if (!normalizedMenuData) {
            return NextResponse.json(
                { message: "menuData veya rawData gerekli" },
                { status: 400 }
            );
        }

        // Önce kaydet
        let deviceIds: string[] = [];

        // Eğer notifyDevices true ise ve mevcut bir config güncelleniyorsa,
        // bu config'e bağlı cihazları bul
        if (notifyDevices && configId) {
            deviceIds = await getDeviceIdsByConfigId(configId);
        }

        const result = await saveTemplateConfigWithMenuData({
            userId,
            templateId,
            configId,
            menuData: normalizedMenuData,
            deviceIds,
        });

        return NextResponse.json({
            success: true,
            configId: result.configId,
            notifiedDevices: result.notifiedDevices,
        });
    } catch (error: any) {
        console.error("POST /api/menu-data hatası:", error.message);
        return NextResponse.json(
            { message: error.message || "Sunucu hatası" },
            { status: 500 }
        );
    }
}
