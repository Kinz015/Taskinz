import { Header } from "@/componentes/Header";
import { getLoggedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Projetos() {
  const user = await getLoggedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Área de projetos" />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <p>projeto expecifico </p>
      </main>
    </div>
  );
}
