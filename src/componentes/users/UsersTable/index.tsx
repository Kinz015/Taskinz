import HeaderUsersTable from "../HeaderUsersTable";
import BodyUsersTable from "../BodyUsersTable";
import { AdminUserRow } from "@/types/user";

type UsersTableProps = {
  users: AdminUserRow[];
  sort: "createdAt";
  order: "asc" | "desc";
};
export default function UsersTable({ users, sort, order }: UsersTableProps) {
  return (
    <>
      <HeaderUsersTable sort={sort} order={order} />
      <BodyUsersTable users={users} />
    </>
  );
}
