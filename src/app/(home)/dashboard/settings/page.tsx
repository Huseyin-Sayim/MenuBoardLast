import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { AccountSettings } from "./_components/account-settings";
import { cookies } from "next/headers";
import prisma from "@/generated/prisma";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (!userCookie) {
    return <div>Kullanıcı oturumu bulunamadı.</div>;
  }

  const user = JSON.parse(userCookie) as { id: string };
  
  // Kullanıcı bilgilerini getir
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    }
  });

  if (!userData) {
    return <div>Kullanıcı bulunamadı.</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Hesap Ayarları" />
      
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <AccountSettings userData={userData} />
      </div>
    </>
  );
}

