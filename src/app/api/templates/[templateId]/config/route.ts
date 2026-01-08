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
    const config = await getTemplateConfig(user.id, templateId)

    if (!config) {
      return NextResponse.json({
        message:'Konfigrasyon bulunamadı.',
        configData:null
      })
    }

    return NextResponse.json({
      message:'Konfigrasyon başarıyla getirildi.',
      configData:config.configData
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
      const { category, data } = body;

      if (!data || !Array.isArray(data)) {
        console.error('Geçersiz veri formatı - data:', data);
        return NextResponse.json(
          { message: 'Geçersiz veri formatı' },
          { status:400 }
        )
      }

      const configData = {
        category: category || "",
        data: data
      }
      
      console.log('Kaydedilecek configData:', JSON.stringify(configData, null, 2));

      const result = await saveTemplateConfig(user.id,templateId,configData)
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