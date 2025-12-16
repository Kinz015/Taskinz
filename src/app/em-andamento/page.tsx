import { Header } from "@/componentes/Header";

export default function EmAndamento() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Em andamento"/>
      <main>
        <table>
          Em andamento
        </table>
      </main>
    </div>
  );
}