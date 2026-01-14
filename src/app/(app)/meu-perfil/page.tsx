import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import { prisma } from "@/lib/prisma";


export default async function MeuPerfil() {
  const auth = await requireAuth(); // pega id do token

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { name: true, email: true, imageUrl: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 sm:px-10 lg:px-12 py-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl pt-10 font-bold text-white">Meu perfil</h1>
        <p className="text-white/60 py-5">
          Edite suas informações básicas e senha.
        </p>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
          <ProfileForm
            initialName={user.name ?? ""}
            initialEmail={user.email ?? ""}
            initialImageUrl={user.imageUrl ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

