import { z } from "zod";

const privateEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  API_Username: z.string(),
  API_Password: z.string(),
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  API_Username: process.env.API_Username!,
  API_Password: process.env.API_Password!,
};

privateEnvSchema.parse(privateEnv);
