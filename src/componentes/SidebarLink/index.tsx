"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarLinkProps =
  | {
      href: string;
      onClick?: never;
      children: React.ReactNode;
    }
  | {
      href?: never;
      onClick: () => void;
      children: React.ReactNode;
    };

export default function SidebarLink(props: SidebarLinkProps) {
  const pathname = usePathname();

  const isActive =
    props.href !== undefined && pathname === props.href;

  const baseClass = `
    flex items-center font-bold p-4 rounded-xl gap-2 transition
    ${isActive
      ? "bg-gray-400 text-black"
      : "bg-[#D9D9D9] hover:bg-[#cfcfcf] text-black"}
  `;

  // 👉 LINK
  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={baseClass}>
        {props.children}
      </Link>
    );
  }

  // 👉 BOTÃO (logout)
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`${baseClass} w-full text-left`}
    >
      {props.children}
    </button>
  );
}
