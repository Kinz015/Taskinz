import { Header } from "@/componentes/Header";
import UsersTable from "@/componentes/users/UsersTable";
import { getLoggedUser } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuthUser } from "@/types/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  if (!host) throw new Error("Host header ausente");

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getUsers(): Promise<AuthUser[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetchWithAuth(`${baseUrl}/api/admin/users`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar usuários (admin): ${res.status} ${text}`);
  }

  return res.json();
}

export default async function TodosOsUsers() {
  const user = await getLoggedUser(); // ✅ dentro do request

  if (!user) redirect("/login");
  if (!user.isAdmin) notFound();

  const users = await getUsers();

  return (
    <>
      <Header title="Todos os usuários" />
      <UsersTable users={users} />
    </>
  );
}
