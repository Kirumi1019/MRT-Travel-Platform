import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { mrtStationIDTable } from "@/db/schema";

export async function GET() {
  try {
    const PairList = await db.select().from(mrtStationIDTable);
    return NextResponse.json({ PairList });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
