import { TaskDTO } from "@/types/task";
import BodyTasksTable from "../BodyTasksTable";
import HeaderTasksTable from "../HeaderTasksTable";

type TasksTableProps = {
  tasks: TaskDTO[]
}

export default function TasksTable({ tasks }: TasksTableProps) {
  return (
    <div className="flex flex-1 flex-col">
      <HeaderTasksTable />
      <BodyTasksTable tasks={tasks} />
    </div>
  );
}
