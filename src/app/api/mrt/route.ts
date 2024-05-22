import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { mrtStationIDTable, mrtStationLineTable, mrtStationTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const postUserInfoRequestSchema = z.object({
  mrtName: z.string(),
  mrtStationId: z.string(),
  lineName: z.string(),
});

type PostInfoRequest = z.infer<typeof postUserInfoRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postUserInfoRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { mrtName,mrtStationId,lineName } = data as PostInfoRequest;

  try {
    if (mrtName && mrtStationId && lineName) 
    {
      await db.transaction(async (tx) => {
        let [mrtStation] = await tx
        .select()
        .from(mrtStationTable)
        .where(eq(mrtStationTable.mrtName,mrtName));

        if(!mrtStation)
        {
          [mrtStation] = await tx
          .insert(mrtStationTable)
          .values({
            mrtName,
          }).returning();
        }

        
      
      const [line] = await tx.select()
        .from(mrtStationLineTable)
        .where(eq(mrtStationLineTable.lineName, lineName));
    
      await tx
        .insert(mrtStationIDTable)
        .values({
          mrtStationId: mrtStationId,
          lineId: line.displayId,
          mrtDisplayId: mrtStation.displayId,
        })
      });
      
      

      return new NextResponse("OK", { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ error: "Sth went wrong" }, { status: 500 });
}

export async function GET() {
  try {
    const mrtList = await db.select().from(mrtStationTable);

    return NextResponse.json({ mrtList }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
