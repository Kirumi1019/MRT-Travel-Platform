import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleLikeTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const postLikeArticleRequestSchema = z.object({
  userId: z.string().uuid(),
});

type PostLikeArticleRequest = z.infer<typeof postLikeArticleRequestSchema>;

export async function PUT(request: NextRequest) {
  let data = await request.json();
  try {
    postLikeArticleRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }
  const { userId } = data as PostLikeArticleRequest;

  try {
    const articleList = await db
      .select({ articleId: articleLikeTable.articleId })
      .from(articleLikeTable)
      .where(eq(articleLikeTable.userId, userId))
      .execute();
    return NextResponse.json({ articleList });
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
