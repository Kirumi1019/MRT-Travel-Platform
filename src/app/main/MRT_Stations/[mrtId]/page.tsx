
import { auth } from "@/lib/auth";
import StationInfo from "./StationInfo"
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
import { db } from "@/db";
import { mrtLikedTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Get url dynamic parameter
// "params" is fixed, cannot use other variable !!!!
type URLParams = {
    params: {
        mrtId: string;
    };
}

async function Station({
    params: {mrtId},
}: URLParams){
    const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const id = session.user.id;
  const [liked] = await db.select({
    userId: mrtLikedTable.userId
  })
    .from(mrtLikedTable)
    .where(and(eq(mrtLikedTable.userId,id),
               eq(mrtLikedTable.mrtDisplayId, mrtId)
            )
    ).execute();
    
    return (
        <>
            <StationInfo userId={id} initialLiked={Boolean(liked)}/>
        </>
    )
}
export default Station