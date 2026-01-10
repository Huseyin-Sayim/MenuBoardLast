"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { EditView, ScreenConfig } from "./edit-view";
import { TableActions } from "./table-actions";
import Cookies from "js-cookie";
import { MediaItem } from "@/app/(home)/dashboard/media/_components/media-gallery";
import { AddScreenModal } from "./add-screen-modal";
import { useRouter } from "next/navigation";

type Screen = {
  id: string,
  name: string,
  width: number,
  height: number,
  createdAt: Date
}

type TableWrapperProps = {
  data: Screen[];
  initialMedia: MediaItem[];
  className?: string;
  showActions?: boolean;
};



export function TableWrapper({ data, initialMedia, className, showActions = true }: TableWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string>("");
  const [selectedScreenData, setSelectedScreenData] = useState<Screen | null>(null);
  const [screens, setScreens] = useState<Screen[]>(data);
  const [initialPlaylist, setInitialPlaylist] = useState<Array<{ id: string; item: MediaItem | any; isDesign: boolean ; duration:number}>>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const handleEdit = async (screenId: string) => {
    const screen = screens.find((s) => s.id === screenId);
    setSelectedScreenId(screenId);
    setSelectedScreenData(screen || null);
    
    // DB'den screen config'leri çek
    try {
      const response = await fetch(`/api/screens/${screenId}/config`);
      if (response.ok) {
        const result = await response.json();
        const configs = result.data || [];
        
        const playlistItems = configs.map((config: any) => {
          // Media varsa
          if (config.Media) {
            const mediaId = config.Media.id || config.mediaId;
            const media = initialMedia.find(m => m.id === mediaId);
            if (media) {
              return {
                id: `media-${mediaId}`,
                item: media,
                isDesign: false,
                duration: config.displayDuration ?? (media.type === 'video' ? 0 : 10)
              };
            }
          }
          
          // Template varsa
          if (config.Template) {
            const template = config.Template;
            // Template'i MenuBoardDesign formatına çevir
            const templateAsDesign = {
              id: template.component || template.id, // component: template-1, template-2 vs.
              name: template.name,
              preview: "/images/cover/cover-01.png", // Varsayılan preview
              isActive: true,
              type: "image" as const
            };
            
            // Template ID'sini component değerine göre oluştur
            const templateComponent = template.component || template.id;
            const templateId = templateComponent.startsWith('template-') 
              ? templateComponent 
              : `template-${templateComponent}`;
            
            return {
              id: `template-${templateComponent}`,
              item: templateAsDesign,
              isDesign: true,
              duration: config.displayDuration ?? 10
            };
          }
          
          return null;
        }).filter((item: any) => item !== null);
        
        setInitialPlaylist(playlistItems);
      } else {
        setInitialPlaylist([]);
      }
    } catch (error) {
      console.error('Screen config çekilirken hata:', error);
      setInitialPlaylist([]);
    }
    
    // API çağrısı tamamlandıktan sonra edit modunu aç
    setIsEditing(true);
  };

  const handleDelete = (screenName: string) => {
    setScreens((prev) => prev.filter((screen) => screen.name !== screenName));
  };

  const handleSaveDesign = async (
    designId: string, 
    status: "Aktif" | "Pasif", 
    location: string,
    playlist: Array<{ id: string; item: any; isDesign: boolean }>,
    screenConfig: ScreenConfig[]
  ) => {
    console.log(`Ekran ${selectedScreenId} için tasarım ${designId}, durum ${status}, konum ${location} ve playlist kaydedildi`);
    console.log('Playlist:', playlist);
    console.log('Screen Config:', screenConfig);

    try {
      // API route üzerinden toplu güncelleme yap
      const configsToSave = screenConfig.map(config => ({
        ...(config.mediaId && { mediaId: config.mediaId }),
        ...(config.templateId && { templateId: config.templateId }),
        mediaIndex: config.mediaIndex,
        duration: config.duration
      }));

      console.log("API'ye giden paket: ",JSON.stringify(configsToSave, null, 2));

      const response = await fetch(`/api/screens/${selectedScreenId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configs: configsToSave }),
      });

      if (!response.ok) {
        throw new Error('Playlist kaydedilemedi');
      }

      console.log('Playlist başarıyla kaydedildi');
    } catch (error) {
      console.error('Playlist kaydedilirken hata:', error);
    }

    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === selectedScreenId ? { ...screen, status } : screen
      )
    );
    
    setIsEditing(false);
    setSelectedScreenId("");
    setSelectedScreenData(null);
    setInitialPlaylist([]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedScreenId("");
    setSelectedScreenData(null);
    setInitialPlaylist([]);
  };

  const handleAddScreenSuccess = () => {
    // window.location.reload();
  };

  if (isEditing) {
    return (
      <div className={className}>
        <EditView
          screenName={selectedScreenId}
          currentDesign="1"
          screenWidth={selectedScreenData?.width}
          screenHeight={selectedScreenData?.height}
          onSave={handleSaveDesign}
          onCancel={handleCancel}
          initialMedia={initialMedia}
          initialPlaylist={initialPlaylist}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Ekranlar
        </h2>
        {showActions && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-primary/90"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ekran Ekle
          </button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">

            <TableHead className="min-w-[120px] !text-left">
              Ekran Adı
            </TableHead>
            <TableHead>Boyut</TableHead>
            <TableHead>Oluşturma Tarihi</TableHead>

            {showActions && (
              <>
                <TableHead>Düzenle</TableHead>
                <TableHead>Sil</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {screens.map((screen, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={screen.name + i}
            >
              <TableCell className="capitalize flex min-w-fit items-center gap-3">
                <div className="">{screen.name}</div>
              </TableCell>

              <TableCell>{`${screen.width} x ${screen.height}`}</TableCell>

              <TableCell>
                {new Date(screen.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>


              {showActions && (
                <TableActions
                  screenName={screen.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddModalOpen && (
        <AddScreenModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddScreenSuccess}
        />
      )}
    </div>
  );
}

