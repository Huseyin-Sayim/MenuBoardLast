import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTemplateConfig, saveTemplateConfig } from "@/services/templateServices";
import {
  getTemplateConfigAsMenuData,
  saveTemplateConfigWithMenuData,
  getDeviceIdsByConfigId
} from "@/services/menuDataServices";
import { normalizeDashboardDataToMenuData } from "@/utils/menuDataUtils";
import type { IMenuData } from "@/types/menu-data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user')?.value;

    if (!userCookies) {
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookies) as { id: string };

    // Query parametresinden configId ve format al
    const { searchParams } = new URL(req.url);
    const configId = searchParams.get('configId') || undefined;
    const useMenuDataFormat = searchParams.get('format') === 'menuData';

    // Yeni IMenuData formatı istendiyse
    if (useMenuDataFormat) {
      const result = await getTemplateConfigAsMenuData(user.id, templateId, configId);

      if (!result) {
        return NextResponse.json({
          message: 'Konfigrasyon bulunamadı.',
          menuData: null
        });
      }

      return NextResponse.json({
        message: 'Konfigrasyon başarıyla getirildi.',
        menuData: result.menuData,
        configId: result.config.id
      });
    }

    // Legacy format
    const config = await getTemplateConfig(user.id, templateId, configId)

    if (!config) {
      return NextResponse.json({
        message: 'Konfigrasyon bulunamadı.',
        configData: null
      })
    }

    return NextResponse.json({
      message: 'Konfigrasyon başarıyla getirildi.',
      configData: config.configData,
      configId: config.id
    });

  } catch (err: any) {
    return NextResponse.json(
      { message: 'Konfigrasyon getirilemedi:' + err.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
    console.log('PUT /api/templates/[templateId]/config - templateId:', templateId);

    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user')?.value;

    if (!userCookies) {
      console.error('Kullanıcı oturumu bulunamadı');
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı.' },
        { status: 400 }
      )
    }

    const user = JSON.parse(userCookies) as { id: string };
    console.log('Kullanıcı ID:', user.id);

    const body = await req.json();
    console.log('Gelen body:', JSON.stringify(body, null, 2));

    // configId ve format parametrelerini al
    const { configId, useMenuDataFormat, ...configBody } = body;

    // 🆕 IMenuData formatı kullanılacaksa
    if (useMenuDataFormat || configBody.settings || configBody.menuData) {
      console.log('\n');
      console.log('╔══════════════════════════════════════════════════════════════╗');
      console.log('║       🆕 IMenuData FORMATI İLE KAYDEDİLİYOR                  ║');
      console.log('╠══════════════════════════════════════════════════════════════╣');

      // Gelen veriyi IMenuData formatına dönüştür
      let menuData: IMenuData;

      if (configBody.menuData) {
        menuData = configBody.menuData;
      } else if (configBody.settings && configBody.items) {
        menuData = { settings: configBody.settings, items: configBody.items };
      } else {
        // Legacy formatı IMenuData'ya dönüştür
        menuData = normalizeDashboardDataToMenuData(configBody);
      }

      console.log(`║ 🎨 Tema: ${menuData.settings?.theme}`);
      console.log(`║ 💰 Para Birimi: ${menuData.settings?.currency}`);
      console.log(`║ 📌 Başlık: ${menuData.settings?.globalTitle}`);
      console.log(`║ 📦 Ürün Sayısı: ${menuData.items?.length || 0}`);
      if (menuData.items && menuData.items.length > 0) {
        console.log('║ Ürünler:');
        menuData.items.slice(0, 5).forEach((item, index) => {
          console.log(`║   ${index + 1}. ${item.title} - ${menuData.settings?.currency}${item.price}`);
        });
        if (menuData.items.length > 5) {
          console.log(`║   ... ve ${menuData.items.length - 5} ürün daha`);
        }
      }
      console.log('╚══════════════════════════════════════════════════════════════╝');
      console.log('\n');

      // Config'e bağlı cihazları bul (Socket.IO bildirimi için)
      let deviceIds: string[] = [];
      if (configId) {
        deviceIds = await getDeviceIdsByConfigId(configId);
      }

      const result = await saveTemplateConfigWithMenuData({
        userId: user.id,
        templateId,
        configId,
        menuData,
        deviceIds,
      });

      console.log('✅ IMenuData formatında kayıt başarılı:', result);

      return NextResponse.json({
        message: 'Konfigrasyon başarıyla kaydedildi (IMenuData formatı).',
        data: { id: result.configId },
        notifiedDevices: result.notifiedDevices
      });
    }

    // 📦 Legacy format (geriye uyumluluk)
    const isTemplate2 = templateId === 'template-2' || templateId?.includes('template-2');

    let configData: any;

    if (isTemplate2) {
      // Template-2 formatı: { categories: {...}, data: {...} }
      const { categories, data } = configBody;

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        console.error('Template-2 için geçersiz veri formatı - data:', data);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-2 için data bir object olmalı' },
          { status: 400 }
        );
      }

      configData = {
        categories: categories || {},
        data: data || {}
      };
    } else {
      // Template-1,3,4 formatı: { category: string, data: Array }
      const { category, data } = configBody;

      if (!data || !Array.isArray(data)) {
        console.error('Geçersiz veri formatı - data:', data);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: data bir array olmalı' },
          { status: 400 }
        );
      }

      // 📝 Detaylı Loglama - TemplateConfig Kaydetme (IMenuData formatına da dönüştür)
      const menuDataPreview = normalizeDashboardDataToMenuData(configBody);

      console.log('\n');
      console.log('╔══════════════════════════════════════════════════════════════╗');
      console.log('║           📝 TEMPLATE CONFIG KAYDEDİLİYOR                    ║');
      console.log('╠══════════════════════════════════════════════════════════════╣');
      console.log(`║ 👤 User ID: ${user.id}`);
      console.log(`║ 📄 Template ID: ${templateId}`);
      console.log(`║ 🔑 Config ID: ${configId || 'YENİ OLUŞTURULACAK'}`);
      console.log('╠══════════════════════════════════════════════════════════════╣');
      console.log('║ 📦 Legacy Format:');
      console.log(`║   Kategori: ${category || 'Belirtilmemiş'}`);
      console.log(`║   Ürün Sayısı: ${data?.length || 0}`);
      console.log('╠══════════════════════════════════════════════════════════════╣');
      console.log('║ 🆕 IMenuData Dönüşümü:');
      console.log(`║   Theme: ${menuDataPreview.settings.theme}`);
      console.log(`║   Currency: ${menuDataPreview.settings.currency}`);
      console.log(`║   GlobalTitle: ${menuDataPreview.settings.globalTitle}`);
      if (menuDataPreview.items.length > 0) {
        console.log('║   Ürünler:');
        menuDataPreview.items.slice(0, 5).forEach((item, index) => {
          console.log(`║     ${index + 1}. ${item.title} - ${menuDataPreview.settings.currency}${item.price}`);
        });
        if (menuDataPreview.items.length > 5) {
          console.log(`║     ... ve ${menuDataPreview.items.length - 5} ürün daha`);
        }
      }
      console.log('╚══════════════════════════════════════════════════════════════╝');
      console.log('\n');

      configData = {
        category: category || "",
        data: data
      };
    }

    console.log('Kaydedilecek configData:', JSON.stringify(configData, null, 2));
    console.log('ConfigId:', configId);

    const result = await saveTemplateConfig(user.id, templateId, configData, configId)
    console.log('Kaydetme başarılı, result:', result);

    return NextResponse.json({
      message: 'Konfigrasyon başarıyla kaydedildi.',
      data: result
    })


  } catch (err: any) {
    console.error('Kaydetme hatası:', err);
    return NextResponse.json(
      { message: 'Konfigrasyon kaydedilmedi:' + err.message },
      { status: 500 }
    )
  }
}