import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTemplateConfig, saveTemplateConfig } from "@/services/templateServices";

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

    // Query parametresinden configId al
    const { searchParams } = new URL(req.url);
    const configId = searchParams.get('configId') || undefined;

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

    // configId parametresini al
    const { configId, ...configBody } = body;

    // Template-2 için özel format kontrolü
    const isTemplate2 = templateId === 'template-2' || templateId?.includes('template-2');
    // Template-5 için özel format kontrolü
    const isTemplate5 = templateId === 'template-5' || templateId?.includes('template-5');
    // Template-6 için özel format kontrolü
    const isTemplate6 = templateId === 'template-6' || templateId?.includes('template-6');
    // Template-7 için özel format kontrolü
    const isTemplate7 = templateId === 'template-7' || templateId?.includes('template-7');
    // Template-8 için özel format kontrolü
    const isTemplate8 = templateId === 'template-8' || templateId?.includes('template-8');

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
    } else if (isTemplate5) {
      // Template-5 formatı: { featuredProduct: {...}, menuItems: Array }
      const { featuredProduct, menuItems } = configBody;

      if (!menuItems || !Array.isArray(menuItems)) {
        console.error('Template-5 için geçersiz veri formatı - menuItems:', menuItems);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-5 için menuItems bir array olmalı' },
          { status: 400 }
        );
      }

      configData = {
        featuredProduct: featuredProduct || {},
        menuItems: menuItems || []
      };
    } else if (isTemplate6) {
      // Template-6 formatı: { brandName: string, menuItems: Array }
      const { brandName, menuItems } = configBody;

      if (!menuItems || !Array.isArray(menuItems)) {
        console.error('Template-6 için geçersiz veri formatı - menuItems:', menuItems);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-6 için menuItems bir array olmalı' },
          { status: 400 }
        );
      }

      configData = {
        brandName: brandName || "mamaspizza",
        menuItems: menuItems || []
      };
    } else if (isTemplate7) {
      // Template-7 formatı: { brand: {...}, hero: {...}, sidebarItems: Array, gridItems: Array }
      const { brand, hero, sidebarItems, gridItems } = configBody;

      if (!sidebarItems || !Array.isArray(sidebarItems) || !gridItems || !Array.isArray(gridItems)) {
        console.error('Template-7 için geçersiz veri formatı - sidebarItems:', sidebarItems, 'gridItems:', gridItems);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-7 için sidebarItems ve gridItems bir array olmalı' },
          { status: 400 }
        );
      }

      configData = {
        brand: brand || { shortName: "LA", fullName: "gyrogreek", phone: "(818)356-9676", logoImg: "" },
        hero: hero || { logo: "/images/burger_logo.svg", titleTop: "GYRO", titleBottom: "FOOD", image: "/images/teavuk_dürüm.svg", promo: { title: "Only Today", value: "20%", label: "OFF" } },
        sidebarItems: sidebarItems || [],
        gridItems: gridItems || []
      };
    } else if (isTemplate8) {
      // Template-8 formatı: { menuItems: Array, hotItems: Array, forYouItems: Array }
      const { menuItems, hotItems, forYouItems } = configBody;

      if (!menuItems || !Array.isArray(menuItems) || !hotItems || !Array.isArray(hotItems) || !forYouItems || !Array.isArray(forYouItems)) {
        console.error('Template-8 için geçersiz veri formatı');
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-8 listeleri array olmalı' },
          { status: 400 }
        );
      }

      configData = {
        menuItems: menuItems || [],
        hotItems: hotItems || [],
        forYouItems: forYouItems || []
      };
    } else if (templateId === 'template-9' || templateId?.includes('template-9')) {
      const { menuItems } = configBody;
      if (!menuItems || !Array.isArray(menuItems)) {
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-9 için menuItems bir array olmalı' },
          { status: 400 }
        );
      }
      configData = { menuItems };
    } else if (templateId === 'template-10' || templateId?.includes('template-10')) {
      // Template-10 formatı: { menuItems: Array, featuredProducts: Array, heroTitle: Object }
      const { menuItems, featuredProducts, heroTitle } = configBody;
      if (!menuItems || !Array.isArray(menuItems)) {
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: Template-10 için menuItems bir array olmalı' },
          { status: 400 }
        );
      }
      configData = {
        menuItems: menuItems || [],
        featuredProducts: featuredProducts || [],
        heroTitle: heroTitle || {
          line1: "Kıng",
          line2: "Deals",
          valueLine: "Valu Menu"
        }
      };
    } else {
      // Template-1, Template-3, Template-4 formatı: { category: string, data: Array }
      const { category, data } = configBody;

      if (!data || !Array.isArray(data)) {
        console.error('Geçersiz veri formatı - data:', data);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı: data bir array olmalı' },
          { status: 400 }
        );
      }

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