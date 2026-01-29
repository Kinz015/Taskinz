import HeaderUsersTable from "../HeaderUsersTable";
import BodyUsersTable from "../BodyUsersTable";
import { AdminUserRow } from "@/types/user";


type UsersTableProps = {
  users: AdminUserRow [];
};
export default function UsersTable({ users }: UsersTableProps) {
  return (
    <>
      <HeaderUsersTable />
      <BodyUsersTable users={users} />
    </>
  );
}
