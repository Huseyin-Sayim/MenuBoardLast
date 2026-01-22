// import { cn } from "@/lib/utils";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import { Moon, Sun } from "./icons";
//
// const THEMES = [
//   {
//     name: "light",
//     Icon: Sun,
//   },
//   {
//     name: "dark",
//     Icon: Moon,
//   },
// ];
//
// export function ThemeToggleSwitch() {
//   const { setTheme, theme, resolvedTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//
//   useEffect(() => {
//     setMounted(true);
//   }, []);
//
//   if (!mounted) {
//     return null;
//   }
//
//   // Sistem teması aktifse, gerçek tema durumunu resolvedTheme'dan al
//   const currentTheme = resolvedTheme || theme;
//   const isDark = currentTheme === "dark";
//
//   return (
//     <button
//       onClick={() => {
//         // Sistem temasından manuel temaya geçiş yap
//         if (theme === "system") {
//           setTheme(isDark ? "light" : "dark");
//         } else {
//           setTheme(isDark ? "light" : "dark");
//         }
//       }}
//       className="group rounded-full bg-gray-3 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
//     >
//       <span className="sr-only">
//         Switch to {isDark ? "light" : "dark"} mode
//       </span>
//
//       <span aria-hidden className="relative flex gap-2.5">
//         {/* Indicator */}
//         <span className="absolute size-[38px] rounded-full border border-gray-200 bg-white transition-all dark:translate-x-[48px] dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3" />
//
//         {THEMES.map(({ name, Icon }) => (
//           <span
//             key={name}
//             className={cn(
//               "relative grid size-[38px] place-items-center rounded-full",
//               name === "dark" && "dark:text-white",
//             )}
//           >
//             <Icon />
//           </span>
//         ))}
//       </span>
//     </button>
//   );
// }
