import { NextResponse } from "next/server";
import { prisma } from "@/generated/prisma";
import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const TEMPLATES_DIR = join(process.cwd(), 'public', 'images', 'templates');

// Templates klasörünün var olduğundan emin ol
async function ensureTemplatesDir() {
    if (!existsSync(TEMPLATES_DIR)) {
        await mkdir(TEMPLATES_DIR, { recursive: true });
    }
}

/**
 * Template için varsayılan önizleme resmi oluşturur
 */
async function generateTemplatePreview(
    templatePath: string,
    component: string,
    width: number = 1920,
    height: number = 1080
): Promise<string> {
    let browser;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3005';
        const fullUrl = `${baseUrl}${templatePath}?preview=true`;

        console.log(`Generating preview for ${component} from URL: ${fullUrl}`);

        await ensureTemplatesDir();

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
            ],
        });

        const page = await browser.newPage();

        // Viewport ayarla
        await page.setViewport({
            width,
            height,
            deviceScaleFactor: 1,
        });

        // Sayfayı yükle
        await page.goto(fullUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000,
        });

        // Tüm resimlerin yüklenmesini bekle
        await page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(
                images.map((img) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                        setTimeout(resolve, 5000);
                    });
                })
            );
        });

        // Animasyonlar için ekstra bekleme
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Screenshot al (PNG formatında)
        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: false,
        });

        // Dosya adı: template-X-preview.png
        const filename = `${component}-preview.png`;
        const filepath = join(TEMPLATES_DIR, filename);

        // Dosyayı kaydet
        await writeFile(filepath, screenshot);

        const publicUrl = `/images/templates/${filename}`;
        console.log(`Preview saved: ${publicUrl}`);

        return publicUrl;
    } catch (error: any) {
        console.error(`Preview generation error for ${component}:`, error);
        throw new Error(`Preview oluşturulamadı: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

/**
 * GET /api/templates/generate-previews
 * Tüm template'ler için varsayılan önizleme resimleri oluşturur
 */
export async function GET(req: Request) {
    try {
        // Tüm template'leri al
        const templates = await prisma.template.findMany({
            orderBy: { createdAt: 'asc' }
        });

        if (!templates || templates.length === 0) {
            return NextResponse.json({
                message: "Hiç template bulunamadı",
                data: []
            }, { status: 404 });
        }

        const results: { component: string; previewUrl: string; success: boolean; error?: string }[] = [];

        // Her template için önizleme oluştur
        for (const template of templates) {
            try {
                // Template boyutlarını belirle
                let width = 1920;
                let height = 1080;

                // Portrait template'ler için boyut düzelt (9:16)
                if (template.component === 'template-9' || template.component === 'template-11') {
                    width = 1080;
                    height = 1920;
                }

                const previewUrl = await generateTemplatePreview(
                    template.path,
                    template.component,
                    width,
                    height
                );

                results.push({
                    component: template.component,
                    previewUrl,
                    success: true
                });
            } catch (error: any) {
                results.push({
                    component: template.component,
                    previewUrl: '',
                    success: false,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            message: `${successCount} template önizlemesi oluşturuldu, ${failCount} başarısız`,
            data: results
        }, { status: 200 });

    } catch (err: any) {
        console.error('Generate previews error:', err);
        return NextResponse.json({
            message: 'Önizlemeler oluşturulamadı: ' + err.message,
            error: err.message
        }, { status: 500 });
    }
}
