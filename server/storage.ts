import { 
  type User, type InsertUser,
  type LeadSource, type InsertLeadSource,
  type Csr, type InsertCsr,
  type SalesRep, type InsertSalesRep,
  type Service, type InsertService,
  type DailyLeads, type InsertDailyLeads,
  type DailyBookings, type InsertDailyBookings,
  type DailyCloses, type InsertDailyCloses,
  type DailyContracts, type InsertDailyContracts,
  type MonthlyFinance, type InsertMonthlyFinance,
  type ArAging, type InsertArAging,
  type MarginVariance, type InsertMarginVariance,
  type CustomerConcerns, type InsertCustomerConcerns,
  type SalesGoals, type InsertSalesGoals,
  type WeeklyCapacity, type InsertWeeklyCapacity,
  type PipelineSnapshots, type InsertPipelineSnapshots,
  type MonthlyRevenue, type InsertMonthlyRevenue,
  type AnnualRevenue, type InsertAnnualRevenue
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Lead Sources
  getLeadSources(): Promise<LeadSource[]>;
  getLeadSource(id: string): Promise<LeadSource | undefined>;
  createLeadSource(leadSource: InsertLeadSource): Promise<LeadSource>;
  updateLeadSource(id: string, leadSource: Partial<InsertLeadSource>): Promise<LeadSource | undefined>;
  deleteLeadSource(id: string): Promise<boolean>;

  // CSRs
  getCsrs(): Promise<Csr[]>;
  getCsr(id: string): Promise<Csr | undefined>;
  createCsr(csr: InsertCsr): Promise<Csr>;
  updateCsr(id: string, csr: Partial<InsertCsr>): Promise<Csr | undefined>;
  deleteCsr(id: string): Promise<boolean>;

  // Sales Representatives
  getSalesReps(): Promise<SalesRep[]>;
  getSalesRep(id: string): Promise<SalesRep | undefined>;
  createSalesRep(salesRep: InsertSalesRep): Promise<SalesRep>;
  updateSalesRep(id: string, salesRep: Partial<InsertSalesRep>): Promise<SalesRep | undefined>;
  deleteSalesRep(id: string): Promise<boolean>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Daily Leads
  getDailyLeads(): Promise<DailyLeads[]>;
  getDailyLeadsInRange(startDate: string, endDate: string): Promise<DailyLeads[]>;
  createDailyLeads(dailyLeads: InsertDailyLeads): Promise<DailyLeads>;
  updateDailyLeads(id: string, dailyLeads: Partial<InsertDailyLeads>): Promise<DailyLeads | undefined>;
  deleteDailyLeads(id: string): Promise<boolean>;

  // Daily Bookings
  getDailyBookings(): Promise<DailyBookings[]>;
  getDailyBookingsInRange(startDate: string, endDate: string): Promise<DailyBookings[]>;
  createDailyBookings(dailyBookings: InsertDailyBookings): Promise<DailyBookings>;
  updateDailyBookings(id: string, dailyBookings: Partial<InsertDailyBookings>): Promise<DailyBookings | undefined>;
  deleteDailyBookings(id: string): Promise<boolean>;

  // Daily Closes
  getDailyCloses(): Promise<DailyCloses[]>;
  getDailyClosesInRange(startDate: string, endDate: string): Promise<DailyCloses[]>;
  createDailyCloses(dailyCloses: InsertDailyCloses): Promise<DailyCloses>;
  updateDailyCloses(id: string, dailyCloses: Partial<InsertDailyCloses>): Promise<DailyCloses | undefined>;
  deleteDailyCloses(id: string): Promise<boolean>;

  // Daily Contracts
  getDailyContracts(): Promise<DailyContracts[]>;
  getDailyContractsInRange(startDate: string, endDate: string): Promise<DailyContracts[]>;
  createDailyContracts(dailyContracts: InsertDailyContracts): Promise<DailyContracts>;
  updateDailyContracts(id: string, dailyContracts: Partial<InsertDailyContracts>): Promise<DailyContracts | undefined>;
  deleteDailyContracts(id: string): Promise<boolean>;

  // Pipeline Snapshots
  getPipelineSnapshots(): Promise<PipelineSnapshots[]>;
  getPipelineSnapshotsInRange(startDate: string, endDate: string): Promise<PipelineSnapshots[]>;
  createPipelineSnapshots(pipelineSnapshots: InsertPipelineSnapshots): Promise<PipelineSnapshots>;
  updatePipelineSnapshots(id: string, pipelineSnapshots: Partial<InsertPipelineSnapshots>): Promise<PipelineSnapshots | undefined>;
  deletePipelineSnapshots(id: string): Promise<boolean>;

  // Monthly Finance
  getMonthlyFinance(): Promise<MonthlyFinance[]>;
  createMonthlyFinance(monthlyFinance: InsertMonthlyFinance): Promise<MonthlyFinance>;
  updateMonthlyFinance(id: string, monthlyFinance: Partial<InsertMonthlyFinance>): Promise<MonthlyFinance | undefined>;
  deleteMonthlyFinance(id: string): Promise<boolean>;

  // AR Aging
  getArAging(): Promise<ArAging[]>;
  getLatestArAging(): Promise<ArAging | undefined>;
  createArAging(arAging: InsertArAging): Promise<ArAging>;
  updateArAging(id: string, arAging: Partial<InsertArAging>): Promise<ArAging | undefined>;
  deleteArAging(id: string): Promise<boolean>;

  // Margin Variance
  getMarginVariance(): Promise<MarginVariance[]>;
  getMarginVarianceInRange(startDate: string, endDate: string): Promise<MarginVariance[]>;
  createMarginVariance(marginVariance: InsertMarginVariance): Promise<MarginVariance>;
  updateMarginVariance(id: string, marginVariance: Partial<InsertMarginVariance>): Promise<MarginVariance | undefined>;
  deleteMarginVariance(id: string): Promise<boolean>;

  // Customer Concerns
  getCustomerConcerns(): Promise<CustomerConcerns[]>;
  getOpenCustomerConcerns(): Promise<CustomerConcerns[]>;
  createCustomerConcerns(customerConcerns: InsertCustomerConcerns): Promise<CustomerConcerns>;
  updateCustomerConcerns(id: string, customerConcerns: Partial<InsertCustomerConcerns>): Promise<CustomerConcerns | undefined>;
  deleteCustomerConcerns(id: string): Promise<boolean>;

  // Sales Goals
  getSalesGoals(): Promise<SalesGoals[]>;
  getSalesGoalsByPeriod(period: string): Promise<SalesGoals[]>;
  createSalesGoals(salesGoals: InsertSalesGoals): Promise<SalesGoals>;
  updateSalesGoals(id: string, salesGoals: Partial<InsertSalesGoals>): Promise<SalesGoals | undefined>;
  deleteSalesGoals(id: string): Promise<boolean>;

  // Weekly Capacity
  getWeeklyCapacity(): Promise<WeeklyCapacity[]>;
  getWeeklyCapacityInRange(startDate: string, endDate: string): Promise<WeeklyCapacity[]>;
  createWeeklyCapacity(weeklyCapacity: InsertWeeklyCapacity): Promise<WeeklyCapacity>;
  updateWeeklyCapacity(id: string, weeklyCapacity: Partial<InsertWeeklyCapacity>): Promise<WeeklyCapacity | undefined>;
  deleteWeeklyCapacity(id: string): Promise<boolean>;

  // Monthly Revenue
  getMonthlyRevenue(): Promise<MonthlyRevenue[]>;
  getMonthlyRevenueByPeriod(month: string): Promise<MonthlyRevenue[]>;
  createMonthlyRevenue(monthlyRevenue: InsertMonthlyRevenue): Promise<MonthlyRevenue>;
  updateMonthlyRevenue(id: string, monthlyRevenue: Partial<InsertMonthlyRevenue>): Promise<MonthlyRevenue | undefined>;
  deleteMonthlyRevenue(id: string): Promise<boolean>;

  // Annual Revenue
  getAnnualRevenue(): Promise<AnnualRevenue[]>;
  getAnnualRevenueByYear(year: number): Promise<AnnualRevenue[]>;
  createAnnualRevenue(annualRevenue: InsertAnnualRevenue): Promise<AnnualRevenue>;
  updateAnnualRevenue(id: string, annualRevenue: Partial<InsertAnnualRevenue>): Promise<AnnualRevenue | undefined>;
  deleteAnnualRevenue(id: string): Promise<boolean>;

  // Global Search
  globalSearch(searchTerm: string): Promise<any[]>;
}

import { db } from './db';
import { 
  users, leadSources, csrs, salesReps, services,
  dailyLeads, dailyBookings, dailyCloses, dailyContracts,
  monthlyFinance, arAging, marginVariance, customerConcerns,
  salesGoals, weeklyCapacity, pipelineSnapshots,
  monthlyRevenue, annualRevenue
} from '@shared/schema';
import { eq, and, gte, lte, desc, or, ilike } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Lead Sources
  async getLeadSources(): Promise<LeadSource[]> {
    return await db.select().from(leadSources).where(eq(leadSources.active, true));
  }

  async getLeadSource(id: string): Promise<LeadSource | undefined> {
    const [leadSource] = await db.select().from(leadSources).where(eq(leadSources.id, id));
    return leadSource || undefined;
  }

  async createLeadSource(insertLeadSource: InsertLeadSource): Promise<LeadSource> {
    const [leadSource] = await db.insert(leadSources).values(insertLeadSource).returning();
    return leadSource;
  }

  async updateLeadSource(id: string, updateData: Partial<InsertLeadSource>): Promise<LeadSource | undefined> {
    const [leadSource] = await db.update(leadSources).set(updateData).where(eq(leadSources.id, id)).returning();
    return leadSource || undefined;
  }

  async deleteLeadSource(id: string): Promise<boolean> {
    const result = await db.update(leadSources).set({ active: false }).where(eq(leadSources.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // CSRs
  async getCsrs(): Promise<Csr[]> {
    return await db.select().from(csrs).where(eq(csrs.active, true));
  }

  async getCsr(id: string): Promise<Csr | undefined> {
    const [csr] = await db.select().from(csrs).where(eq(csrs.id, id));
    return csr || undefined;
  }

  async createCsr(insertCsr: InsertCsr): Promise<Csr> {
    const [csr] = await db.insert(csrs).values(insertCsr).returning();
    return csr;
  }

  async updateCsr(id: string, updateData: Partial<InsertCsr>): Promise<Csr | undefined> {
    const [csr] = await db.update(csrs).set(updateData).where(eq(csrs.id, id)).returning();
    return csr || undefined;
  }

  async deleteCsr(id: string): Promise<boolean> {
    const result = await db.update(csrs).set({ active: false }).where(eq(csrs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Sales Representatives
  async getSalesReps(): Promise<SalesRep[]> {
    return await db.select().from(salesReps).where(eq(salesReps.active, true));
  }

  async getSalesRep(id: string): Promise<SalesRep | undefined> {
    const [salesRep] = await db.select().from(salesReps).where(eq(salesReps.id, id));
    return salesRep || undefined;
  }

  async createSalesRep(insertSalesRep: InsertSalesRep): Promise<SalesRep> {
    const [salesRep] = await db.insert(salesReps).values(insertSalesRep).returning();
    return salesRep;
  }

  async updateSalesRep(id: string, updateData: Partial<InsertSalesRep>): Promise<SalesRep | undefined> {
    const [salesRep] = await db.update(salesReps).set(updateData).where(eq(salesReps.id, id)).returning();
    return salesRep || undefined;
  }

  async deleteSalesRep(id: string): Promise<boolean> {
    const result = await db.update(salesReps).set({ active: false }).where(eq(salesReps.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.active, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: string, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db.update(services).set(updateData).where(eq(services.id, id)).returning();
    return service || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.update(services).set({ active: false }).where(eq(services.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Daily Leads
  async getDailyLeads(): Promise<DailyLeads[]> {
    return await db.select().from(dailyLeads).orderBy(desc(dailyLeads.date));
  }

  async getDailyLeadsInRange(startDate: string, endDate: string): Promise<DailyLeads[]> {
    return await db.select().from(dailyLeads)
      .where(and(gte(dailyLeads.date, startDate), lte(dailyLeads.date, endDate)))
      .orderBy(desc(dailyLeads.date));
  }

  async createDailyLeads(insertDailyLeads: InsertDailyLeads): Promise<DailyLeads> {
    const [record] = await db.insert(dailyLeads).values(insertDailyLeads).returning();
    return record;
  }

  async updateDailyLeads(id: string, updateData: Partial<InsertDailyLeads>): Promise<DailyLeads | undefined> {
    const [record] = await db.update(dailyLeads).set(updateData).where(eq(dailyLeads.id, id)).returning();
    return record || undefined;
  }

  async deleteDailyLeads(id: string): Promise<boolean> {
    const result = await db.delete(dailyLeads).where(eq(dailyLeads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Daily Bookings
  async getDailyBookings(): Promise<DailyBookings[]> {
    return await db.select().from(dailyBookings).orderBy(desc(dailyBookings.date));
  }

  async getDailyBookingsInRange(startDate: string, endDate: string): Promise<DailyBookings[]> {
    return await db.select().from(dailyBookings)
      .where(and(gte(dailyBookings.date, startDate), lte(dailyBookings.date, endDate)))
      .orderBy(desc(dailyBookings.date));
  }

  async createDailyBookings(insertDailyBookings: InsertDailyBookings): Promise<DailyBookings> {
    const [record] = await db.insert(dailyBookings).values(insertDailyBookings).returning();
    return record;
  }

  async updateDailyBookings(id: string, updateData: Partial<InsertDailyBookings>): Promise<DailyBookings | undefined> {
    const [record] = await db.update(dailyBookings).set(updateData).where(eq(dailyBookings.id, id)).returning();
    return record || undefined;
  }

  async deleteDailyBookings(id: string): Promise<boolean> {
    const result = await db.delete(dailyBookings).where(eq(dailyBookings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Daily Closes
  async getDailyCloses(): Promise<DailyCloses[]> {
    return await db.select().from(dailyCloses).orderBy(desc(dailyCloses.date));
  }

  async getDailyClosesInRange(startDate: string, endDate: string): Promise<DailyCloses[]> {
    return await db.select().from(dailyCloses)
      .where(and(gte(dailyCloses.date, startDate), lte(dailyCloses.date, endDate)))
      .orderBy(desc(dailyCloses.date));
  }

  async createDailyCloses(insertDailyCloses: InsertDailyCloses): Promise<DailyCloses> {
    const [record] = await db.insert(dailyCloses).values(insertDailyCloses).returning();
    return record;
  }

  async updateDailyCloses(id: string, updateData: Partial<InsertDailyCloses>): Promise<DailyCloses | undefined> {
    const [record] = await db.update(dailyCloses).set(updateData).where(eq(dailyCloses.id, id)).returning();
    return record || undefined;
  }

  async deleteDailyCloses(id: string): Promise<boolean> {
    const result = await db.delete(dailyCloses).where(eq(dailyCloses.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Daily Contracts
  async getDailyContracts(): Promise<DailyContracts[]> {
    return await db.select().from(dailyContracts).orderBy(desc(dailyContracts.date));
  }

  async getDailyContractsInRange(startDate: string, endDate: string): Promise<DailyContracts[]> {
    return await db.select().from(dailyContracts)
      .where(and(gte(dailyContracts.date, startDate), lte(dailyContracts.date, endDate)))
      .orderBy(desc(dailyContracts.date));
  }

  async createDailyContracts(insertDailyContracts: InsertDailyContracts): Promise<DailyContracts> {
    const [record] = await db.insert(dailyContracts).values(insertDailyContracts).returning();
    return record;
  }

  async updateDailyContracts(id: string, updateData: Partial<InsertDailyContracts>): Promise<DailyContracts | undefined> {
    const [record] = await db.update(dailyContracts).set(updateData).where(eq(dailyContracts.id, id)).returning();
    return record || undefined;
  }

  async deleteDailyContracts(id: string): Promise<boolean> {
    const result = await db.delete(dailyContracts).where(eq(dailyContracts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Pipeline Snapshots
  async getPipelineSnapshots(): Promise<PipelineSnapshots[]> {
    return await db.select().from(pipelineSnapshots).orderBy(desc(pipelineSnapshots.date));
  }

  async getPipelineSnapshotsInRange(startDate: string, endDate: string): Promise<PipelineSnapshots[]> {
    return await db.select().from(pipelineSnapshots)
      .where(and(gte(pipelineSnapshots.date, startDate), lte(pipelineSnapshots.date, endDate)))
      .orderBy(desc(pipelineSnapshots.date));
  }

  async createPipelineSnapshots(insertPipelineSnapshots: InsertPipelineSnapshots): Promise<PipelineSnapshots> {
    const [record] = await db.insert(pipelineSnapshots).values(insertPipelineSnapshots).returning();
    return record;
  }

  async updatePipelineSnapshots(id: string, updateData: Partial<InsertPipelineSnapshots>): Promise<PipelineSnapshots | undefined> {
    const [record] = await db.update(pipelineSnapshots).set(updateData).where(eq(pipelineSnapshots.id, id)).returning();
    return record || undefined;
  }

  async deletePipelineSnapshots(id: string): Promise<boolean> {
    const result = await db.delete(pipelineSnapshots).where(eq(pipelineSnapshots.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Continue with remaining methods...
  // (I'll implement the rest in the next part to keep this manageable)
  
  // Monthly Finance operations
  async getMonthlyFinance(): Promise<MonthlyFinance[]> {
    return await db.select().from(monthlyFinance).orderBy(desc(monthlyFinance.month));
  }

  async createMonthlyFinance(insertMonthlyFinance: InsertMonthlyFinance): Promise<MonthlyFinance> {
    const [finance] = await db.insert(monthlyFinance).values(insertMonthlyFinance).returning();
    return finance;
  }

  async updateMonthlyFinance(id: string, updateData: Partial<InsertMonthlyFinance>): Promise<MonthlyFinance | undefined> {
    const [finance] = await db.update(monthlyFinance).set(updateData).where(eq(monthlyFinance.id, id)).returning();
    return finance || undefined;
  }

  async deleteMonthlyFinance(id: string): Promise<boolean> {
    const result = await db.delete(monthlyFinance).where(eq(monthlyFinance.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // AR Aging operations
  async getArAging(): Promise<ArAging[]> {
    return await db.select().from(arAging).orderBy(desc(arAging.asOf));
  }

  async getLatestArAging(): Promise<ArAging | undefined> {
    const [latest] = await db.select().from(arAging).orderBy(desc(arAging.asOf)).limit(1);
    return latest || undefined;
  }

  async createArAging(insertArAging: InsertArAging): Promise<ArAging> {
    const [aging] = await db.insert(arAging).values(insertArAging).returning();
    return aging;
  }

  async updateArAging(id: string, updateData: Partial<InsertArAging>): Promise<ArAging | undefined> {
    const [aging] = await db.update(arAging).set(updateData).where(eq(arAging.id, id)).returning();
    return aging || undefined;
  }

  async deleteArAging(id: string): Promise<boolean> {
    const result = await db.delete(arAging).where(eq(arAging.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Margin Variance operations
  async getMarginVariance(): Promise<MarginVariance[]> {
    return await db.select().from(marginVariance).orderBy(desc(marginVariance.date));
  }

  async getMarginVarianceInRange(startDate: string, endDate: string): Promise<MarginVariance[]> {
    return await db.select().from(marginVariance)
      .where(and(gte(marginVariance.date, startDate), lte(marginVariance.date, endDate)))
      .orderBy(desc(marginVariance.date));
  }

  async createMarginVariance(insertMarginVariance: InsertMarginVariance): Promise<MarginVariance> {
    const [variance] = await db.insert(marginVariance).values(insertMarginVariance).returning();
    return variance;
  }

  async updateMarginVariance(id: string, updateData: Partial<InsertMarginVariance>): Promise<MarginVariance | undefined> {
    const [variance] = await db.update(marginVariance).set(updateData).where(eq(marginVariance.id, id)).returning();
    return variance || undefined;
  }

  async deleteMarginVariance(id: string): Promise<boolean> {
    const result = await db.delete(marginVariance).where(eq(marginVariance.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Customer Concerns operations
  async getCustomerConcerns(): Promise<CustomerConcerns[]> {
    return await db.select().from(customerConcerns).orderBy(desc(customerConcerns.date));
  }

  async getOpenCustomerConcerns(): Promise<CustomerConcerns[]> {
    return await db.select().from(customerConcerns)
      .where(eq(customerConcerns.priority, 'High'))
      .orderBy(desc(customerConcerns.date));
  }

  async createCustomerConcerns(insertCustomerConcerns: InsertCustomerConcerns): Promise<CustomerConcerns> {
    const [concern] = await db.insert(customerConcerns).values(insertCustomerConcerns).returning();
    return concern;
  }

  async updateCustomerConcerns(id: string, updateData: Partial<InsertCustomerConcerns>): Promise<CustomerConcerns | undefined> {
    const [concern] = await db.update(customerConcerns).set(updateData).where(eq(customerConcerns.id, id)).returning();
    return concern || undefined;
  }

  async deleteCustomerConcerns(id: string): Promise<boolean> {
    const result = await db.delete(customerConcerns).where(eq(customerConcerns.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Sales Goals operations
  async getSalesGoals(): Promise<SalesGoals[]> {
    return await db.select().from(salesGoals).orderBy(desc(salesGoals.period));
  }

  async getSalesGoalsByPeriod(period: string): Promise<SalesGoals[]> {
    return await db.select().from(salesGoals)
      .where(eq(salesGoals.period, period))
      .orderBy(desc(salesGoals.period));
  }

  async createSalesGoals(insertSalesGoals: InsertSalesGoals): Promise<SalesGoals> {
    const [goal] = await db.insert(salesGoals).values(insertSalesGoals).returning();
    return goal;
  }

  async updateSalesGoals(id: string, updateData: Partial<InsertSalesGoals>): Promise<SalesGoals | undefined> {
    const [goal] = await db.update(salesGoals).set(updateData).where(eq(salesGoals.id, id)).returning();
    return goal || undefined;
  }

  async deleteSalesGoals(id: string): Promise<boolean> {
    const result = await db.delete(salesGoals).where(eq(salesGoals.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Weekly Capacity operations
  async getWeeklyCapacity(): Promise<WeeklyCapacity[]> {
    return await db.select().from(weeklyCapacity).orderBy(desc(weeklyCapacity.weekStarting));
  }

  async getWeeklyCapacityInRange(startDate: string, endDate: string): Promise<WeeklyCapacity[]> {
    return await db.select().from(weeklyCapacity)
      .where(and(gte(weeklyCapacity.weekStarting, startDate), lte(weeklyCapacity.weekStarting, endDate)))
      .orderBy(desc(weeklyCapacity.weekStarting));
  }

  async createWeeklyCapacity(insertWeeklyCapacity: InsertWeeklyCapacity): Promise<WeeklyCapacity> {
    const [capacity] = await db.insert(weeklyCapacity).values(insertWeeklyCapacity).returning();
    return capacity;
  }

  async updateWeeklyCapacity(id: string, updateData: Partial<InsertWeeklyCapacity>): Promise<WeeklyCapacity | undefined> {
    const [capacity] = await db.update(weeklyCapacity).set(updateData).where(eq(weeklyCapacity.id, id)).returning();
    return capacity || undefined;
  }

  async deleteWeeklyCapacity(id: string): Promise<boolean> {
    const result = await db.delete(weeklyCapacity).where(eq(weeklyCapacity.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Monthly Revenue operations
  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    return await db.select().from(monthlyRevenue).orderBy(desc(monthlyRevenue.month));
  }

  async getMonthlyRevenueByPeriod(month: string): Promise<MonthlyRevenue[]> {
    return await db.select().from(monthlyRevenue)
      .where(eq(monthlyRevenue.month, month))
      .orderBy(desc(monthlyRevenue.month));
  }

  async createMonthlyRevenue(insertMonthlyRevenue: InsertMonthlyRevenue): Promise<MonthlyRevenue> {
    const [revenue] = await db.insert(monthlyRevenue).values(insertMonthlyRevenue).returning();
    return revenue;
  }

  async updateMonthlyRevenue(id: string, updateData: Partial<InsertMonthlyRevenue>): Promise<MonthlyRevenue | undefined> {
    const [revenue] = await db.update(monthlyRevenue).set(updateData).where(eq(monthlyRevenue.id, id)).returning();
    return revenue || undefined;
  }

  async deleteMonthlyRevenue(id: string): Promise<boolean> {
    const result = await db.delete(monthlyRevenue).where(eq(monthlyRevenue.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Annual Revenue operations
  async getAnnualRevenue(): Promise<AnnualRevenue[]> {
    return await db.select().from(annualRevenue).orderBy(desc(annualRevenue.year));
  }

  async getAnnualRevenueByYear(year: number): Promise<AnnualRevenue[]> {
    return await db.select().from(annualRevenue)
      .where(eq(annualRevenue.year, year))
      .orderBy(desc(annualRevenue.year));
  }

  async createAnnualRevenue(insertAnnualRevenue: InsertAnnualRevenue): Promise<AnnualRevenue> {
    const [revenue] = await db.insert(annualRevenue).values(insertAnnualRevenue).returning();
    return revenue;
  }

  async updateAnnualRevenue(id: string, updateData: Partial<InsertAnnualRevenue>): Promise<AnnualRevenue | undefined> {
    const [revenue] = await db.update(annualRevenue).set(updateData).where(eq(annualRevenue.id, id)).returning();
    return revenue || undefined;
  }

  async deleteAnnualRevenue(id: string): Promise<boolean> {
    const result = await db.delete(annualRevenue).where(eq(annualRevenue.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Global Search implementation
  async globalSearch(searchTerm: string): Promise<any[]> {
    const results: any[] = [];
    const term = `%${searchTerm.toLowerCase()}%`;

    try {
      // Search Lead Sources
      const leadSourceResults = await db.select().from(leadSources)
        .where(or(
          ilike(leadSources.name, term),
          ilike(leadSources.value, term)
        ));
      results.push(...leadSourceResults.map(item => ({ ...item, _table: 'Lead Sources', _type: 'core-entities' })));

      // Search CSRs
      const csrResults = await db.select().from(csrs)
        .where(or(
          ilike(csrs.name, term),
          ilike(csrs.value, term)
        ));
      results.push(...csrResults.map(item => ({ ...item, _table: 'CSRs', _type: 'core-entities' })));

      // Search Sales Reps
      const salesRepResults = await db.select().from(salesReps)
        .where(or(
          ilike(salesReps.name, term),
          ilike(salesReps.value, term)
        ));
      results.push(...salesRepResults.map(item => ({ ...item, _table: 'Sales Reps', _type: 'core-entities' })));

      // Search Services
      const serviceResults = await db.select().from(services)
        .where(or(
          ilike(services.name, term),
          ilike(services.value, term)
        ));
      results.push(...serviceResults.map(item => ({ ...item, _table: 'Services', _type: 'core-entities' })));

      // Search Customer Concerns
      const concernResults = await db.select().from(customerConcerns)
        .where(ilike(customerConcerns.description, term));
      results.push(...concernResults.map(item => ({ ...item, _table: 'Customer Concerns', _type: 'analytics' })));

      // Search Margin Variance (job names)
      const marginResults = await db.select().from(marginVariance)
        .where(ilike(marginVariance.jobName, term));
      results.push(...marginResults.map(item => ({ ...item, _table: 'Margin Variance', _type: 'financial' })));

      return results.slice(0, 50); // Limit to 50 results
    } catch (error) {
      console.error('Global search error:', error);
      return [];
    }
  }

}

export const storage = new DatabaseStorage();
