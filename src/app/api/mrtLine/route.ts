import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { mrtStationLineTable } from "@/db/schema";

export async function GET() {
  try {
    const LineList = await db.select().from(mrtStationLineTable);
    return NextResponse.json({ LineList });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
