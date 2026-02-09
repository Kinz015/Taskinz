import {
  CircleChevronDownIcon,
  CircleChevronUpIcon,
  CircleEqualIcon,
} from "lucide-react";
import Link from "next/link";

type SortField = "createdAt"
type SortOrder = "asc" | "desc";

type HeaderUsersTableProps = {
  sort: SortField;
  order: SortOrder;
};

function getNextOrder(
  currentSort: SortField,
  clickedSort: SortField,
  currentOrder: SortOrder,
): SortOrder {
  if (currentSort !== clickedSort) return "desc";
  return currentOrder === "asc" ? "desc" : "asc";
}

export default function HeaderUsersTable({
  sort,
  order,
}: HeaderUsersTableProps) {
  function SortableHeader(label: string, field: SortField) {
    const isActive = sort === field;
    const nextOrder = getNextOrder(sort, field, order);
    return (
      <Link
        href={`?sort=${field}&order=${nextOrder}`}
        className="inline-flex items-center gap-1 justify-center select-none hover:underline"
      >
        <span>{label}</span>

        {isActive ? (
          order === "asc" ? (
            <CircleChevronUpIcon size={17} />
          ) : (
            <CircleChevronDownIcon size={17} />
          )
        ) : (
          <CircleEqualIcon size={17} />
        )}
      </Link>
    );
  }

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
            <th className="py-4 text-center">Iniciadas</th>
            <th className="py-4 text-center">Atrasadas</th>
            <th className="py-4 text-center">
              {SortableHeader("Criado em", "createdAt")}
            </th>
            <th className="py-4 pr-2 text-center">Ações</th>
          </tr>
        </thead>
      </table>
    </>
  );
}
