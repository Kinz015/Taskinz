import { Header } from "@/componentes/Header";
import UsersTable from "@/componentes/users/UsersTable";
import { getLoggedUser } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AdminUserRow } from "@/types/user";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TodosOsUsersProps = {
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

async function getUsers(sort: string, order: string): Promise<AdminUserRow[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetchWithAuth(
    `${baseUrl}/api/admin/users?sort=${sort}&order=${order}`,
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar usuários (admin): ${res.status} ${text}`);
  }

  return res.json();
}

export default async function TodosOsUsers({
  searchParams,
}: TodosOsUsersProps) {
  const user = await getLoggedUser(); // ✅ dentro do request

  if (!user) redirect("/login");
  if (!user.isAdmin) notFound();

  const params = await searchParams;

  const sort = params.sort ?? "createdAt";
  const order = params.order === "asc" ? "asc" : "desc";

  const users = await getUsers(sort, order);

  return (
    <>
      <Header title="Todos os usuários" />
      <UsersTable users={users} sort={sort} order={order} />
    </>
  );
}
