"use client";

import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import { TableCell } from "@/components/ui/table";
import { useState } from "react";

type TableActionsProps = {
  screenName: string;
  onEdit: (screenName: string) => void;
  onDelete: (screenName: string) => void;
};

export function TableActions({
  screenName,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(screenName);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // 3 saniye sonra onay mesajını kapat
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <>
      <TableCell>
        <button
          onClick={() => onEdit(screenName)}
          className="mx-auto flex items-center justify-center rounded-lg p-2 text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
          aria-label="Düzenle"
        >
          <PencilSquareIcon className="size-5" />
        </button>
      </TableCell>
      <TableCell>
        <div className="relative flex items-center justify-center">
          <button
            onClick={handleDelete}
            className="mx-auto flex items-center justify-center rounded-lg p-2 text-red hover:bg-red/10 dark:hover:bg-red/20"
            aria-label="Sil"
          >
            <TrashIcon className="size-5" />
          </button>
          {showDeleteConfirm && (
            <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-red px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              Tekrar tıklayın
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-red"></div>
            </div>
          )}
        </div>
      </TableCell>
    </>
  );
}
