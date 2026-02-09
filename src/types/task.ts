export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskDTO = {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string
    name: string | null;
    email: string;
  };
  assignee: {
    id: string
    name: string | null;
    email: string;
  } | null;
};
