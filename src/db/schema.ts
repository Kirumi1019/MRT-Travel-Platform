import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    displayId: uuid("display_id").defaultRandom().notNull().unique().primaryKey(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }).notNull(),
    provider: varchar("provider", {
      length: 100,
      enum: ["google", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);
