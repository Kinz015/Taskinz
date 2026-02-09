export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  isAdmin: boolean;
  createdAt: string; // ou Date (mas JSON vem string)
  updatedAt: string;

  tasksTotal: number;
  tasksConcluidas: number;
  tasksEmAndamento: number;
  tasksPendentes: number;
};
