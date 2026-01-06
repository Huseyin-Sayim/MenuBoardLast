import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DesignStore } from "./_components/design-store";
import EditDesign from "@/app/(home)/dashboard/designs/_components/editDesign";

type Design = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPurchased?: boolean;
};

export default function DesignsPage() {

  const mockDesigns: Design[] = [
    {
      id: "1",
      name: "Modern Menü Tasarımı",
      description: "Şık ve modern menü kartı tasarımı",
      price: 99,
      image: "/images/cards/cards-01.png",
      category: "Menü",
    },
    {
      id: "2",
      name: "Klasik Restoran Tasarımı",
      description: "Geleneksel ve zarif restoran menü tasarımı",
      price: 149,
      image: "/images/cards/cards-02.png",
      category: "Menü",
    },
    {
      id: "3",
      name: "Minimalist Tasarım",
      description: "Sade ve minimal menü tasarımı",
      price: 79,
      image: "/images/cards/cards-03.png",
      category: "Menü",
    },
    {
      id: "4",
      name: "Renkli Promosyon Tasarımı",
      description: "Dikkat çekici promosyon menü tasarımı",
      price: 129,
      image: "/images/cards/cards-04.png",
      category: "Promosyon",
    },
    {
      id: "5",
      name: "Lüks Restoran Tasarımı",
      description: "Premium restoran menü tasarımı",
      price: 199,
      image: "/images/cards/cards-05.png",
      category: "Menü",
    },
    {
      id: "6",
      name: "Hızlı Servis Tasarımı",
      description: "Fast food restoranlar için tasarım",
      price: 89,
      image: "/images/cards/cards-06.png",
      category: "Fast Food",
    },
  ];

  const handleEdit = () => {
    return <EditDesign></EditDesign>
  }

  return (
    <>
      <Breadcrumb pageName="" />
      
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <button className="bg-blue-500 p-3 border rounded-xl float-end m-5 text-amber-50" >Şablon Ekle</button>
        <DesignStore initialDesigns={mockDesigns} />
      </div>
    </>
  );
}
