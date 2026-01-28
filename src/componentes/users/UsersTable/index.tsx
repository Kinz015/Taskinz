import HeaderUsersTable from "../HeaderUsersTable";
import BodyUsersTable from "../BodyUsersTable";
import { AuthUser } from "@/types/auth";

type UsersTableProps = {
  users: AuthUser[];
};
export default function UsersTable({ users }: UsersTableProps) {
  return (
    <>
      <HeaderUsersTable />
      <BodyUsersTable users={users} />
    </>
  );
}
