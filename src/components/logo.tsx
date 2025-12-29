import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-12 w-auto">
      <Image 
        src="/images/logo/ntx.png"
        alt="Logo"
        width={180}
        height={48}
        className="h-15 w-auto object-contain"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
