import { TaskDTO } from "@/types/task";
import BodyTasksTable from "../BodyTasksTable";
import HeaderTasksTable from "../HeaderTasksTable";

type TasksTableProps = {
  tasks: TaskDTO[];
  sort: "dueAt" | "createdAt" | "updatedAt";
  order: "asc" | "desc";
};

export default function TasksTable({ tasks, sort, order }: TasksTableProps) {
  return (
    <div className="flex flex-1 flex-col">
      <HeaderTasksTable sort={sort} order={order} />
      <BodyTasksTable tasks={tasks} />
    </div>
  );
}
