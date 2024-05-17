// 事前檢查 在使用 next - AUTH 做 Sign In, Sign Up 之前
// 確保使用者的前端輸入的正確、是否已經有帳號了等等

import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const postUserInfoRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().max(100),
  password: z.string(),
});

type PostInfoRequest = z.infer<typeof postUserInfoRequestSchema>;

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    postUserInfoRequestSchema.parse(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid Registration. Check your Email or Username again" }, { status: 400 });
  }

  const { email,username, password } = data as PostInfoRequest;
  

    try{
      const [exsitedUser] = await db
      .select({
        username: usersTable.username,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.email,email))
      
      if(!exsitedUser)
      {
        return NextResponse.json({ error: "Email Not Registered" }, { status: 400 });
      }

      if(username != exsitedUser.username)
      {
        return NextResponse.json({ error: "Username Incorrect" }, { status: 400 });
      }

      const isValid = await bcrypt.compare(password, exsitedUser.hashedPassword);
      if(!isValid)
      {
        return NextResponse.json({ error: "Password Incorrect" }, { status: 400 });
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