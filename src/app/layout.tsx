import type { Metadata } from "next";
import "./globals.css";
import { SideBar } from "@/componentes/SideBar";
import { ToastContainer } from "react-toastify";

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
    <html lang="pt-BR">
      <body className="flex">
        <SideBar />
        <main className="flex-1">
          {children}
          <ToastContainer position="top-center" />
        </main>
      </body>
    </html>
  );
}
