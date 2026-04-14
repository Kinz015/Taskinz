import { Header } from "@/componentes/Header";
import UsersTable from "@/componentes/users/UsersTable";
import { requireAuth } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getUserInvites } from "@/lib/invites";
import { AdminUserRow } from "@/types/user";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TodosOsUsersProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    sort?: "createdAt";
    order?: "asc" | "desc";
  }>;
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  if (!host) throw new Error("Host header ausente");

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getProjectUsers(
  sort: string,
  order: string,
  projectId: string,
): Promise<AdminUserRow[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetchWithAuth(
    `${baseUrl}/api/projects/${projectId}/users?sort=${sort}&order=${order}`,
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar usuários (admin): ${res.status} ${text}`);
  }

  return res.json();
}

export default async function TodosOsUsers({
  searchParams,
  params,
}: TodosOsUsersProps) {
  const user = await requireAuth(); // ✅ dentro do request

  if (!user) redirect("/login");
  if (!user.isAdmin) notFound();

  const searchParamsFormated = await searchParams;
  const projectIdFormated = await params;

  const sort = searchParamsFormated.sort ?? "createdAt";
  const order = searchParamsFormated.order === "asc" ? "asc" : "desc";
  const projectId = projectIdFormated.projectId;

  const projectUsers = await getProjectUsers(sort, order, projectId);

  const invites = await getUserInvites(user.id, user.email);

  return (
    <>
      <Header title="Todos os usuários" user={user} invites={invites} />
      <UsersTable users={projectUsers} sort={sort} order={order} />
    </>
  );
}
