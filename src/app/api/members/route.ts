import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const postUserInfoRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().max(100),
  password: z.string().max(100).optional(),
  displayId: z.string().uuid(),
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

  const { email,username,password,displayId } = data as PostInfoRequest;

  const dbpassword = await db.select({dbpassword: usersTable.hashedPassword}).from(usersTable).where(eq(usersTable.displayId,displayId));

  let hashedPassword = password;

  if(password != dbpassword[0].dbpassword && password)
  {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  

    try{
    if(username && email)
    {
      await db.transaction(async (tx) => {
        await tx.update(usersTable)
        .set({
          email,
          username,
        })
        .where(eq(usersTable.displayId,displayId))
        .execute()
      });
    }
    if(password)
      {
        await db.transaction(async (tx) => {
          await tx.update(usersTable)
          .set({
            hashedPassword,
          })
          .where(eq(usersTable.displayId,displayId))
          .execute()
        });
      }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}