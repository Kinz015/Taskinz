import { LucideIcon } from "lucide-react";

export type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  visible?: boolean;
};
