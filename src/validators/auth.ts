import { z } from "zod";

export const authSchema = z.object({
  // Sign in doesn't require a username, but sign up does.
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});
