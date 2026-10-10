"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scroll: Lenis | undefined;

    function configureScroll() {
      scroll?.destroy();
      scroll = undefined;
      if (reducedMotion.matches) return;

      scroll = new Lenis({
        autoRaf: true,
        lerp: 0.055,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        allowNestedScroll: true,
      });
    }

    configureScroll();
    reducedMotion.addEventListener("change", configureScroll);
    return () => {
      reducedMotion.removeEventListener("change", configureScroll);
      scroll?.destroy();
    };
  }, [pathname]);

  return null;
}
