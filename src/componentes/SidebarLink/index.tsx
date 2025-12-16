"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function SidebarLink({ href, children }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href && pathname !== "sair";

  return (

    <Link
      href={href}
      className={`
        flex items-center font-bold p-4 rounded-xl gap-2 transition
        ${isActive
          ? "bg-gray-400 text-black"
          : "bg-[#D9D9D9] hover:bg-[#cfcfcf] text-black"}
      `}
    >
      {children}
    </Link>
  );
}

