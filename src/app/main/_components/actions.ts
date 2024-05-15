import { eq} from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const getMyinfo = async (userId: string) => {
  "use server";
  const info = await db.select().from(usersTable).where(eq(usersTable.displayId, userId));
  return info;
};
