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
      {/* 📱 MOBILE — barra de ordenação */}
      <div className="md:hidden">
        <div className="flex items-center flex-wrap gap-2 bg-[#1b1b1f] p-2 text-sm text-white">
          <span className="mr-2 text-gray-400">Ordenar por:</span>

          {(["dueAt", "createdAt", "updatedAt"] as SortField[]).map((field) => {
            const label =
              field === "dueAt"
                ? "Prazo"
                : field === "createdAt"
                ? "Criação"
                : "Atualização";

            const isActive = sort === field;
            const nextOrder = getNextOrder(sort, field, order);

            return (
              <Link
                key={field}
                href={`?sort=${field}&order=${nextOrder}`}
                className={`flex items-center gap-1 rounded-md px-3 py-1 transition
                    ${
                      isActive
                        ? "bg-red-500 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }
                  `}
              >
                {label}
                {isActive &&
                  (order === "asc" ? (
                    <CircleChevronUpIcon size={14} />
                  ) : (
                    <CircleChevronDownIcon size={14} />
                  ))}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 🖥 DESKTOP — header da tabela */}
      <table className="hidden md:table px-2 w-full">
        <colgroup>
          <col className="min-w-[67] w-[67] max-w-[67]" />
          <col className="w-[500]" />
          <col className="min-w-[150]" />
          <col className="min-w-[150] max-[830px]:hidden" />
          <col className="min-w-[150] max-[1000px]:hidden" />
          <col className="min-w-[150] max-[1250px]:hidden" />
          <col className="min-w-[150] max-[1400px]:hidden" />
          <col className="min-w-[67] w-[67] max-w-[67]" />
        </colgroup>

        <thead>
          <tr className="bg-[#1b1b1f] text-white">
            <th className="py-4 pl-2 text-center">Nº</th>
            <th className="py-4 text-start">Título</th>
            <th className="py-4 text-center">Status</th>
            <th className="py-4 text-center max-[830px]:hidden">Responsável</th>
            <th className="py-4 text-center max-[1000px]:hidden">
              {SortableHeader("Prazo", "dueAt")}
            </th>
            <th className="py-4 text-center max-[1250px]:hidden">
              {SortableHeader("Data inicial", "createdAt")}
            </th>
            <th className="py-4 text-center max-[1400px]:hidden">
              {SortableHeader("Última alteração", "updatedAt")}
            </th>
            <th className="py-4 pr-2 text-center">Ações</th>
          </tr>
        </thead>
      </table>
    </>
  );
}
