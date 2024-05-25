import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  mrtLikedTable,
  mrtStationTable,
  mrtStationLineTable,
} from "@/db/schema";

const likeMrtRequestSchema = z.object({
  userId: z.string().uuid(),
  mrtDisplayId: z.string().uuid(),
});

const usersLikedStationsRequestSchema = z.object({
  userId: z.string().uuid(),
});

type LikeMrtRequest = z.infer<typeof likeMrtRequestSchema>;
type usersLikedStationsRequest = z.infer<
  typeof usersLikedStationsRequestSchema
>;

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
      { status: 500 }
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
          eq(mrtLikedTable.mrtDisplayId, mrtDisplayId)
        )
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  return new NextResponse("OK", { status: 200 });
}

//因為不想寫get又想傳Body只好用put
export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    usersLikedStationsRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId } = data as usersLikedStationsRequest;

  try {
    const stations = await db
      .select({
        mrtDisplayId: mrtLikedTable.mrtDisplayId,
        mrtName: mrtStationTable.mrtName,
      })
      .from(mrtLikedTable)
      .leftJoin(
        mrtStationTable,
        eq(mrtLikedTable.mrtDisplayId, mrtStationTable.displayId)
      )
      .where(eq(mrtLikedTable.userId, userId))
      .execute();
    return NextResponse.json({ stations });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
