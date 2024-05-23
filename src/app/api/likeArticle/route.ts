import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleLikeTable } from "@/db/schema";

const postLikeArticleRequestSchema = z.object({
  articleId: z.string().uuid(),
  userId: z.string().uuid(),
});

type PostLikeArticleRequest = z.infer<typeof postLikeArticleRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();

  try {
    postLikeArticleRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { articleId, userId } = data as PostLikeArticleRequest;
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(articleLikeTable)
        .values({
          articleId: articleId,
          userId: userId,
        })
        .returning();
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("Ok", { status: 200 });
}
