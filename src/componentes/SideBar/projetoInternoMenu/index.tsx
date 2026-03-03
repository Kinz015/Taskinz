// menus/projetoInternoMenu.ts
import {
  ClipboardListIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  ClockAlertIcon,
  BookUserIcon,
  FolderKanbanIcon,
  FoldersIcon,
} from "lucide-react";

import { MenuItem } from "@/types/menus";

export function projetoInternoMenu(
  projectId: string,
  isAdm: boolean,
): MenuItem[] {
  return [
    {
      href: `/projetos/${projectId}`,
      label: "Todas as tarefas",
      icon: ClipboardListIcon,
    },
    {
      href: `/projetos/${projectId}/iniciadas`,
      label: "Iniciadas",
      icon: ClipboardClockIcon,
    },
    {
      href: `/projetos/${projectId}/concluidas`,
      label: "Concluídas",
      icon: ClipboardCheckIcon,
    },
    {
      href: `/projetos/${projectId}/atrasadas`,
      label: "Atrasadas",
      icon: ClockAlertIcon,
    },
    {
      href: `/projetos/${projectId}/membros`,
      label: "Membros",
      icon: BookUserIcon,
      visible: isAdm,
    },
    {
      href: `/projetos/${projectId}/editar`,
      label: "Editar projeto",
      icon: FolderKanbanIcon,
      visible: isAdm,
    },
    {
      href: "/projetos",
      label: "Voltar para projetos",
      icon: FoldersIcon,
    },
  ];
}
