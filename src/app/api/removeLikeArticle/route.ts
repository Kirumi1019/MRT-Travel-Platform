import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleLikeTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const removeLikeArticleRequestSchema = z.object({
  articleId: z.string().uuid(),
});

type RemoveLikeArticleRequest = z.infer<typeof removeLikeArticleRequestSchema>;

export async function PUT(request: NextRequest) {
  let data = await request.json();
  try {
    removeLikeArticleRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }
  const { articleId } = data as RemoveLikeArticleRequest;

  try {
    const result = await db
      .delete(articleLikeTable)
      .where(eq(articleLikeTable.articleId, articleId))
      .returning();
    //return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("Ok", { status: 200 });
}
