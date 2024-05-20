import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { mrtStationTable } from "@/db/schema";

const postUserInfoRequestSchema = z.object({
  mrtId: z.string(),
  mrtName: z.string(),
});

type PostInfoRequest = z.infer<typeof postUserInfoRequestSchema>;

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    postUserInfoRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { mrtId, mrtName } = data as PostInfoRequest;
  

    try{
      if(mrtId && mrtName)
      {
        const [createdMrt] = await db
          .insert(mrtStationTable)
          .values({
            mrtId,
            mrtName,
          })
          .returning();
      }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}