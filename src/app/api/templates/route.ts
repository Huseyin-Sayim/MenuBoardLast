import { NextResponse } from "next/server";
import { createTemplate, getAllTemplates } from "@/services/templateServices";

const getDefaultConfig = (component: string) => {
  if (component === 'template-1') {
    return {
      category: "Ana Menu",
      data: [
        { name: 'Örnek Ürün 1', price: "100" },
        { name: 'Örnek Ürün 2', price: "200" },
      ]
    }
  }
  if (component === 'template-2') {
    return {
      categories: {
        "Ana Yemekler": '#FF5733',
        "Tatlılar": '#33FF57',
        "İçecekler": '#3357FF',
      },
      data: {
        "Ana Yemekler": [
          { name: 'Örnek Yemek 1', price: '100' },
          { name: 'Örnek Yemek 2', price: '200' }
        ],
        "İçecekler": [
          { name: 'Örnek Yemek 1', price: '100' },
          { name: 'Örnek Yemek 2', price: '200' }
        ],
        "Tatlılar": [
          { name: 'Örnek Yemek 1', price: '100' },
          { name: 'Örnek Yemek 2', price: '200' }
        ],
      }
    };
  }
  if (component === 'template-7') {
    return {
      category: "Mix Burger",
      data: [
        { name: '3 Adet Bol Mix Burger', price: "1200", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1920&auto=format&fit=crop" },
      ]
    }
  }
  if (component === 'template-8') {
    return {
      category: "Combo Menü",
      data: [
        { name: 'Ice Cream Souffle + Coffe', price: "12", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
        { name: 'Doner + cola + fries', price: "9", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
        { name: 'Hamburger + Cola', price: "8", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
        { name: 'Fries + Hot Dog + Doner', price: "15", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
      ]
    }
  }
  if (component === 'template-4') {
    return {
      category: "Burger Menü",
      data: []
    };
  }
  if (component === 'template-12') {
    return {
      category: "Tavuk Menüleri",
      menuItems: [
        { name: 'CHICKEN BURGER', price: "200", image: "/images/burger_menu.svg" },
        { name: 'CHICKEN BURGER', price: "200", image: "/images/burger_menu.svg" },
        { name: 'CHICKEN BURGER', price: "200", image: "/images/burger_menu.svg" },
        { name: 'CHICKEN BURGER', price: "200", image: "/images/burger_menu.svg" },
        { name: 'CHICKEN BURGER', price: "200", image: "/images/burger_menu.svg" },
        { name: 'CHICKEN BURGER', price: "200", image: "/images/burger_menu.svg" },
      ],
      headerTitle: "TAVUK MENÜLERİ",
      footerNote: "FİYATLARIMIZ KDV DAHİLDİR."
    }
  }
  return {
    category: '',
    data: []
  }
}

export async function GET(req: Request) {
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
    }, { status: 200 });

  } catch (err: any) {
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






















