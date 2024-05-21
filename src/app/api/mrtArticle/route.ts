import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleMRTTable } from "@/db/schema";

const postArticleMRTRequestSchema = z.object({
  articleId: z.string().uuid(),
  mrtName: z.string().max(15),
});

type PostArticleMRTRequest = z.infer<typeof postArticleMRTRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();

  try {
    postArticleMRTRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { articleId, mrtName } = data as PostArticleMRTRequest;

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(articleMRTTable)
        .values({
          articleId,
          mrtName,
        })
        .returning();
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("OK", { status: 200 });
}
