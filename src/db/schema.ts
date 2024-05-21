import {
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

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
  })
);

export const articleTable = pgTable(
  "articles",
  {
    displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    articleContent: varchar("article_content", { length: 500 }).notNull(),
    articleTitle: varchar("article_title", { length: 100 }).notNull(),
    articleCreatedDate: timestamp("article_created_date")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    displayIdIndex: index("articleId_index").on(table.displayId),
  })
);

export const articleMRTTable = pgTable(
  "article_mrt",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articleTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    mrtDisplayId: uuid("mrt_display_id")
      .notNull()
      .references(() => mrtStationTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.mrtDisplayId] }),
  })
);

export const responseTable = pgTable("article_response", {
  displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
  articleId: uuid("article_id")
    .notNull()
    .references(() => articleTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  rate: integer("article_rate").notNull(),
  responseContent: varchar("response_content", { length: 200 }),
  responseCreatedDate: timestamp("response_created_date")
    .defaultNow()
    .notNull(),
});

export const articleLikeTable = pgTable(
  "article_liked",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articleTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.userId] }),
  })
);

export const mrtStationTable = pgTable("mrt_station", {
  displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
  mrtName: varchar("mrt_name", { length: 15 }).notNull().unique(),
});

// 捷運線車站代號、對應的捷運線
export const mrtStationIDTable = pgTable("mrt_station_id", {
  mrtStationId: varchar("mrt_station_id", { length: 10 })
    .notNull()
    .unique()
    .primaryKey(),
  lineId: uuid("line_id")
    .notNull()
    .references(() => mrtStationLineTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  mrtDisplayId: uuid("mrt_id")
    .notNull()
    .references(() => mrtStationTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

// 捷運線名字
export const mrtStationLineTable = pgTable("mrt_station_line", {
  displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
  lineName: varchar("line_name", { length: 10 }).notNull().unique(),
});

export const mrtLikedTable = pgTable(
  "mrt_liked",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    mrtDisplayId: uuid("mrt_id")
      .notNull()
      .references(() => mrtStationTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mrtDisplayId, table.userId] }),
  })
);
