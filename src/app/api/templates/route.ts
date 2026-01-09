import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAllTemplatesWithConfigs } from "@/services/templateService";

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
    const cookieStore = await cookies();
    const userCokkies = cookieStore.get('user')?.value;

    if (!userCokkies) {
      return NextResponse.json(
        { message: 'Kullanıcı oturumu bulunamadı.' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userCokkies) as { id: string };
    const templates = await getAllTemplatesWithConfigs(user.id);

    const templatesWithDefaults = templates.map((template) => {
      const defaultConfig = getDefaultConfig(template.component);

      return {
        id: template.id,
        name: template.name,
        path: template.path,
        component: template.component,
        hasUserConfig: template.hasUserConfig,
        defaultConfig: defaultConfig,
        userConfig: template.userConfig,
        displayConfig: template.userConfig || defaultConfig
      }
    })

    return NextResponse.json({
      message: 'Template\'ler başarıyla getirildi.',
      data: templatesWithDefaults,
      count: templatesWithDefaults.length
    },{ status: 200 });

  } catch (err : any) {
    return NextResponse.json(
      { message: 'Template\'ler getirildi.' + err.message },
      { status: 500 }
    )
  }
}






















