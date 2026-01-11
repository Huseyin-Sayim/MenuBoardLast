import { NextResponse } from "next/server";
import { createTemplate, getAllTemplates } from "@/services/templateServices";

const getDefaultConfig = (component: string) => {
  if (component === 'template-1') {
    return {
      category: "Ana Menu",
      data: [
        {name: 'Örnek Ürün 1', price: "100"},
        {name: 'Örnek Ürün 2', price: "200"},
      ]
    }
  }
  if (component === 'template-2') {
    return {
      categories: {
        "Ana Yemekler":'#FF5733',
        "Tatlılar":'#33FF57',
        "İçecekler":'#3357FF',
      },
      data: {
        "Ana Yemekler": [
          {name: 'Örnek Yemek 1', price: '100'},
          {name: 'Örnek Yemek 2', price: '200'}
        ],
        "İçecekler": [
          {name: 'Örnek Yemek 1', price: '100'},
          {name: 'Örnek Yemek 2', price: '200'}
        ],
        "Tatlılar": [
          {name: 'Örnek Yemek 1', price: '100'},
          {name: 'Örnek Yemek 2', price: '200'}
        ],
      }
    };
  }
  return {
    category: '',
    data:[]
  }
}

export async function GET(req:Request) {
  try {
    const templates = await getAllTemplates();

    const templatesWithDefaults = templates.map((template) => {
      const defaultConfig = getDefaultConfig(template.component);

      return {
        id: template.id,
        name: template.name,
        path: template.path,
        component: template.component,
        defaultConfig: defaultConfig,
        displayConfig: defaultConfig
      }
    })

    return NextResponse.json({
      message: 'Template\'ler başarıyla getirildi.',
      data: templatesWithDefaults,
      count: templatesWithDefaults.length
    },{ status: 200 });

  } catch (err : any) {
    return NextResponse.json(
      { message: 'Template\'ler getirilemedi: ' + err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, path, component } = body;

    if (!name || !path || !component) {
      return NextResponse.json(
        { message: 'Name, path ve component alanları zorunludur' },
        { status: 400 }
      );
    }

    const template = await createTemplate({ name, path, component });

    return NextResponse.json({
      message: 'Şablon başarıyla oluşturuldu',
      data: template
    }, { status: 201 });

  } catch (err: any) {
    console.error('Template oluşturma hatası:', err);
    return NextResponse.json(
      { message: 'Şablon oluşturulamadı: ' + err.message },
      { status: 500 }
    );
  }
}






















