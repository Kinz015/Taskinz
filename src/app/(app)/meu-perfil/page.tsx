import { redirect } from "next/navigation";
import { getLoggedUser } from "@/lib/auth";

export default async function MeuPerfil() {
  const user = await getLoggedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 sm:px-10 lg:px-12 py-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white">Meu perfil</h1>
        <p className="text-white/60 mt-1">
          Edite suas informações básicas e senha.
        </p>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">

        </div>
      </div>
    </div>
  );
}
