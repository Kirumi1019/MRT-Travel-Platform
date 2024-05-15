// npx shadcn-ui@latest add table
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getMyinfo } from "../../_components/actions";
import Entry from "./entry";

type Props = {
  params: {
    userId: string,
  }
}

async function MyInfo({ params: { userId } }: Props) {
  const dbInfo = await getMyinfo(userId);

  return (
    <>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Email</TableHead>
            <TableHead >Username</TableHead>
            <TableHead >Password</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dbInfo?.map((info) => (
            <Entry key={info.displayId} email={info.email} username={info.username} displayId={info.displayId}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
export default MyInfo;
