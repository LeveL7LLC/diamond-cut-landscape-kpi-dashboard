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
}

import { db } from './db';
import { 
  users, leadSources, csrs, salesReps, services,
  dailyLeads, dailyBookings, dailyCloses, dailyContracts,
  monthlyFinance, arAging, marginVariance, customerConcerns,
  salesGoals, weeklyCapacity, pipelineSnapshots,
  monthlyRevenue, annualRevenue
} from '@shared/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

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
  
  // Placeholder implementations for remaining methods
  async getMonthlyFinance(): Promise<MonthlyFinance[]> { return []; }
  async createMonthlyFinance(monthlyFinance: InsertMonthlyFinance): Promise<MonthlyFinance> { throw new Error('Not implemented'); }
  async updateMonthlyFinance(id: string, monthlyFinance: Partial<InsertMonthlyFinance>): Promise<MonthlyFinance | undefined> { return undefined; }
  async deleteMonthlyFinance(id: string): Promise<boolean> { return false; }

  async getArAging(): Promise<ArAging[]> { return []; }
  async getLatestArAging(): Promise<ArAging | undefined> { return undefined; }
  async createArAging(arAging: InsertArAging): Promise<ArAging> { throw new Error('Not implemented'); }
  async updateArAging(id: string, arAging: Partial<InsertArAging>): Promise<ArAging | undefined> { return undefined; }
  async deleteArAging(id: string): Promise<boolean> { return false; }

  async getMarginVariance(): Promise<MarginVariance[]> { return []; }
  async getMarginVarianceInRange(startDate: string, endDate: string): Promise<MarginVariance[]> { return []; }
  async createMarginVariance(marginVariance: InsertMarginVariance): Promise<MarginVariance> { throw new Error('Not implemented'); }
  async updateMarginVariance(id: string, marginVariance: Partial<InsertMarginVariance>): Promise<MarginVariance | undefined> { return undefined; }
  async deleteMarginVariance(id: string): Promise<boolean> { return false; }

  async getCustomerConcerns(): Promise<CustomerConcerns[]> { return []; }
  async getOpenCustomerConcerns(): Promise<CustomerConcerns[]> { return []; }
  async createCustomerConcerns(customerConcerns: InsertCustomerConcerns): Promise<CustomerConcerns> { throw new Error('Not implemented'); }
  async updateCustomerConcerns(id: string, customerConcerns: Partial<InsertCustomerConcerns>): Promise<CustomerConcerns | undefined> { return undefined; }
  async deleteCustomerConcerns(id: string): Promise<boolean> { return false; }

  async getSalesGoals(): Promise<SalesGoals[]> { return []; }
  async getSalesGoalsByPeriod(period: string): Promise<SalesGoals[]> { return []; }
  async createSalesGoals(salesGoals: InsertSalesGoals): Promise<SalesGoals> { throw new Error('Not implemented'); }
  async updateSalesGoals(id: string, salesGoals: Partial<InsertSalesGoals>): Promise<SalesGoals | undefined> { return undefined; }
  async deleteSalesGoals(id: string): Promise<boolean> { return false; }

  async getWeeklyCapacity(): Promise<WeeklyCapacity[]> { return []; }
  async getWeeklyCapacityInRange(startDate: string, endDate: string): Promise<WeeklyCapacity[]> { return []; }
  async createWeeklyCapacity(weeklyCapacity: InsertWeeklyCapacity): Promise<WeeklyCapacity> { throw new Error('Not implemented'); }
  async updateWeeklyCapacity(id: string, weeklyCapacity: Partial<InsertWeeklyCapacity>): Promise<WeeklyCapacity | undefined> { return undefined; }
  async deleteWeeklyCapacity(id: string): Promise<boolean> { return false; }

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> { return []; }
  async getMonthlyRevenueByPeriod(month: string): Promise<MonthlyRevenue[]> { return []; }
  async createMonthlyRevenue(monthlyRevenue: InsertMonthlyRevenue): Promise<MonthlyRevenue> { throw new Error('Not implemented'); }
  async updateMonthlyRevenue(id: string, monthlyRevenue: Partial<InsertMonthlyRevenue>): Promise<MonthlyRevenue | undefined> { return undefined; }
  async deleteMonthlyRevenue(id: string): Promise<boolean> { return false; }

  async getAnnualRevenue(): Promise<AnnualRevenue[]> { return []; }
  async getAnnualRevenueByYear(year: number): Promise<AnnualRevenue[]> { return []; }
  async createAnnualRevenue(annualRevenue: InsertAnnualRevenue): Promise<AnnualRevenue> { throw new Error('Not implemented'); }
  async updateAnnualRevenue(id: string, annualRevenue: Partial<InsertAnnualRevenue>): Promise<AnnualRevenue | undefined> { return undefined; }
  async deleteAnnualRevenue(id: string): Promise<boolean> { return false; }
}

export const storage = new DatabaseStorage();
