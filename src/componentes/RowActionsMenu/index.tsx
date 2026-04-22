"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisIcon } from "lucide-react";

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
};

export function RowActionsMenu({
  open,
  onToggle,
  onClose,
  children,
  trigger,
}: Props) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    placement: "down" as "up" | "down",
  });

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (
        !menuRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const updatePosition = () => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;

    const rect = anchor.getBoundingClientRect();
    const menuW = menu.offsetWidth;
    const menuH = menu.offsetHeight;
    const gap = 8;

    const spaceBelow = window.innerHeight - rect.bottom;
    const canOpenDown = spaceBelow >= menuH + gap;

    const placement = canOpenDown ? "down" : "up";

    const top =
      placement === "down"
        ? rect.top + rect.height / 1
        : rect.top - gap - menuH;

    let left = rect.right - menuW;
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));

    setPos({ top, left, placement });
  };

  useLayoutEffect(() => {
    if (!open) return;
    requestAnimationFrame(updatePosition);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => onClose();
    const handleResize = () => onClose();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  return (
    <>
      {trigger ? (
        <div
          ref={anchorRef}
          onClick={onToggle}
          className={`${open && "py-6"} w-full h-full flex justify-center`}
        >
          {trigger}
        </div>
      ) : (
        <div
          ref={anchorRef}
          onClick={onToggle}
          className={`${open && "py-7"} w-full h-full flex justify-center rounded-r-lg hover:bg-gray-300 p-4`}
        >
          <EllipsisIcon />
        </div>
      )}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-9999 w-40 bg-zinc-900 text-white border-zinc-600 rounded-lg shadow-lg border"
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
