import { getLoggedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MobileHeaderMenu } from "../MobileHeaderMenu";

type HeaderProps = {
  title: string;
};

export async function Header({ title }: HeaderProps) {
  const auth = await getLoggedUser();
  if (!auth) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { name: true, email: true, imageUrl: true },
  });

  if (!user) redirect("/login");

  return (
    <header
      className="
        flex items-center
        bg-[#1b1b1f]
        h-30
        md:h-38
        px-10
        xl:h-50
        sm:pl-16
        lg:pl-21
        justify-between
      "
    >
      <h1
        className="
          text-white font-bold
          text-2xl sm:text-3xl lg:text-4xl
        "
      >
        {title}
      </h1>
      <MobileHeaderMenu user={user} />
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

        <span className="hidden md:inline text-white pt-05">
          {user.name ?? user.email ?? "Usuário"}
        </span>
      </Link>
    </header>
  );
}
