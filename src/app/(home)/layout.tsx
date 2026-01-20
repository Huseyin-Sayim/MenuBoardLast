import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { Footer } from "@/components/Layouts/footer";
import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/generated/prisma";

async function getUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return undefined;

  try {
    const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    return user?.role;
  } catch (error) {
    console.error("Auth check failed:", error);
    return undefined;
  }
}

export default async function HomeLayout({ children }: PropsWithChildren) {
  const role = await getUserRole();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />

      <div className="flex w-full flex-col bg-gray-2 dark:bg-[#020d1a]">
        <Header />

        <main className="isolate mx-auto w-full max-w-screen-2xl flex-1 overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
