"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
    "href" in props && props.href !== undefined && pathname === props.href;

  const baseClass = `
    flex items-center justify-center lg:justify-start
    font-bold p-4 rounded-xl gap-3 transition
    ${
      isActive
        ? "bg-gray-400 text-black"
        : "bg-[#D9D9D9] hover:bg-[#cfcfcf] text-black"
    }
  `;

  const content = (
    <>
      {/* Ícone */}
      <span className="shrink-0">
        {React.Children.toArray(props.children)[0]}
      </span>

      {/* Texto — só desktop */}
      <span className="hidden lg:inline text-sm whitespace-nowrap">
        {React.Children.toArray(props.children)[1]}
      </span>
    </>
  );

   if (props.href !== undefined) {
    return (
      <Link href={props.href} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`${baseClass} w-full text-left`}
    >
      {content}
    </button>
  );
}
