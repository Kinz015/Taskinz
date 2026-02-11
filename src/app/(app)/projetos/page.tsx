import { Header } from "@/componentes/Header";
import { getLoggedUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Project = {
  id: number;
  title: string;
  link: string;
  img: string; // use /public/projects/... (recomendado)
  description: string;
  tags?: string[];
};

const projects: Project[] = [
  {
    id: 1,
    title: "Taskinz",
    link: "https://taskinz.vercel.app",
    img: "/projects/taskinz.png",
    description:
      "Gerenciador de tarefas e projetos com prazos, status e organização simples.",
    tags: ["Next.js", "Prisma", "MySQL"],
  },
  {
    id: 2,
    title: "Linkinz",
    link: "https://linkinz.vercel.app",
    img: "/projects/linkinz.png",
    description:
      "Página de links personalizada para compartilhar tudo em um só lugar.",
    tags: ["React", "UI"],
  },
];

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
      {children}
    </span>
  );
}

export default async function Projetos() {
  const user = await getLoggedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Meus projetos" />
      <main className="min-h-screen bg-[#0f0f12] px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-8 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Projetos
            </h1>
            <p className="text-sm text-white/60">
              Clique em um card para abrir o projeto.
            </p>
          </header>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-white">
                        {p.title}
                      </h2>
                      <p className="truncate text-xs text-white/60">
                        {new URL(p.link).host}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                    Abrir ↗
                  </span>
                </div>

                <div className="mt-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    <Image
                      src={p.img}
                      alt={`Preview de ${p.title}`}
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm text-white/70">
                  {p.description}
                </p>
                {p.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                ) : null}
              </Link>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
