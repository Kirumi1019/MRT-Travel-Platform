import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleMRTTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const getTagsRequestSchema = z.object({
  articleId: z.string().uuid(),
});

type GetTagsRequest = z.infer<typeof getTagsRequestSchema>;

export async function PUT(request: NextRequest) {
  let data = await request.json();
  try {
    getTagsRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }
  const { articleId } = data as GetTagsRequest;

  try {
    const Tags = await db
      .select()
      .from(articleMRTTable)
      .where(eq(articleMRTTable.articleId, articleId))
      .execute();

    return NextResponse.json({ Tags });
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
