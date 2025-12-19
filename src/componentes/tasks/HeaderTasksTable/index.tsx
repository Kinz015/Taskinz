import Link from "next/link";
import {
  CircleChevronDownIcon,
  CircleChevronUpIcon,
  CircleEqualIcon,
} from "lucide-react";

type SortField = "dueAt" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

type HeaderTasksTableProps = {
  sort: SortField;
  order: SortOrder;
};

function getNextOrder(
  currentSort: SortField,
  clickedSort: SortField,
  currentOrder: SortOrder
): SortOrder {
  if (currentSort !== clickedSort) return "desc";
  return currentOrder === "asc" ? "desc" : "asc";
}

export default function HeaderTasksTable({
  sort,
  order,
}: HeaderTasksTableProps) {
  function SortableHeader(label: string, field: SortField) {
    const isActive = sort === field;
    const nextOrder = getNextOrder(sort, field, order);

    return (
      <Link
        href={`?sort=${field}&order=${nextOrder}`}
        className="inline-flex items-center gap-1 justify-center cursor-pointer select-none hover:underline"
      >
        <span>{label}</span>

        <span>
          {isActive ? (
            order === "asc" ? (
              <CircleChevronUpIcon size={17} />
            ) : (
              <CircleChevronDownIcon size={17} />
            )
          ) : (
            <CircleEqualIcon size={17} />
          )}
        </span>
      </Link>
    );
  }

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

          <th className="py-4 text-center">
            {SortableHeader("Prazo", "dueAt")}
          </th>

          <th className="py-4 text-center">
            {SortableHeader("Data inicial", "createdAt")}
          </th>

          <th className="py-4 text-center">
            {SortableHeader("Última alteração", "updatedAt")}
          </th>

          <th className="py-4 pr-2 text-center">Ações</th>
        </tr>
      </thead>
    </table>
  );
}
