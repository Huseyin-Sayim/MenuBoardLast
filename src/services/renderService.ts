import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const RENDERS_DIR = join(process.cwd(), 'public', 'renders');

// Renders klasörünün var olduğundan emin ol
async function ensureRendersDir() {
  if (!existsSync(RENDERS_DIR)) {
    await mkdir(RENDERS_DIR, { recursive: true });
  }
}

/**
 * Template URL'sini render edip WebP formatında kaydeder
 * @param templateUrl - Render edilecek template URL'i (örn: /design/configs?configId=xxx)
 * @param width - Render genişliği (varsayılan: 1920)
 * @param height - Render yüksekliği (varsayılan: 1080)
 * @param baseUrl - Base URL (varsayılan: http://localhost:3005)
 * @returns Kaydedilen dosyanın public URL'i
 */
export async function renderTemplateSnapshot(
  templateUrl: string,
  width: number = 1920,
  height: number = 1080,
  baseUrl?: string
): Promise<string> {
  let browser;

  try {
    // Base URL'i belirle - Puppeteer headless modda localhost yerine 127.0.0.1 kullanmalı
    const appBaseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3005';
    const fullUrl = templateUrl.startsWith('http')
      ? templateUrl
      : `${appBaseUrl}${templateUrl}`;

    console.log(`Rendering snapshot from URL: ${fullUrl}`);

    // Renders klasörünü oluştur
    await ensureRendersDir();

    // Puppeteer browser'ı başlat
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

    // Network request debugging - hangi istekler başarısız oluyor görmek için
    page.on('requestfailed', (request) => {
      console.log(`[Puppeteer] Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    page.on('response', (response) => {
      if (response.url().includes('/uploads/') || response.url().includes('/images/')) {
        console.log(`[Puppeteer] Image response: ${response.url()} - Status: ${response.status()}`);
      }
    });

    // Viewport ayarla
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 1,
    });

    // Sayfayı yükle ve render'ın tamamlanmasını bekle
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
            // 5 saniye timeout
            setTimeout(resolve, 5000);
          });
        })
      );
    });

    // Ekstra bekleme süresi (animasyonlar ve dinamik içerik için)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Screenshot al (WebP formatında)
    const screenshot = await page.screenshot({
      type: 'webp',
      quality: 90,
      fullPage: false,
    });

    // Dosya adı oluştur (UUID benzeri)
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const filename = `${timestamp}-${randomId}.webp`;
    const filepath = join(RENDERS_DIR, filename);

    // Dosyayı kaydet
    await writeFile(filepath, screenshot);

    // Public URL'i döndür
    const publicUrl = `/renders/${filename}`;
    console.log(`Snapshot saved: ${publicUrl}`);

    return publicUrl;
  } catch (error: any) {
    console.error('Render snapshot error:', error);
    throw new Error(`Snapshot render edilemedi: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * TemplateConfig için snapshot oluşturur ve veritabanına kaydeder
 * @param configId - TemplateConfig ID
 * @param templatePath - Template path (örn: /design/configs)
 * @param width - Render genişliği
 * @param height - Render yüksekliği
 * @returns Snapshot URL ve version
 */
export async function generateSnapshotForConfig(
  configId: string,
  templatePath: string = '/design/configs',
  width: number = 1920,
  height: number = 1080
): Promise<{ snapshotUrl: string; snapshotVersion: string }> {
  try {
    const templateUrl = `${templatePath}?configId=${configId}`;
    const snapshotUrl = await renderTemplateSnapshot(templateUrl, width, height);
    const snapshotVersion = Date.now().toString();

    return {
      snapshotUrl,
      snapshotVersion,
    };
  } catch (error: any) {
    console.error('Generate snapshot for config error:', error);
    throw error;
  }
}

