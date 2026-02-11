import { Header } from "@/componentes/Header";
import NovoProjetoForm from "@/componentes/projetos/NovoProjetoForm";
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
      <Header title="Área de projetos"/>
      <NovoProjetoForm/>
    </div>
  );
}
