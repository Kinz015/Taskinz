import { Header } from "@/componentes/Header";
import NovoProjetoForm from "@/componentes/projetos/NovoProjetoForm";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Projetos() {
  const user = await requireAuth();
  const invites = await getUserInvites(user.id, user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Criar projeto" user={user} invites={invites} />
      <main className="flex flex-1 flex-col p-6 text-white">
        <NovoProjetoForm />
      </main>
    </div>
  );
}
