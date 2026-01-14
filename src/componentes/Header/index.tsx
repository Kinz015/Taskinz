import { getLoggedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type HeaderProps = {
  title: string;
};

export async function Header({ title }: HeaderProps) {
  const auth = await getLoggedUser();
  if (!auth) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { name: true, imageUrl: true },
  });

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
      <Link
        href={"/meu-perfil"}
        className="flex justify-center items-center gap-2"
      >
        <div className="bg-white rounded-full">
          <CircleUserRoundIcon size={30} />
        </div>
        <span className="text-white pt-05">{user?.name}</span>
      </Link>
    </header>
  );
}
