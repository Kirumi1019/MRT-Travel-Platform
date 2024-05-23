import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { mrtLikedTable } from "@/db/schema";

const likeMrtRequestSchema = z.object({
  userId: z.string().uuid(),
  mrtDisplayId: z.string().uuid(),
});

type LikeMrtRequest = z.infer<typeof likeMrtRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    likeMrtRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, mrtDisplayId } = data as LikeMrtRequest;

  try {
    await db
      .insert(mrtLikedTable)
      .values({
        userId,
        mrtDisplayId,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    likeMrtRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, mrtDisplayId } = data as LikeMrtRequest;

  try {
    await db
      .delete(mrtLikedTable)
      .where(
        and(
          eq(mrtLikedTable.userId, userId),
          eq(mrtLikedTable.mrtDisplayId, mrtDisplayId),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
