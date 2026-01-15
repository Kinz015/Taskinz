"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisIcon } from "lucide-react";

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

export function RowActionsMenu({ open, onToggle, onClose, children }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<{
    top: number;
    left: number;
    placement: "up" | "down";
  }>({
    top: 0,
    left: 0,
    placement: "down",
  });

  const updatePosition = () => {
    const btn = btnRef.current;
    const menu = menuRef.current;
    if (!btn || !menu) return;

    const rect = btn.getBoundingClientRect();
    const menuW = menu.offsetWidth;
    const menuH = menu.offsetHeight;
    const gap = 8;

    const spaceBelow = window.innerHeight - rect.bottom;
    const canOpenDown = spaceBelow >= menuH + gap;

    const placement: "up" | "down" = canOpenDown ? "down" : "up";

    const top =
      placement === "down" ? rect.bottom + gap : rect.top - gap - menuH;

    // alinha à direita do botão
    let left = rect.right - menuW;
    // garante dentro da tela
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));

    setPos({ top, left, placement });
  };

  useLayoutEffect(() => {
    if (!open) return;
    requestAnimationFrame(updatePosition);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => onClose(); // ✅ fecha no scroll
    const handleResize = () => onClose(); // opcional: fecha no resize também

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={onToggle}
        className={`w-full h-full flex justify-center rounded-r-lg hover:bg-gray-300 hover:cursor-pointer ${
          open ? "py-6" : "p-4"
        }`}
      >
        <EllipsisIcon />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-9999 w-40 bg-white rounded-md shadow-lg border"
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}
