import { SideBar } from "@/componentes/SideBar";
import { getLoggedUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedUser();
  return (
    <div className="flex min-h-screen">
      <SideBar user={user} />
      <main className="flex-1 bg-[#2a2a2a]">{children}</main>
    </div>
  );
}
