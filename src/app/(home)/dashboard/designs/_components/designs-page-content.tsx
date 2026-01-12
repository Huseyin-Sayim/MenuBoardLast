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
      try {
        const response = await fetch("/api/userTemplate/role");
        if (response.ok) {
          const result = await response.json();
          if (result.data?.role === "admin") {
            setIsAdmin(true);
          }
        } else {
          console.error("Kullanıcı bilgisi getirilemedi");
        }
      } catch (error) {
        console.error("Kullanıcı bilgisi getirilirken hata:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleAddTemplateSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <Breadcrumb pageName="" />

      <div className="mt-4 md:mt-6 2xl:mt-9">
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 p-3 border rounded-xl float-end m-5 text-amber-50 hover:bg-blue-600 transition-colors"
          >
            Şablon Ekle
          </button>
        )}
        <DesignStore templates={templates} />
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

