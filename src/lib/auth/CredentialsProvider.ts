import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq, is } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

// This is where SignIn refrenced in AuthForm
export default CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    username: { label: "Userame", type: "text" },
    password: { label: "Password", type: "password" },
    isSignIn: {label: "SignInBoolean", type: "text"}
  },
  async authorize(credentials) {
    let validatedCredentials: {
      email: string;
      username: string;
      password: string;
      isSignIn: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log(credentials);
      console.log(error)
      console.log("Wrong credentials. Try again.");
      return null;
    }
    const { email, username, password, isSignIn } = validatedCredentials;
    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        username: usersTable.username,
        email: usersTable.email,
        provider: usersTable.provider,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedCredentials.email.toLowerCase()))
      .execute();
    if (!existedUser && isSignIn == 'false' ) {
      // Sign up
      if (!username || !email || !password) {
        console.log("Name is required.");
        return null;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [createdUser] = await db
        .insert(usersTable)
        .values({
          username,
          email: email.toLowerCase(),
          hashedPassword,
          provider: "credentials",
        })
        .returning();
      return {
        email: createdUser.email,
        name: createdUser.username,
        id: createdUser.displayId,
      };
    }

    // Sign in
    if (existedUser.provider !== "credentials") {
      console.log(`The email has registered with ${existedUser.provider}.`);
      return null;
    }
    if (!existedUser.hashedPassword) {
      console.log("The email has registered with social account.");
      return null;
    }

    const isValid = await bcrypt.compare(password, existedUser.hashedPassword);
    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      email: existedUser.email,
      name: existedUser.username,
      id: existedUser.id,
    };
  },
});
