import { Header } from "@/componentes/Header";
import UsersTable from "@/componentes/users/UsersTable";
import { requireAuth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { prisma } from "@/lib/prisma";
import { AdminUserRow } from "@/types/user";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TodosOsUsersProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{
    sort?: "createdAt";
    order?: "asc" | "desc";
  }>;
};

export default async function TodosOsUsers({
  searchParams,
  params,
}: TodosOsUsersProps) {
  const user = await requireAuth();
  if (!user) redirect("/login");

  const invites = await getUserInvites(user.id, user.email);

  const query = await searchParams;
  const { projectId } = await params;
  const projectIdNumber = Number(projectId);

  if (isNaN(projectIdNumber)) return notFound();

  // 🔐 verifica role no projeto
  const member = await prisma.projectMember.findFirst({
    where: {
      projectId: projectIdNumber,
      userId: user.id,
    },
  });

  if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
    return notFound();
  }

  // 🔥 busca membros + user
  const members = await prisma.projectMember.findMany({
    where: { projectId: projectIdNumber },
    include: { user: true },
  });

  // 💎 NORMALIZAÇÃO (AQUI ESTÁ O SEGREDO)
  const projectUsers: AdminUserRow[] = members.map((member) => ({
    id: member.user.id,
    name: member.user.name ?? "Sem nome",
    email: member.user.email,
    imageUrl: member.user.imageUrl,
    role: member.role,
    
    scope: "project",

    isAdmin: false,
    tasksTotal: 0,
    tasksConcluidas: 0,
    tasksIniciadas: 0,
    tasksAtrasadas: 0,

    // 👇 AQUI A CORREÇÃO
    createdAt: member.user.createdAt.toISOString(),
    updatedAt: member.user.createdAt.toISOString(),
  }));

  const sort = query.sort ?? "createdAt";
  const order = query.order === "asc" ? "asc" : "desc";

  return (
    <>
      <Header title="Todos os usuários" user={user} invites={invites} />
      <UsersTable users={projectUsers} sort={sort} order={order} />
    </>
  );
}
