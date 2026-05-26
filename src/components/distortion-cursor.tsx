"use client";

import { useEffect, useRef } from "react";

export function DistortionCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!cursor || !finePointer.matches || reducedMotion.matches) {
      return;
    }

    let frame = 0;

    const moveCursor = (event: PointerEvent) => {
      const { clientX, clientY } = event;

      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        cursor.style.setProperty("--cursor-x", `${clientX}px`);
        cursor.style.setProperty("--cursor-y", `${clientY}px`);
        cursor.dataset.visible = "true";
        frame = 0;
      });
    };

    const updateTargetState = (event: PointerEvent) => {
      const target = event.target;
      const isInteractive =
        target instanceof Element &&
        Boolean(target.closest("a, button, [role='button']"));

      cursor.dataset.active = String(isInteractive);
    };

    const hideCursor = () => {
      cursor.dataset.visible = "false";
      cursor.dataset.active = "false";
    };

    document.body.classList.add("cursor-enabled");
    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerover", updateTargetState, { passive: true });
    document.addEventListener("mouseleave", hideCursor);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      document.body.classList.remove("cursor-enabled");
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerover", updateTargetState);
      document.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  return (
    <div ref={cursorRef} className="distortion-cursor" aria-hidden="true">
      <span />
    </div>
  );
}
