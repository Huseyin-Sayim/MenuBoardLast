"use server";

import { prisma } from "@/generated/prisma";
import type { IMenuData, ISaveTemplateInput } from "../types/menu-data";
import { normalizeToMenuData, convertLegacyConfigToMenuData } from "../utils/menuDataUtils";

/**
 * Template config'ini IMenuData formatında getirir
 * Migration gerektirmeden mevcut JSON verisini okur
 */
export async function getTemplateConfigAsMenuData(
    userId: string,
    templateId: string,
    configId?: string
): Promise<{ config: any; menuData: IMenuData } | null> {
    try {
        let config;

        if (configId) {
            config = await prisma.templateConfig.findFirst({
                where: {
                    id: configId,
                    userId,
                },
            });
        } else {
            let dbTemplateId = templateId;

            if (templateId.startsWith("template-")) {
                const path = `/design/${templateId}`;
                const template = await prisma.template.findFirst({
                    where: { path },
                });

                if (!template) {
                    return null;
                }
                dbTemplateId = template.id;
            }

            config = await prisma.templateConfig.findFirst({
                where: {
                    userId,
                    templateId: dbTemplateId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        if (!config) {
            return null;
        }

        // configData'yı IMenuData formatına dönüştür
        const menuData = convertLegacyConfigToMenuData(config.configData);

        return {
            config,
            menuData,
        };
    } catch (error: any) {
        console.error("getTemplateConfigAsMenuData hatası:", error.message);
        throw new Error(`Template config getirilemedi: ${error.message}`);
    }
}

/**
 * IMenuData formatında veriyi kaydeder ve Socket.IO ile bildirim gönderir
 */
export async function saveTemplateConfigWithMenuData(
    input: ISaveTemplateInput
): Promise<{ success: boolean; configId: string; notifiedDevices: string[] }> {
    const { userId, templateId, configId, menuData, deviceIds = [] } = input;

    try {
        // Veriyi normalize et (ekstra güvenlik için)
        const normalizedData = normalizeToMenuData(menuData);

        // 📝 VERİTABANINA KAYDEDİLECEK VERİYİ LOGLA
        console.log('\n');
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║         💾 VERİTABANINA KAYDEDİLİYOR (IMenuData)             ║');
        console.log('╠══════════════════════════════════════════════════════════════╣');
        console.log(`║ 👤 User ID: ${userId}`);
        console.log(`║ 📄 Template ID: ${templateId}`);
        console.log(`║ 🔑 Config ID: ${configId || 'YENİ OLUŞTURULACAK'}`);
        console.log('╠══════════════════════════════════════════════════════════════╣');
        console.log(`║ 🎨 Theme: ${normalizedData.settings.theme}`);
        console.log(`║ 💰 Currency: ${normalizedData.settings.currency}`);
        console.log(`║ 📌 GlobalTitle: ${normalizedData.settings.globalTitle}`);
        console.log(`║ 📦 Ürün Sayısı: ${normalizedData.items.length}`);
        if (normalizedData.items.length > 0) {
            console.log('║ Ürünler (veritabanına kaydedilecek):');
            normalizedData.items.slice(0, 5).forEach((item, idx) => {
                const hasImage = item.image && item.image !== 'undefined';
                console.log(`║   ${idx + 1}. [${item.id}] ${item.title} - ${normalizedData.settings.currency}${item.price} | img: ${hasImage ? '✓' : '✗'}`);
            });
            if (normalizedData.items.length > 5) {
                console.log(`║   ... ve ${normalizedData.items.length - 5} ürün daha`);
            }
        }
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log('\n');

        // Template ID'yi bul
        let dbTemplateId = templateId;

        if (templateId.startsWith("template-")) {
            const path = `/design/${templateId}`;
            const template = await prisma.template.findFirst({
                where: { path },
            });

            if (!template) {
                throw new Error(`Template bulunamadı: ${templateId}`);
            }
            dbTemplateId = template.id;
        } else {
            const template = await prisma.template.findUnique({
                where: { id: templateId },
            });

            if (!template) {
                throw new Error(`Template bulunamadı: ${templateId}`);
            }
        }

        let savedConfig;

        if (configId) {
            // Mevcut config'i güncelle
            const existingConfig = await prisma.templateConfig.findFirst({
                where: {
                    id: configId,
                    userId,
                },
            });

            if (!existingConfig) {
                throw new Error(`Config bulunamadı veya yetkiniz yok: ${configId}`);
            }

            savedConfig = await prisma.templateConfig.update({
                where: { id: configId },
                data: {
                    configData: normalizedData as any,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Yeni config oluştur
            savedConfig = await prisma.templateConfig.create({
                data: {
                    userId,
                    templateId: dbTemplateId,
                    configData: normalizedData as any,
                },
            });
        }

        // Socket.IO ile cihazlara bildirim gönder
        const notifiedDevices: string[] = [];

        if (deviceIds.length > 0 && typeof global !== "undefined" && (global as any).io) {
            const io = (global as any).io;

            for (const deviceId of deviceIds) {
                try {
                    io.to(deviceId).emit("config-updated", {
                        configId: savedConfig.id,
                        templateId: dbTemplateId,
                        timestamp: new Date().toISOString(),
                    });
                    notifiedDevices.push(deviceId);
                    console.log(`[Socket.IO] config-updated eventi gönderildi: ${deviceId}`);
                } catch (socketError) {
                    console.error(`[Socket.IO] ${deviceId} için bildirim gönderilemedi:`, socketError);
                }
            }
        }

        return {
            success: true,
            configId: savedConfig.id,
            notifiedDevices,
        };
    } catch (error: any) {
        console.error("saveTemplateConfigWithMenuData hatası:", error.message);
        throw new Error(`Template config kaydedilemedi: ${error.message}`);
    }
}

/**
 * Config'e bağlı ekranları bulur ve deviceId listesi döndürür
 */
export async function getDeviceIdsByConfigId(configId: string): Promise<string[]> {
    try {
        const screenConfigs = await prisma.screenConfig.findMany({
            where: {
                templateConfigId: configId,
            },
            include: {
                screen: true,
            },
        });

        const deviceIds = screenConfigs
            .map((sc: { screen?: { deviceId: string } | null }) => sc.screen?.deviceId)
            .filter((id: string | undefined): id is string => !!id);

        return Array.from(new Set(deviceIds)); // Unique deviceIds
    } catch (error: any) {
        console.error("getDeviceIdsByConfigId hatası:", error.message);
        return [];
    }
}
