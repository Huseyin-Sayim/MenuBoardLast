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
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import api from '@/lib/api/axios'

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/dashboard/user');

      setUsers(response.data.data || []);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "Kullanıcılar yüklenirken bir hata oluştu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    // TODO: Düzenleme modal/form açılacak
    console.log("Düzenle:", user);
    alert(`Kullanıcı düzenleme: ${user.name}`);
  };

  const handleDelete = async (user: User) => {
    // Admin kullanıcılar silinemez
    if (user.role === "admin") {
      alert("Admin rolündeki kullanıcılar silinemez");
      return;
    }

    if (!confirm(`${user.name} adlı kullanıcıyı silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setDeletingId(user.id);
      await api.delete(`/api/dashboard/user/${user.id}`);

      await fetchUsers()

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        "Kullanıcı silinirken bir hata oluştu";
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-7.5">
        <div className="text-center py-8 text-dark-4 dark:text-dark-6">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-7.5">
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 sm:p-7.5">
        <div className="text-center py-8 text-dark-4 dark:text-dark-6">
          Henüz kullanıcı bulunmamaktadır.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-7.5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-dark-4 dark:text-dark-6">
          Toplam {users.length} kullanıcı
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[200px] xl:pl-7.5">Ad Soyad</TableHead>
            <TableHead className="min-w-[200px]">E-posta</TableHead>
            <TableHead className="min-w-[150px]">Telefon Numarası</TableHead>
            <TableHead className="min-w-[100px]">Rol</TableHead>
            <TableHead className="min-w-[120px] text-right xl:pr-7.5">İşlemler</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell className="xl:pl-7.5">
                <p className="font-medium text-dark dark:text-white">
                  {user.name}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">{user.email}</p>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">{user.phoneNumber}</p>
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                    user.role === "admin"
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "bg-gray-2 text-dark-4 dark:bg-dark-2 dark:text-dark-6"
                  )}
                >
                  {user.role === "admin" ? "Admin" : "Kullanıcı"}
                </span>
              </TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button
                    onClick={() => handleEdit(user)}
                    className="hover:text-primary transition-colors"
                    title="Düzenle"
                  >
                    <span className="sr-only">Kullanıcıyı Düzenle</span>
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(user)}
                    disabled={deletingId === user.id || user.role === "admin"}
                    className={cn(
                      "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                      user.role === "admin"
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:text-red-500"
                    )}
                    title={user.role === "admin" ? "Admin kullanıcılar silinemez" : "Sil"}
                  >
                    <span className="sr-only">Kullanıcıyı Sil</span>
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

