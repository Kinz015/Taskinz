
import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MobileHeaderMenu } from "../MobileHeaderMenu";
import { requireAuth } from "@/lib/auth";

type HeaderProps = {
  title: string;
};

export async function Header({ title }: HeaderProps) {
  const user = await requireAuth();
  if (!user) redirect("/login");

  return (
    <header
      className="
        flex items-center
        bg-[#1b1b1f]
        h-30
        md:h-38
        xl:h-50
        sm:pl-16
        lg:pl-21
      "
    >
      {/* 📱 MOBILE */}
      <div className="flex md:hidden h-[120] w-full items-center justify-between px-4">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt="Foto do perfil"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <CircleUserRoundIcon className="h-full w-full text-gray-300" />
          )}
        </div>

        <span className="text-white font-bold text-xl truncate max-w-[55vw]">
          {title}
        </span>
        <div className="w-12 h-12 flex justify-center items-center">
          <MobileHeaderMenu user={user} />
        </div>
      </div>

      {/* 💻 Desktop */}
      <div className="hidden md:flex justify-between w-full">
        <h1
          className="
            text-white font-bold
            text-2xl sm:text-3xl lg:text-4xl
          "
        >
          {title}
        </h1>
        <div className="flex items-center gap-2 mr-10">
          <Link href="/meu-perfil" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center">
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt="Foto do perfil"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRoundIcon className="h-full w-full text-gray-300" />
              )}
            </div>
            <span className="text-white pt-05">
              {user.name ?? user.email ?? "Usuário"}
            </span>
          </Link>
          {user.isAdmin === true && (
            <span
              className="
              inline-flex items-center rounded-full
              border border-red-500/30 bg-red-500/10
              px-2 py-0.5 text-[11px] font-semibold 
              tracking-wide text-red-200 shadow-sm shadow-red-500/10"
            >
              ADM
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
