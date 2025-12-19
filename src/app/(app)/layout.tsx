import type { Metadata } from "next";
import { SideBar } from "@/componentes/SideBar";

export const metadata: Metadata = {
  title: "Desafio Técnico Full Stack",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 bg-[#2a2a2a]">{children}</main>
    </div>
  );
}
