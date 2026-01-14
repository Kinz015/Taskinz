import { useLayoutEffect, useRef, useState } from "react";
import { EllipsisIcon } from "lucide-react";

type ActionsMenuProps = {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export function ActionsMenu({ open, onToggle, children }: ActionsMenuProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"down" | "up">("down");

  useLayoutEffect(() => {
    if (!open) return;

    const compute = () => {
      const btn = btnRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;

      const btnRect = btn.getBoundingClientRect();
      const menuHeight = menu.offsetHeight;

      const spaceBelow = window.innerHeight - btnRect.bottom;
      const needed = menuHeight + 8; // 8px ~ mt-2

      setPlacement(spaceBelow < needed ? "up" : "down");
    };

    requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true); // pega scroll de containers também

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open]);

  return (
    <div className="relative rounded-r-lg overflow-visible">
      <button
        ref={btnRef}
        onClick={onToggle}
        className={`w-full h-full flex justify-center rounded-r-lg hover:bg-gray-300 hover:cursor-pointer
          ${open ? "py-6" : "py-4"}
        `}
      >
        <EllipsisIcon />
      </button>

      {open && (
        <div
          ref={menuRef}
          className={`absolute right-0 z-50 w-40 bg-white rounded-md shadow-lg border
            ${placement === "down" ? "top-full mt-2" : "bottom-full mb-2"}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}