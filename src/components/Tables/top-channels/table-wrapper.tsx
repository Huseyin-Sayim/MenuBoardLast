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
  const [initialPlaylist, setInitialPlaylist] = useState<Array<{ id: string; item: MediaItem | any; isDesign: boolean }>>([]);

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
        
        // Config'leri playlist formatına dönüştür
        const playlistItems = configs.map((config: any) => {
          // getScreenConfig Media'yı include ettiği için config.Media mevcut
          const mediaId = config.Media?.id || config.mediaId;
          const media = initialMedia.find(m => m.id === mediaId);
          if (media) {
            return {
              id: `media-${mediaId}`,
              item: media,
              isDesign: false
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
        mediaId: config.mediaId,
        mediaIndex: config.mediaIndex
      }));
      
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
              <TableCell className="flex min-w-fit items-center gap-3">
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
    </div>
  );
}

