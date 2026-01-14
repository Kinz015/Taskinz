"use client";

import { AuthUser } from "@/types/auth";
import { CircleUserRoundIcon } from "lucide-react";

type HeaderProps = {
  title: string;
  user: AuthUser | null;
};

export function Header({ title, user }: HeaderProps) {
  return (
    <header
      className="
        flex items-center
        bg-[#1b1b1f]
        h-50
        px-4 sm:px-10 lg:pl-21
        justify-between
      "
    >
      <h1
        className="
          text-white font-bold
          text-2xl sm:text-4xl lg:text-4xl
          text-center lg:text-left
        "
      >
        {title}
      </h1>
      <div className="flex justify-center items-center gap-2">
        <div className="bg-white rounded-full"><CircleUserRoundIcon size={30} /></div>
        <span className="text-white pt-05">{user?.name}</span>
      </div>
    </header>
  );
}
