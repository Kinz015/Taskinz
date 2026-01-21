import clsx from "clsx";
import { CirclePlusIcon, ClipboardCheckIcon, ClipboardClockIcon, ClipboardListIcon, ClockAlertIcon } from "lucide-react";
import Link from "next/link";

type Page = "all" | "pending" | "in_progress" | "completed";

type Props = {
  page: Page;

  actionLabel?: string;
  actionHref?: string;

  className?: string;
};

export default function EmptyTasksState({ page }: Props) {
  const pages = {
    all: {
      title: "Você ainda não criou nenhuma tarefa",
      description:
        "Crie sua primeira tarefa para acompanhar prazos, status e responsáveis.",
    },
    pending: {
      title: "Você não tem tarefas pendentes",
      description:
        "Crie uma nova tarefa para acompanhar prazos, status e responsáveis.",
    },
    in_progress: {
      title: "Você não tem tarefas em andamento",
      description:
        "Quando você iniciar uma tarefa, ela aparecerá aqui para acompanhar o progresso.",
    },
    completed: {
      title: "Você ainda não concluiu nenhuma tarefa",
      description: "Assim que você concluir tarefas, elas aparecerão aqui.",
    },
  };

  return (
    <div className="pt-10">
      <div className="flex flex-col items-center text-center py-20">
        {/* Ícone (menor e suave, como no print) */}
        <div
          className={clsx(
            "flex items-center justify-center ",
            "bg-white/25 bg- rounded-full border-white/10",
            "text-white p-2.5 mb-4",
            "border",
          )}
        >
          {page === "all" && <ClipboardListIcon />}
          {page === "completed" &&  <ClipboardCheckIcon />}
          {page === "in_progress" &&  <ClipboardClockIcon />}
          {page === "pending" &&  <ClockAlertIcon />}
        </div>
        <h2 className="text-xl font-bold text-white">{pages[page].title}</h2>
        <p className="mt-2 max-w-lg text-sm text-white/60">
          {pages[page].description}
        </p>
        <Link
          href="adicionar-tarefa"
          className={clsx(
            "flex items-center rounded-md",
            "bg-green-600 hover:opacity-80",
            "mt-6 gap-2 px-3 py-2.5",
            "font-semibold text-white",
          )}
        >
          <CirclePlusIcon width={20} />
          <span className="flex pt-0.5 items-center">Criar tarefa</span>
        </Link>
      </div>
    </div>
  );
}
