import { TaskDTO } from "@/types/task";
import BodyTasksTable from "../BodyTasksTable";
import HeaderTasksTable from "../HeaderTasksTable";
import { AuthUser } from "@/types/auth";

type TasksTableProps = {
  tasks: TaskDTO[];
  sort: "dueAt" | "createdAt" | "updatedAt";
  order: "asc" | "desc";
  user: AuthUser;
};
export default function TasksTable({ tasks, sort, order, user }: TasksTableProps) {
  return (
    <>
      <HeaderTasksTable sort={sort} order={order} />
      <BodyTasksTable tasks={tasks} user={user} />
    </>
  );
}
