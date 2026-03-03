import { MenuItem } from "@/types/menus";
import { FoldersIcon, FolderPlusIcon, UserRoundIcon } from "lucide-react";


export const projetosMenu: MenuItem[] = [
  {
    href: "/projetos",
    label: "Meus projetos",
    icon: FoldersIcon,
  },
  {
    href: "/projetos/novo",
    label: "Criar projeto",
    icon: FolderPlusIcon,
  },
  {
    href: "/",
    label: "Área pessoal",
    icon: UserRoundIcon,
  },
];
