// /app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ hello: true }, { status: 200 });
}