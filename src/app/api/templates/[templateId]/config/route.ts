import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTemplateConfig, saveTemplateConfig } from "@/services/templateServices";

export async function GET (
  req: Request ,
  { params }: {params:Promise<{ templateId: string }>}
) {
  try {
    const { templateId } = await params;
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user')?.value;

    if (!userCookies) {
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı'},
        {status: 401}
      );
    }

    const user = JSON.parse(userCookies) as {id: string};
    
    // Query parametresinden configId al
    const { searchParams } = new URL(req.url);
    const configId = searchParams.get('configId') || undefined;
    
    const config = await getTemplateConfig(user.id, templateId, configId)

    if (!config) {
      return NextResponse.json({
        message:'Konfigrasyon bulunamadı.',
        configData:null
      })
    }

    return NextResponse.json({
      message:'Konfigrasyon başarıyla getirildi.',
      configData:config.configData,
      configId: config.id
    });

  } catch (err : any) {
    return NextResponse.json(
      { message: 'Konfigrasyon getirilemedi:' +err.message},
      { status: 500}
    )
  }
}

export async function PUT(
  req:Request,
  {params}:{params:Promise<{templateId: string}>}
) {
  try {
      const { templateId } = await params;
      console.log('PUT /api/templates/[templateId]/config - templateId:', templateId);
      
      const cookieStore = await cookies();
      const userCookies = cookieStore.get('user')?.value;

      if (!userCookies) {
        console.error('Kullanıcı oturumu bulunamadı');
        return NextResponse.json(
          {message:'Kullanıcı oturumu bulunamadı.'},
          {status:400}
        )
      }

      const user = JSON.parse(userCookies) as {id:string};
      console.log('Kullanıcı ID:', user.id);
      
      const body = await req.json();
      console.log('Gelen body:', JSON.stringify(body, null, 2));
      
      // configId parametresini al
      const { configId, ...configBody } = body;
      
      // Template-2 için özel format kontrolü
      const isTemplate2 = templateId === 'template-2' || templateId?.includes('template-2');
      
      let configData: any;
      
      if (isTemplate2) {
        // Template-2 formatı: { categories: {...}, data: {...} }
        const { categories, data } = configBody;
        
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          console.error('Template-2 için geçersiz veri formatı - data:', data);
          return NextResponse.json(
            { message: 'Geçersiz veri formatı: Template-2 için data bir object olmalı' },
            { status:400 }
          );
        }
        
        configData = {
          categories: categories || {},
          data: data || {}
        };
      } else {
        // Template-1 formatı: { category: string, data: Array }
        const { category, data } = configBody;
        
        if (!data || !Array.isArray(data)) {
          console.error('Geçersiz veri formatı - data:', data);
          return NextResponse.json(
            { message: 'Geçersiz veri formatı: data bir array olmalı' },
            { status:400 }
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
        message:'Konfigrasyon başarıyla kaydedildi.',
        data: result
      })


  } catch (err: any) {
    console.error('Kaydetme hatası:', err);
    return NextResponse.json(
      {message:'Konfigrasyon kaydedilmedi:'+ err.message},
      {status: 500}
    )
  }
}