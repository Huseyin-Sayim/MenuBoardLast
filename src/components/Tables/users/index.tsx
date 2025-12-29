import { getUsers } from "@/services/userServices";
import { TableWrapper } from "@/components/Tables/top-channels/table-wrapper";

export async function UsersTable() {
  const users = await getUsers();

  return <TableWrapper data={users} showActions={true} />;
}