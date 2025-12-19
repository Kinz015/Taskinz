export default function HeaderTasksTable() {
  return (
    <table className="px-2 w-full">
      <colgroup>
        <col className="w-[54]" />
        <col className="w-[500]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[200]" />
        <col className="w-[77]" />
      </colgroup>
      <thead>
        <tr className="bg-[#1b1b1f] text-white">
          <th className="py-4 pl-2 text-center">Nº</th>
          <th className="py-4 text-start">Título</th>
          <th className="py-4 text-center">Status</th>
          <th className="py-4 text-center">Responsável</th>
          <th className="py-4 text-center">Prazo</th>
          <th className="py-4 text-center">Data inicial</th>
          <th className="py-4 text-center">Última alteração</th>
          <th className="py-4 pr-2 text-center">Ações</th>
        </tr>
      </thead>
    </table>
  );
}
