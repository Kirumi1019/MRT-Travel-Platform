import { index, pgTable, timestamp, uuid, varchar, primaryKey, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
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
    displayIdIndex: index("userId_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);

export const articleTable = pgTable(
  "articles",
  {
    displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
    authorId: uuid("author_id").notNull().references(()=>usersTable.displayId,{
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    articleContent: varchar("article_content", {length: 500}).notNull(),
    articleTitle: varchar("article_title", {length: 100}).notNull(),
    mrtStation: varchar("mrt_station", {length: 20}).notNull(),
    articleCreatedDate: timestamp("article_created_date").defaultNow().notNull(),
  },
  (table) => ({
    displayIdIndex: index("articleId_index").on(table.displayId),
  })
)

export const responseTable = pgTable(
  "article_response",
  {
    displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
    articleId: uuid("article_id").notNull().references(()=>articleTable.displayId,{
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    userId: uuid("user_id").notNull().references(()=>usersTable.displayId,{
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    rate: integer("article_rate").notNull(),
    responseContent: varchar("response_content", {length: 200}),
    responseCreatedDate: timestamp("response_created_date").defaultNow().notNull(),
  }
)

export const articleLikeTable = pgTable(
  "article_liked",
  {
    articleId: uuid("article_id").notNull().references(()=>articleTable.displayId,{
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    userId: uuid("user_id").notNull().references(()=>usersTable.displayId,{
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.userId] }),  
  })
)

export const mrtStationTable = pgTable(
  "mrt_station",
  {
    displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
    mrtId: varchar("mrt_id",{length: 10}).notNull().unique(),
    mrtName: varchar("mrt_name",{length: 15}).notNull().unique(),
  }
)

export const mrtLikedTable = pgTable(
  "mrt_liked",
  {
    userId: uuid("user_id").notNull().references(()=>
      usersTable.displayId,{
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    mrtStation: varchar("mrt_station", {length: 20}).notNull()
    .references(()=>
      mrtStationTable.mrtName,{
        onDelete: "cascade",
        onUpdate: "cascade",
      }
    ),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mrtStation, table.userId] }),  
  })
)

