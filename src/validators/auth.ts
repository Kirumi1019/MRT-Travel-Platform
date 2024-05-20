import { z } from "zod";

export const authSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  isSignIn: z.string({message: "isSignIn is string type"}),
});
