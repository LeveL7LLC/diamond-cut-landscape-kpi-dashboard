import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, date, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Core Entity Tables
export const leadSources = pgTable("lead_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  value: text("value").notNull().unique(), // for filtering
  color: text("color").notNull(), // hex color code
  active: boolean("active").notNull().default(true),
});

export const csrs = pgTable("csrs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  value: text("value").notNull().unique(), // for filtering
  color: text("color").notNull(), // hex color code
  active: boolean("active").notNull().default(true),
});

export const salesReps = pgTable("sales_reps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  value: text("value").notNull().unique(), // for filtering
  color: text("color").notNull(), // hex color code
  active: boolean("active").notNull().default(true),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  value: text("value").notNull().unique(), // for filtering
  color: text("color").notNull(), // hex color code
  active: boolean("active").notNull().default(true),
});

// Time-Series Data Tables
export const dailyLeads = pgTable("daily_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  leadSourceId: varchar("lead_source_id").notNull().references(() => leadSources.id),
  count: integer("count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    dailyLeadsDateSourceIdx: index("daily_leads_date_source_idx").on(table.date, table.leadSourceId),
  };
});

export const dailyBookings = pgTable("daily_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  csrId: varchar("csr_id").notNull().references(() => csrs.id),
  leads: integer("leads").notNull().default(0),
  appointments: integer("appointments").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    dailyBookingsDateCsrIdx: index("daily_bookings_date_csr_idx").on(table.date, table.csrId),
  };
});

export const dailyCloses = pgTable("daily_closes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  salesRepId: varchar("sales_rep_id").notNull().references(() => salesReps.id),
  presented: integer("presented").notNull().default(0),
  signed: integer("signed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    dailyClosesDateRepIdx: index("daily_closes_date_rep_idx").on(table.date, table.salesRepId),
  };
});

export const dailyContracts = pgTable("daily_contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    dailyContractsDateServiceIdx: index("daily_contracts_date_service_idx").on(table.date, table.serviceId),
  };
});

export const monthlyFinance = pgTable("monthly_finance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  month: date("month").notNull(), // First day of the month
  grossProfitPercent: decimal("gross_profit_percent", { precision: 5, scale: 2 }).notNull(),
  netProfitPercent: decimal("net_profit_percent", { precision: 5, scale: 2 }).notNull(),
  revenue: decimal("revenue", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    monthlyFinanceMonthIdx: index("monthly_finance_month_idx").on(table.month),
  };
});

export const arAging = pgTable("ar_aging", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  asOf: date("as_of").notNull(),
  bucket030: decimal("bucket_0_30", { precision: 10, scale: 2 }).notNull().default('0'),
  bucket3160: decimal("bucket_31_60", { precision: 10, scale: 2 }).notNull().default('0'),
  bucket6190: decimal("bucket_61_90", { precision: 10, scale: 2 }).notNull().default('0'),
  bucket90plus: decimal("bucket_90_plus", { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    arAgingAsOfIdx: index("ar_aging_as_of_idx").on(table.asOf),
  };
});

export const marginVariance = pgTable("margin_variance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  jobName: text("job_name").notNull(),
  bidMargin: decimal("bid_margin", { precision: 5, scale: 2 }).notNull(),
  actualMargin: decimal("actual_margin", { precision: 5, scale: 2 }).notNull(),
  serviceId: varchar("service_id").references(() => services.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    marginVarianceDateIdx: index("margin_variance_date_idx").on(table.date),
  };
});

export const customerConcerns = pgTable("customer_concerns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  description: text("description").notNull(), // renamed from 'concern' to 'description' for clarity
  priority: text("priority").notNull().default('Med'), // Low, Med, High
  serviceId: varchar("service_id").references(() => services.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    customerConcernsDateIdx: index("customer_concerns_date_idx").on(table.date),
  };
});

// Goals and Targets
export const salesGoals = pgTable("sales_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  salesRepId: varchar("sales_rep_id").notNull().references(() => salesReps.id),
  period: date("period").notNull(), // Month or quarter
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  periodType: text("period_type").notNull().default('monthly'), // monthly, quarterly, annual
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    salesGoalsPeriodRepIdx: index("sales_goals_period_rep_idx").on(table.period, table.salesRepId),
  };
});

export const weeklyCapacity = pgTable("weekly_capacity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekStarting: date("week_starting").notNull(),
  availableHours: integer("available_hours").notNull(),
  bookedHours: integer("booked_hours").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    weeklyCapacityWeekIdx: index("weekly_capacity_week_idx").on(table.weekStarting),
  };
});

export const pipelineSnapshots = pgTable("pipeline_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  stage: text("stage").notNull(), // e.g., "leads", "qualified", "quoted", "closed"
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    pipelineSnapshotsDateIdx: index("pipeline_snapshots_date_idx").on(table.date),
    pipelineSnapshotsDateStageIdx: index("pipeline_snapshots_date_stage_idx").on(table.date, table.stage),
  };
});

// Revenue tracking
export const monthlyRevenue = pgTable("monthly_revenue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  month: date("month").notNull(), // First day of the month
  goalAmount: decimal("goal_amount", { precision: 12, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 12, scale: 2 }).notNull().default('0'),
  salesRepId: varchar("sales_rep_id").references(() => salesReps.id), // NULL for company total
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    monthlyRevenueMonthIdx: index("monthly_revenue_month_idx").on(table.month),
    monthlyRevenueMonthRepIdx: index("monthly_revenue_month_rep_idx").on(table.month, table.salesRepId),
  };
});

export const annualRevenue = pgTable("annual_revenue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  goalAmount: decimal("goal_amount", { precision: 12, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 12, scale: 2 }).notNull().default('0'),
  salesRepId: varchar("sales_rep_id").references(() => salesReps.id), // NULL for company total
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => {
  return {
    annualRevenueYearIdx: index("annual_revenue_year_idx").on(table.year),
    annualRevenueYearRepIdx: index("annual_revenue_year_rep_idx").on(table.year, table.salesRepId),
  };
});

// Relations
export const leadSourcesRelations = relations(leadSources, ({ many }) => ({
  dailyLeads: many(dailyLeads),
}));

export const csrsRelations = relations(csrs, ({ many }) => ({
  dailyBookings: many(dailyBookings),
}));

export const salesRepsRelations = relations(salesReps, ({ many }) => ({
  dailyCloses: many(dailyCloses),
  salesGoals: many(salesGoals),
  monthlyRevenue: many(monthlyRevenue),
  annualRevenue: many(annualRevenue),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  dailyContracts: many(dailyContracts),
  marginVariance: many(marginVariance),
}));

export const dailyLeadsRelations = relations(dailyLeads, ({ one }) => ({
  leadSource: one(leadSources, {
    fields: [dailyLeads.leadSourceId],
    references: [leadSources.id],
  }),
}));

export const dailyBookingsRelations = relations(dailyBookings, ({ one }) => ({
  csr: one(csrs, {
    fields: [dailyBookings.csrId],
    references: [csrs.id],
  }),
}));

export const dailyClosesRelations = relations(dailyCloses, ({ one }) => ({
  salesRep: one(salesReps, {
    fields: [dailyCloses.salesRepId],
    references: [salesReps.id],
  }),
}));

export const dailyContractsRelations = relations(dailyContracts, ({ one }) => ({
  service: one(services, {
    fields: [dailyContracts.serviceId],
    references: [services.id],
  }),
}));

export const salesGoalsRelations = relations(salesGoals, ({ one }) => ({
  salesRep: one(salesReps, {
    fields: [salesGoals.salesRepId],
    references: [salesReps.id],
  }),
}));

export const monthlyRevenueRelations = relations(monthlyRevenue, ({ one }) => ({
  salesRep: one(salesReps, {
    fields: [monthlyRevenue.salesRepId],
    references: [salesReps.id],
  }),
}));

export const annualRevenueRelations = relations(annualRevenue, ({ one }) => ({
  salesRep: one(salesReps, {
    fields: [annualRevenue.salesRepId],
    references: [salesReps.id],
  }),
}));

// Insert schemas for forms
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSourceSchema = createInsertSchema(leadSources).omit({ id: true });
export const insertCsrSchema = createInsertSchema(csrs).omit({ id: true });
export const insertSalesRepSchema = createInsertSchema(salesReps).omit({ id: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertDailyLeadsSchema = createInsertSchema(dailyLeads).omit({ id: true, createdAt: true });
export const insertDailyBookingsSchema = createInsertSchema(dailyBookings).omit({ id: true, createdAt: true });
export const insertDailyClosesSchema = createInsertSchema(dailyCloses).omit({ id: true, createdAt: true });
export const insertDailyContractsSchema = createInsertSchema(dailyContracts).omit({ id: true, createdAt: true });
export const insertMonthlyFinanceSchema = createInsertSchema(monthlyFinance).omit({ id: true, createdAt: true });
export const insertArAgingSchema = createInsertSchema(arAging).omit({ id: true, createdAt: true });
export const insertMarginVarianceSchema = createInsertSchema(marginVariance).omit({ id: true, createdAt: true });
export const insertCustomerConcernsSchema = createInsertSchema(customerConcerns).omit({ id: true, createdAt: true });
export const insertSalesGoalsSchema = createInsertSchema(salesGoals).omit({ id: true, createdAt: true });
export const insertWeeklyCapacitySchema = createInsertSchema(weeklyCapacity).omit({ id: true, createdAt: true });
export const insertPipelineSnapshotsSchema = createInsertSchema(pipelineSnapshots).omit({ id: true, createdAt: true });
export const insertMonthlyRevenueSchema = createInsertSchema(monthlyRevenue).omit({ id: true, createdAt: true });
export const insertAnnualRevenueSchema = createInsertSchema(annualRevenue).omit({ id: true, createdAt: true });

// Infer types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LeadSource = typeof leadSources.$inferSelect;
export type InsertLeadSource = z.infer<typeof insertLeadSourceSchema>;
export type Csr = typeof csrs.$inferSelect;
export type InsertCsr = z.infer<typeof insertCsrSchema>;
export type SalesRep = typeof salesReps.$inferSelect;
export type InsertSalesRep = z.infer<typeof insertSalesRepSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type DailyLeads = typeof dailyLeads.$inferSelect;
export type InsertDailyLeads = z.infer<typeof insertDailyLeadsSchema>;
export type DailyBookings = typeof dailyBookings.$inferSelect;
export type InsertDailyBookings = z.infer<typeof insertDailyBookingsSchema>;
export type DailyCloses = typeof dailyCloses.$inferSelect;
export type InsertDailyCloses = z.infer<typeof insertDailyClosesSchema>;
export type DailyContracts = typeof dailyContracts.$inferSelect;
export type InsertDailyContracts = z.infer<typeof insertDailyContractsSchema>;
export type MonthlyFinance = typeof monthlyFinance.$inferSelect;
export type InsertMonthlyFinance = z.infer<typeof insertMonthlyFinanceSchema>;
export type ArAging = typeof arAging.$inferSelect;
export type InsertArAging = z.infer<typeof insertArAgingSchema>;
export type MarginVariance = typeof marginVariance.$inferSelect;
export type InsertMarginVariance = z.infer<typeof insertMarginVarianceSchema>;
export type CustomerConcerns = typeof customerConcerns.$inferSelect;
export type InsertCustomerConcerns = z.infer<typeof insertCustomerConcernsSchema>;
export type SalesGoals = typeof salesGoals.$inferSelect;
export type InsertSalesGoals = z.infer<typeof insertSalesGoalsSchema>;
export type WeeklyCapacity = typeof weeklyCapacity.$inferSelect;
export type InsertWeeklyCapacity = z.infer<typeof insertWeeklyCapacitySchema>;
export type PipelineSnapshots = typeof pipelineSnapshots.$inferSelect;
export type InsertPipelineSnapshots = z.infer<typeof insertPipelineSnapshotsSchema>;
export type MonthlyRevenue = typeof monthlyRevenue.$inferSelect;
export type InsertMonthlyRevenue = z.infer<typeof insertMonthlyRevenueSchema>;
export type AnnualRevenue = typeof annualRevenue.$inferSelect;
export type InsertAnnualRevenue = z.infer<typeof insertAnnualRevenueSchema>;
