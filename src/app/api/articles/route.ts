import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleTable } from "@/db/schema";

const postArticleRequestSchema = z.object({
  authorId: z.string().uuid(),
  articleContent: z.string().max(500),
  articleTitle: z.string().max(100),
});

type PostArticleRequest = z.infer<typeof postArticleRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();

  try {
    postArticleRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { authorId, articleContent, articleTitle } = data as PostArticleRequest;
  let generatedId = "";
  try {
    await db.transaction(async (tx) => {
      const [createdArticle] = await tx
        .insert(articleTable)
        .values({
          authorId,
          articleContent,
          articleTitle,
        })
        .returning();
      generatedId = createdArticle.displayId;
    });
    return NextResponse.json({ generatedId }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const articleList = await db.select().from(articleTable);
    return NextResponse.json({ articleList }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
