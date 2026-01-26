import type { PropsWithChildren } from "react";

export default function Template4Layout({ children }: PropsWithChildren) {
  // Template-4 için layout'u bypass et, sadece children'ı render et
  // Böylece template-4'ün kendi kırmızı background'u görünecek
  return <>{children}</>;
}


