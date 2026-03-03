import {
  ClipboardListIcon,
  ClipboardPlusIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  ClockAlertIcon,
  FolderKanbanIcon,
} from "lucide-react";

import { MenuItem } from "@/types/menus";

export const pessoalMenu: MenuItem[] = [
  {
    href: "/",
    label: "Todas as tarefas",
    icon: ClipboardListIcon,
  },
  {
    href: "/adicionar-tarefa",
    label: "Adicionar tarefa",
    icon: ClipboardPlusIcon,
  },
  {
    href: "/concluidas",
    label: "Concluídas",
    icon: ClipboardCheckIcon,
  },
  {
    href: "/iniciadas",
    label: "Iniciadas",
    icon: ClipboardClockIcon,
  },
  {
    href: "/atrasadas",
    label: "Atrasadas",
    icon: ClockAlertIcon,
  },
  {
    href: "/projetos",
    label: "Área de projetos",
    icon: FolderKanbanIcon,
  },
];
