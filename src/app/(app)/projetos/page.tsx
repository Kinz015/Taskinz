import { Header } from "@/componentes/Header";
import { EmptyProjects } from "@/componentes/projetos/EmptyProjects";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { prisma } from "@/lib/prisma";
import { FolderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
      {children}
    </span>
  );
}

export default async function Projetos() {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  const invites = await getUserInvites(user.id, user.email);

  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: { userId: user.id },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      tags: true,
      _count: {
        select: { tasks: true, members: true },
      },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Meus projetos" user={user} invites={invites} />
      <main className="flex flex-1 flex-col bg-[#2a2a2a]">
        <div className="mx-auto w-full max-w-6xl">
          {projects.length > 0 && (
            <header className="mb-8 flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Projetos
              </h1>
              <p className="text-sm text-white/60">
                Clique em um card para abrir o projeto.
              </p>
            </header>
          )}
          {projects.length === 0 ? (
            <EmptyProjects />
          ) : (
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projetos/${project.id}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <FolderIcon className="h-5 w-5 text-white/50" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-white">
                          {project.title}
                        </h2>
                        <p className="truncate text-xs text-white/60">
                          https://linkAleatorio
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      Abrir ↗
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={`Preview de ${project.title}`}
                          fill
                          className="object-cover transition group-hover:scale-[1.02]"
                        />
                      ) : (
                        <FolderIcon className="h-5 w-5 text-white/50" />
                      )}
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-white/70">
                    {project.description}
                  </p>

                  {project.tags && project.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag.id}>{tag.name}</Tag>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-xs text-white/50 italic">
                      Nenhuma tag vinculada.
                    </div>
                  )}
                </Link>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
