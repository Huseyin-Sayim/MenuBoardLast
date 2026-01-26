import { NextResponse } from 'next/server';
import { prisma } from '@/generated/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID'si eksik!" },
        { status: 400 }
      );
    }

    // Screen'i deviceId ile bul
    const screen = await prisma.screen.findUnique({
      where: { deviceId },
    });

    if (!screen) {
      return NextResponse.json(
        { error: 'Ekran bulunamadı' },
        { status: 404 }
      );
    }

    // ScreenConfig'leri al (sıralı)
    const screenConfigs = await prisma.screenConfig.findMany({
      where: { screenId: screen.id },
      orderBy: { mediaIndex: 'asc' },
      include: {
        Media: true,
        TemplateConfig: {
          include: {
            Template: true,
          },
        },
        Template: true,
      },
    });

    if (!screenConfigs || screenConfigs.length === 0) {
      return NextResponse.json({
        version: Date.now().toString(),
        snapshot_url: null,
        refresh_interval: 60,
        overlay_widgets: [],
      });
    }

    // Base URL'i belirle (request'ten al)
    const requestUrl = new URL(req.url);
    const protocol = requestUrl.protocol;
    const host = requestUrl.host;
    const fullBaseUrl = `${protocol}//${host}`;
    
    console.log('Device config API - Base URL:', fullBaseUrl);

    // İlk template config'i bul (snapshot için)
    const firstTemplateConfig = screenConfigs.find(
      (config) => config.templateConfigId && config.TemplateConfig
    );

    let snapshotUrl: string | null = null;
    let snapshotVersion: string | null = null;

    if (firstTemplateConfig?.TemplateConfig) {
      const templateConfig = firstTemplateConfig.TemplateConfig;
      
      // Snapshot URL varsa kullan, yoksa template URL'i kullan
      if (templateConfig.snapshotUrl) {
        snapshotUrl = templateConfig.snapshotUrl.startsWith('http')
          ? templateConfig.snapshotUrl
          : `${fullBaseUrl}${templateConfig.snapshotUrl}`;
        snapshotVersion = templateConfig.snapshotVersion || Date.now().toString();
      } else {
        // Snapshot yoksa, template URL'i oluştur (fallback)
        const templatePath = templateConfig.Template?.path || '/design/configs';
        snapshotUrl = `${fullBaseUrl}${templatePath}?configId=${templateConfig.id}`;
        snapshotVersion = Date.now().toString();
      }
    }

    // Overlay widgets oluştur (tüm config'ler için)
    const overlayWidgets = screenConfigs.map((config) => {
      const widget: any = {
        id: config.id,
        mediaIndex: config.mediaIndex,
        displayDuration: config.displayDuration || 10,
      };

      if (config.Media) {
        widget.type = 'media';
        // Media URL'i düzelt (başında / varsa kaldır, yoksa ekle)
        let mediaUrl = config.Media.url;
        if (!mediaUrl.startsWith('http')) {
          // URL başında / yoksa ekle
          if (!mediaUrl.startsWith('/')) {
            mediaUrl = `/${mediaUrl}`;
          }
          widget.url = `${fullBaseUrl}${mediaUrl}`;
        } else {
          widget.url = mediaUrl;
        }
        // Extension bilgisini de ekle (Android tarafında kullanmak için)
        widget.extension = config.Media.extension;
        console.log('Media widget URL:', widget.url, 'Extension:', widget.extension);
      } else if (config.TemplateConfig) {
        widget.type = 'template';
        const templateConfig = config.TemplateConfig;
        
        if (templateConfig.snapshotUrl) {
          widget.snapshot_url = templateConfig.snapshotUrl.startsWith('http')
            ? templateConfig.snapshotUrl
            : `${fullBaseUrl}${templateConfig.snapshotUrl}`;
          widget.version = templateConfig.snapshotVersion || Date.now().toString();
        } else {
          // Fallback: template URL
          const templatePath = templateConfig.Template?.path || '/design/configs';
          widget.url = `${fullBaseUrl}${templatePath}?configId=${templateConfig.id}`;
        }
      } else if (config.Template) {
        widget.type = 'template';
        const templatePath = config.Template.path || '/design/template-1';
        widget.url = `${fullBaseUrl}${templatePath}`;
      }

      return widget;
    });

    // Response oluştur
    const response = {
      version: snapshotVersion || Date.now().toString(),
      snapshot_url: snapshotUrl,
      refresh_interval: 60, // 60 saniye
      overlay_widgets: overlayWidgets,
    };

    console.log('Device config response:', JSON.stringify(response, null, 2));
    console.log('Overlay widgets count:', overlayWidgets.length);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Device config API error:', error);
    return NextResponse.json(
      {
        error: 'Sunucu tarafında bir hata oluştu.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

