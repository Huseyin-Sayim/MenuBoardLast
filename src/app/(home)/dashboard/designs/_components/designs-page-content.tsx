"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DesignStore } from "./design-store";
import { AddTemplateModal } from "@/components/Tables/top-channels/add-template-modal";

type Template = {
  id: string;
  name: string;
  path: string;
  component: string;
  defaultConfig: any;
};

interface DesignsPageContentProps {
  templates: Template[];
}

export function DesignsPageContent({ templates }: DesignsPageContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log("[DesignsPageContent] Role kontrolü başlatılıyor...");
      try {
        console.log("[DesignsPageContent] /api/userTemplate/role endpoint'ine istek gönderiliyor...");
        const response = await fetch("/api/userTemplate/role");
        console.log("[DesignsPageContent] API yanıtı alındı. Status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("[DesignsPageContent] API yanıt verisi:", result);
          console.log("[DesignsPageContent] Kullanıcı role:", result.data?.role);

          if (result.data?.role === "admin") {
            console.log("[DesignsPageContent] Admin yetkisi tespit edildi. isAdmin true yapılıyor.");
            setIsAdmin(true);
          } else {
            console.log("[DesignsPageContent] Admin yetkisi yok. isAdmin false kalıyor.");
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("[DesignsPageContent] Kullanıcı bilgisi getirilemedi. Status:", response.status, "Error:", errorData);
        }
      } catch (error) {
        console.error("[DesignsPageContent] Kullanıcı bilgisi getirilirken hata:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleAddTemplateSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="mt-4 md:mt-6 2xl:mt-9 flex flex-col">

        <div className="w-full">
          <DesignStore
            templates={templates}
            isAdmin={isAdmin}
            onAddTemplate={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {isModalOpen && (
        <AddTemplateModal
          onCloseAction={() => setIsModalOpen(false)}
          onSuccessAction={handleAddTemplateSuccess}
        />
      )}
    </>
  );
}

