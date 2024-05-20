// 事前檢查 在使用 next - AUTH 做 Sign In, Sign Up 之前
// 確保使用者的前端輸入的正確、是否已經有帳號了等等

import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const postUserInfoRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().max(100),
});

type PostInfoRequest = z.infer<typeof postUserInfoRequestSchema>;

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    postUserInfoRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { email,username } = data as PostInfoRequest;
  

    try{
      const [exsitedUser] = await db.select().from(usersTable)
      .where(and(eq(usersTable.email,email),
                eq(usersTable.username, username)))
      if(exsitedUser)
      {
        return NextResponse.json({ error: "Email Already Registered" }, { status: 400 });
      }

      
  } 
  catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}