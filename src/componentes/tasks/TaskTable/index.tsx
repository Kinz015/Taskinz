import { Task } from "@/lib/mockTasks";
import BodyTasksTable from "../BodyTasksTable";
import HeaderTasksTable from "../HeaderTasksTable";

type TasksTableProps = {
  tasks: Task[];
};

export default function TasksTable({ tasks }: TasksTableProps) {
  return (
    <div className="flex flex-1 flex-col bg-[#2a2a2a]">
      <HeaderTasksTable />
      <BodyTasksTable tasks={tasks} />
    </div>
  );
}
