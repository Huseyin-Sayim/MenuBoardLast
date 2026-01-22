"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false
    }
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <QueryClientProvider client={queryClient}>
    //   <ThemeProvider
    //     defaultTheme="system"
    //     attribute="class"
    //     enableSystem={true}>
        <SidebarProvider>{children}</SidebarProvider>
      // </ThemeProvider>
    // </QueryClientProvider>
  );
}

