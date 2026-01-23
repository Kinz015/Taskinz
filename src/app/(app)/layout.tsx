import { SideBar } from "@/componentes/SideBar";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <SideBar user={user} />
      <main className="flex-1 bg-[#2a2a2a]">{children}</main>
    </div>
  );
}
