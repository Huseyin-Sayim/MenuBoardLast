import type { PropsWithChildren } from "react";

export default function DesignLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-2 dark:bg-[#020d1a]">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

