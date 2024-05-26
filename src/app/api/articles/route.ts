import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { articleTable, articleMRTTable } from "@/db/schema";

const postArticleRequestSchema = z.object({
  authorId: z.string().uuid(),
  articleContent: z.string().max(500),
  articleTitle: z.string().max(100),
  mrtDisplayIds: z.string().array(),
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
  const { authorId, articleContent, articleTitle, mrtDisplayIds } =
    data as PostArticleRequest;
  
    if(!articleContent)
    {
      return NextResponse.json({error: "Empty Content not allowed"}, {status: 400});
    }
    if(!articleTitle)
    {
      return NextResponse.json({error: "Empty Title not allowed"}, {status: 400});
    }
    if(mrtDisplayIds.length === 0)
    {
      return NextResponse.json({error: "You need to choose at least one MRT Station"}, {status: 400}); 
    }

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
      for (let i = 0; i < mrtDisplayIds.length; i++) {
        const [createdArticleMrt] = await tx
          .insert(articleMRTTable)
          .values({
            articleId: createdArticle.displayId,
            mrtDisplayId: mrtDisplayIds[i],
          })
          .returning();
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("Ok", { status: 200 });
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
