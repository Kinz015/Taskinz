export default function HeaderTasksTable() {
  return (
    <table className="w-full">
      <colgroup>
        <col className="w-[60]" />
        <col className="w-[320]" />
        <col className="w-[140]" />
        <col className="w-[200]" />
        <col className="w-[120]" />
        <col className="w-[140]" />
        <col className="w-[160]" />
        <col className="w-[80]" />
      </colgroup>
      <thead>
        <tr className="bg-[#1b1b1f] text-white">
          <th className="p-4 text-start">Nº</th>
          <th className="p-4 text-start">Título</th>
          <th className="p-4 text-center">Status</th>
          <th className="p-4 text-center">Responsável</th>
          <th className="p-4 text-center">Prazo</th>
          <th className="p-4 text-center">Data inicial</th>
          <th className="p-4 text-center">Última alteração</th>
          <th className="p-4 text-right">Ações</th>
        </tr>
      </thead>
    </table>
  );
}
