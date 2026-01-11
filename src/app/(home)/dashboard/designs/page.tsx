import { getAllTemplates } from "@/services/templateServices";
import { DesignsPageContent } from "./_components/designs-page-content";

type Template = {
  id: string;
  name: string;
  path: string;
  component: string;
  defaultConfig: any;
};

// Default config'leri tanımla
const getDefaultConfig = (component: string) => {
  if (component === 'template-1') {
    return {
      category: "Ana Menü",
      data: [
        { name: "Örnek Ürün 1", price: "100,00" },
        { name: "Örnek Ürün 2", price: "150,00" }
      ]
    };
  }

  if (component === 'template-2') {
    return {
      categories: {
        "Ana Yemekler": "#FF5733",
        "İçecekler": "#33FF57",
        "Tatlılar": "#3357FF"
      },
      data: {
        "Ana Yemekler": [
          { name: "Örnek Yemek 1", price: "200,00" }
        ],
        "İçecekler": [
          { name: "Örnek İçecek 1", price: "50,00" }
        ],
        "Tatlılar": []
      }
    };
  }

  return { category: "", data: [] };
};

async function getTemplates(): Promise<Template[]> {
  try {
    const templates = await getAllTemplates();

    if (!templates || !Array.isArray(templates)) {
      return [];
    }

    return templates.map((template) => ({
      id: template.id,
      name: template.name,
      path: template.path,
      component: template.component,
      defaultConfig: getDefaultConfig(template.component)
    }));
  } catch (error) {
    console.error('Template\'ler getirilemedi:', error);
    return [];
  }
}

export default async function DesignsPage() {
  const templates = await getTemplates();

  return <DesignsPageContent templates={templates} />;
}