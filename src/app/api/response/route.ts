import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { responseTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const postResponseRequestSchema = z.object({
  articleId: z.string().uuid(),
  userId: z.string().uuid(),
  rate: z.number().int(),
  responseContent: z.string().max(200),
});

const getResponseRequestSchema = z.object({
  articleId: z.string().uuid(),
});

type PostResponseRequest = z.infer<typeof postResponseRequestSchema>;
type GetResponseRequest = z.infer<typeof getResponseRequestSchema>;

export async function POST(request: NextRequest) {
  let data = await request.json();

  try {
    postResponseRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { articleId, userId, rate, responseContent } =
    data as PostResponseRequest;

  try {
    await db.transaction(async (tx) => {
      const [createdResponse] = await tx
        .insert(responseTable)
        .values({
          articleId,
          userId,
          rate,
          responseContent,
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

export async function PUT(request: NextRequest) {
  let data = await request.json();

  try {
    getResponseRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { articleId } = data as GetResponseRequest;

  try {
    const articleResponse = await db
      .select()
      .from(responseTable)
      .where(eq(responseTable.articleId, articleId))
      .execute();
    return NextResponse.json({ articleResponse });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
