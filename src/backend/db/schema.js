const {
  pgTable,
  uuid,
  varchar,
  integer,
  jsonb,
  serial,
} = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  salary: integer("salary").notNull().default(0),
});

const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  remaining: integer("remaining").notNull(),
  expenses: jsonb("expenses"),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});

module.exports = {
  users,
  budgets,
};
