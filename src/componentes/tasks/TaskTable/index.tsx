import { TaskDTO } from "@/types/task";
import BodyTasksTable from "../BodyTasksTable";
import HeaderTasksTable from "../HeaderTasksTable";
import { AuthUser } from "@/types/auth";
import EmptyTasksState from "../EmptyTasksState";

type Page = "all" | "overdue" | "started" | "completed";

type TasksTableProps = {
  tasks: TaskDTO[];
  sort: "dueAt" | "createdAt" | "updatedAt";
  order: "asc" | "desc";
  user: AuthUser;
  page: Page;
  actionHref?: string;
};
export default function TasksTable({
  tasks,
  sort,
  order,
  user,
  page,
  actionHref,
}: TasksTableProps) {
  return (
    <>
      <HeaderTasksTable sort={sort} order={order} />
      {tasks.length === 0 ? (
        <EmptyTasksState page={page} actionHref={actionHref} />
      ) : (
        <BodyTasksTable tasks={tasks} user={user} actionHref={actionHref} />
      )}
    </>
  );
}
