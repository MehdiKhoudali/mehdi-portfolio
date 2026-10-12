"use client";

import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "./site-chrome";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return children;
  return (
    <div className="site-page">
      <div className="site-column">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}
