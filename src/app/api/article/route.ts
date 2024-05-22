import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const getArticleRequestSchema = z.object({
  articleId: z.string().uuid(),
});

type GetArticleRequest = z.infer<typeof getArticleRequestSchema>;

export async function PUT(request: NextRequest) {
  let data = await request.json();
  try {
    getArticleRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }
  const { articleId } = data as GetArticleRequest;

  try {
    const [article] = await db
      .select({
        articleId: articleTable.displayId,
        articleContent: articleTable.articleContent,
        articleTitle: articleTable.articleTitle,
        articleCreatedDate: articleTable.articleCreatedDate,
        authorId: articleTable.authorId,
      })
      .from(articleTable)
      .where(eq(articleTable.displayId, articleId))
      .execute();

    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
