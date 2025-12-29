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
import { EditView } from "@/components/Tables/top-channels/edit-view";
import { TableActions } from "@/components/Tables/top-channels/table-actions";
import Cookies from "js-cookie";

type Channel = {
  name: string;
  location: string;
  revenues?: number;
  sales?: number;
  conversion?: number;
  logo?: any;
  status: "Aktif" | "Pasif";
};

type TableWrapperProps = {
  data: Channel[];
  className?: string;
  showActions?: boolean;
};



export function TableWrapper({ data, className, showActions = true }: TableWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<string>("");
  const [selectedScreenData, setSelectedScreenData] = useState<Channel | null>(null);
  const [screens, setScreens] = useState<Channel[]>(data);

  const userData = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;

  const handleEdit = (screenName: string) => {
    const screen = screens.find((s) => s.name === screenName);
    setSelectedScreen(screenName);
    setSelectedScreenData(screen || null);
    setIsEditing(true);
  };

  const handleDelete = (screenName: string) => {
    setScreens((prev) => prev.filter((screen) => screen.name !== screenName));
  };

  const handleSaveDesign = (designId: string, status: "Aktif" | "Pasif") => {
    // Burada API çağrısı yapılabilir
    console.log(`Ekran ${selectedScreen} için tasarım ${designId} ve durum ${status} kaydedildi`);

    // Ekran durumunu güncelle
    setScreens((prev) =>
      prev.map((screen) =>
        screen.name === selectedScreen ? { ...screen, status } : screen
      )
    );

    setIsEditing(false);
    setSelectedScreen("");
    setSelectedScreenData(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedScreen("");
    setSelectedScreenData(null);
  };

  // Düzenleme modunda düzenleme ekranını göster
  if (isEditing) {
    return (
      <div className={className}>
        <EditView
          screenName={selectedScreen}
          currentDesign="1"
          onSave={handleSaveDesign}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // Normal modda tablo görünümünü göster
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
        {userData?.role === "admin" ? (
          <button
            onClick={() => {
              console.log("Ekran satın al butonuna tıklandı");
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-95"
          >
            Ekran Satın Al
          </button>
        ) : "" }
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">
              Ekran Adı
            </TableHead>
            <TableHead>Ekran Konumu</TableHead>
            <TableHead>Ekran Durumu</TableHead>
            {showActions && (
              <>
                <TableHead>Düzenle</TableHead>
                <TableHead>Sil</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {screens.map((channel, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={channel.name + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <div className="">{channel.name}</div>
              </TableCell>

              <TableCell>{channel.location}</TableCell>

              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                    channel.status === "Aktif"
                      ? "bg-green-light-7 text-green dark:bg-green/20"
                      : "bg-orange-light text-orange dark:bg-orange/20"
                  )}
                >
                  {channel.status}
                </span>
              </TableCell>

              {showActions && (
                <TableActions
                  screenName={channel.name}
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

