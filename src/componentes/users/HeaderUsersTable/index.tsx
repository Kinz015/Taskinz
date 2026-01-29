export default function HeaderUsersTable() {
  return (
    <>
      {/* 🖥 DESKTOP — header da tabela */}
      <table className="hidden md:table px-2 w-full">
        <colgroup>
          <col className="min-w-[67] w-[67] max-w-[67]" />
          <col className="w-[250]" />
          <col className="w-[250]" />
          <col className="w-[100]" />
          <col className="w-[150]" />
          <col className="w-[100]" />
          <col className="w-[150]" />
          <col className="w-[150]" />
          <col className="w-[150]" />
          <col className="min-w-[67] w-[67] max-w-[67]" />
        </colgroup>

        <thead>
          <tr className="bg-[#1b1b1f] text-white">
            <th className="py-4 pl-2 text-center">Nº</th>
            <th className="py-4 text-left">Usuário</th>
            <th className="py-4 text-left">Email</th>
            <th className="py-4 text-center">Cargo</th>
            <th className="py-4 text-center">Tasks</th>
            <th className="py-4 text-center">Concluídas</th>
            <th className="py-4 text-center">
              Em andamento
            </th>
            <th className="py-4 text-center">Pendentes</th>
            <th className="py-4 text-center">Criado em</th>
            <th className="py-4 pr-2 text-center">Ações</th>
          </tr>
        </thead>
      </table>
    </>
  );
}
