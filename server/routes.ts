import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { 
  insertLeadSourceSchema, insertCsrSchema, insertSalesRepSchema, insertServiceSchema,
  insertDailyLeadsSchema, insertDailyBookingsSchema, insertDailyClosesSchema, 
  insertDailyContractsSchema, insertPipelineSnapshotsSchema, insertMonthlyFinanceSchema,
  insertArAgingSchema, insertMarginVarianceSchema, insertCustomerConcernsSchema,
  insertSalesGoalsSchema, insertWeeklyCapacitySchema, insertMonthlyRevenueSchema,
  insertAnnualRevenueSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function for error handling
  const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  // Helper function for safe parsing with proper error responses
  const validateRequestBody = (schema: any, data: any) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      // Throw the actual ZodError to preserve all metadata
      throw result.error;
    }
    return result.data;
  };

  // Core Entity Routes

  // Lead Sources
  app.get('/api/lead-sources', asyncHandler(async (req: any, res: any) => {
    const leadSources = await storage.getLeadSources();
    res.json(leadSources);
  }));

  app.get('/api/lead-sources/:id', asyncHandler(async (req: any, res: any) => {
    const leadSource = await storage.getLeadSource(req.params.id);
    if (!leadSource) {
      return res.status(404).json({ error: 'Lead source not found' });
    }
    res.json(leadSource);
  }));

  app.post('/api/lead-sources', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertLeadSourceSchema, req.body);
    const leadSource = await storage.createLeadSource(validatedData);
    res.status(201).json(leadSource);
  }));

  app.put('/api/lead-sources/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertLeadSourceSchema.partial(), req.body);
    const leadSource = await storage.updateLeadSource(req.params.id, validatedData);
    if (!leadSource) {
      return res.status(404).json({ error: 'Lead source not found' });
    }
    res.json(leadSource);
  }));

  app.delete('/api/lead-sources/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteLeadSource(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Lead source not found' });
    }
    res.status(204).send();
  }));

  // CSRs
  app.get('/api/csrs', asyncHandler(async (req: any, res: any) => {
    const csrs = await storage.getCsrs();
    res.json(csrs);
  }));

  app.get('/api/csrs/:id', asyncHandler(async (req: any, res: any) => {
    const csr = await storage.getCsr(req.params.id);
    if (!csr) {
      return res.status(404).json({ error: 'CSR not found' });
    }
    res.json(csr);
  }));

  app.post('/api/csrs', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertCsrSchema, req.body);
    const csr = await storage.createCsr(validatedData);
    res.status(201).json(csr);
  }));

  app.put('/api/csrs/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertCsrSchema.partial(), req.body);
    const csr = await storage.updateCsr(req.params.id, validatedData);
    if (!csr) {
      return res.status(404).json({ error: 'CSR not found' });
    }
    res.json(csr);
  }));

  app.delete('/api/csrs/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteCsr(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'CSR not found' });
    }
    res.status(204).send();
  }));

  // Sales Representatives
  app.get('/api/sales-reps', asyncHandler(async (req: any, res: any) => {
    const salesReps = await storage.getSalesReps();
    res.json(salesReps);
  }));

  app.get('/api/sales-reps/:id', asyncHandler(async (req: any, res: any) => {
    const salesRep = await storage.getSalesRep(req.params.id);
    if (!salesRep) {
      return res.status(404).json({ error: 'Sales representative not found' });
    }
    res.json(salesRep);
  }));

  app.post('/api/sales-reps', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertSalesRepSchema, req.body);
    const salesRep = await storage.createSalesRep(validatedData);
    res.status(201).json(salesRep);
  }));

  app.put('/api/sales-reps/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertSalesRepSchema.partial(), req.body);
    const salesRep = await storage.updateSalesRep(req.params.id, validatedData);
    if (!salesRep) {
      return res.status(404).json({ error: 'Sales representative not found' });
    }
    res.json(salesRep);
  }));

  app.delete('/api/sales-reps/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteSalesRep(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Sales representative not found' });
    }
    res.status(204).send();
  }));

  // Services
  app.get('/api/services', asyncHandler(async (req: any, res: any) => {
    const services = await storage.getServices();
    res.json(services);
  }));

  app.get('/api/services/:id', asyncHandler(async (req: any, res: any) => {
    const service = await storage.getService(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  }));

  app.post('/api/services', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertServiceSchema, req.body);
    const service = await storage.createService(validatedData);
    res.status(201).json(service);
  }));

  app.put('/api/services/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertServiceSchema.partial(), req.body);
    const service = await storage.updateService(req.params.id, validatedData);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  }));

  app.delete('/api/services/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteService(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(204).send();
  }));

  // Time-Series Data Routes

  // Daily Leads
  app.get('/api/daily-leads', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let dailyLeads;
    if (startDate && endDate) {
      dailyLeads = await storage.getDailyLeadsInRange(startDate, endDate);
    } else {
      dailyLeads = await storage.getDailyLeads();
    }
    res.json(dailyLeads);
  }));

  app.post('/api/daily-leads', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyLeadsSchema, req.body);
    const dailyLeads = await storage.createDailyLeads(validatedData);
    res.status(201).json(dailyLeads);
  }));

  app.put('/api/daily-leads/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyLeadsSchema.partial(), req.body);
    const dailyLeads = await storage.updateDailyLeads(req.params.id, validatedData);
    if (!dailyLeads) {
      return res.status(404).json({ error: 'Daily leads record not found' });
    }
    res.json(dailyLeads);
  }));

  app.delete('/api/daily-leads/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteDailyLeads(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Daily leads record not found' });
    }
    res.status(204).send();
  }));

  // Daily Bookings
  app.get('/api/daily-bookings', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let dailyBookings;
    if (startDate && endDate) {
      dailyBookings = await storage.getDailyBookingsInRange(startDate, endDate);
    } else {
      dailyBookings = await storage.getDailyBookings();
    }
    res.json(dailyBookings);
  }));

  app.post('/api/daily-bookings', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyBookingsSchema, req.body);
    const dailyBookings = await storage.createDailyBookings(validatedData);
    res.status(201).json(dailyBookings);
  }));

  app.put('/api/daily-bookings/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyBookingsSchema.partial(), req.body);
    const dailyBookings = await storage.updateDailyBookings(req.params.id, validatedData);
    if (!dailyBookings) {
      return res.status(404).json({ error: 'Daily bookings record not found' });
    }
    res.json(dailyBookings);
  }));

  app.delete('/api/daily-bookings/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteDailyBookings(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Daily bookings record not found' });
    }
    res.status(204).send();
  }));

  // Daily Closes
  app.get('/api/daily-closes', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let dailyCloses;
    if (startDate && endDate) {
      dailyCloses = await storage.getDailyClosesInRange(startDate, endDate);
    } else {
      dailyCloses = await storage.getDailyCloses();
    }
    res.json(dailyCloses);
  }));

  app.post('/api/daily-closes', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyClosesSchema, req.body);
    const dailyCloses = await storage.createDailyCloses(validatedData);
    res.status(201).json(dailyCloses);
  }));

  app.put('/api/daily-closes/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyClosesSchema.partial(), req.body);
    const dailyCloses = await storage.updateDailyCloses(req.params.id, validatedData);
    if (!dailyCloses) {
      return res.status(404).json({ error: 'Daily closes record not found' });
    }
    res.json(dailyCloses);
  }));

  app.delete('/api/daily-closes/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteDailyCloses(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Daily closes record not found' });
    }
    res.status(204).send();
  }));

  // Daily Contracts
  app.get('/api/daily-contracts', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let dailyContracts;
    if (startDate && endDate) {
      dailyContracts = await storage.getDailyContractsInRange(startDate, endDate);
    } else {
      dailyContracts = await storage.getDailyContracts();
    }
    res.json(dailyContracts);
  }));

  app.post('/api/daily-contracts', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyContractsSchema, req.body);
    const dailyContracts = await storage.createDailyContracts(validatedData);
    res.status(201).json(dailyContracts);
  }));

  app.put('/api/daily-contracts/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertDailyContractsSchema.partial(), req.body);
    const dailyContracts = await storage.updateDailyContracts(req.params.id, validatedData);
    if (!dailyContracts) {
      return res.status(404).json({ error: 'Daily contracts record not found' });
    }
    res.json(dailyContracts);
  }));

  app.delete('/api/daily-contracts/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deleteDailyContracts(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Daily contracts record not found' });
    }
    res.status(204).send();
  }));

  // Pipeline Snapshots
  app.get('/api/pipeline-snapshots', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let pipelineSnapshots;
    if (startDate && endDate) {
      pipelineSnapshots = await storage.getPipelineSnapshotsInRange(startDate, endDate);
    } else {
      pipelineSnapshots = await storage.getPipelineSnapshots();
    }
    res.json(pipelineSnapshots);
  }));

  app.post('/api/pipeline-snapshots', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertPipelineSnapshotsSchema, req.body);
    const pipelineSnapshots = await storage.createPipelineSnapshots(validatedData);
    res.status(201).json(pipelineSnapshots);
  }));

  app.put('/api/pipeline-snapshots/:id', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertPipelineSnapshotsSchema.partial(), req.body);
    const pipelineSnapshots = await storage.updatePipelineSnapshots(req.params.id, validatedData);
    if (!pipelineSnapshots) {
      return res.status(404).json({ error: 'Pipeline snapshots record not found' });
    }
    res.json(pipelineSnapshots);
  }));

  app.delete('/api/pipeline-snapshots/:id', asyncHandler(async (req: any, res: any) => {
    const success = await storage.deletePipelineSnapshots(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Pipeline snapshots record not found' });
    }
    res.status(204).send();
  }));

  // Financial and Analytics Routes (placeholder implementations for now)
  
  // Monthly Finance
  app.get('/api/monthly-finance', asyncHandler(async (req: any, res: any) => {
    const monthlyFinance = await storage.getMonthlyFinance();
    res.json(monthlyFinance);
  }));

  app.post('/api/monthly-finance', asyncHandler(async (req: any, res: any) => {
    const validatedData = validateRequestBody(insertMonthlyFinanceSchema, req.body);
    const monthlyFinance = await storage.createMonthlyFinance(validatedData);
    res.status(201).json(monthlyFinance);
  }));

  // AR Aging
  app.get('/api/ar-aging', asyncHandler(async (req: any, res: any) => {
    const arAging = await storage.getArAging();
    res.json(arAging);
  }));

  // Margin Variance
  app.get('/api/margin-variance', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let marginVariance;
    if (startDate && endDate) {
      marginVariance = await storage.getMarginVarianceInRange(startDate, endDate);
    } else {
      marginVariance = await storage.getMarginVariance();
    }
    res.json(marginVariance);
  }));

  // Customer Concerns
  app.get('/api/customer-concerns', asyncHandler(async (req: any, res: any) => {
    const customerConcerns = await storage.getCustomerConcerns();
    res.json(customerConcerns);
  }));

  // Sales Goals
  app.get('/api/sales-goals', asyncHandler(async (req: any, res: any) => {
    const salesGoals = await storage.getSalesGoals();
    res.json(salesGoals);
  }));

  // Weekly Capacity
  app.get('/api/weekly-capacity', asyncHandler(async (req: any, res: any) => {
    const { startDate, endDate } = req.query;
    let weeklyCapacity;
    if (startDate && endDate) {
      weeklyCapacity = await storage.getWeeklyCapacityInRange(startDate, endDate);
    } else {
      weeklyCapacity = await storage.getWeeklyCapacity();
    }
    res.json(weeklyCapacity);
  }));

  // Monthly Revenue
  app.get('/api/monthly-revenue', asyncHandler(async (req: any, res: any) => {
    const monthlyRevenue = await storage.getMonthlyRevenue();
    res.json(monthlyRevenue);
  }));

  // Annual Revenue
  app.get('/api/annual-revenue', asyncHandler(async (req: any, res: any) => {
    const annualRevenue = await storage.getAnnualRevenue();
    res.json(annualRevenue);
  }));

  // Global error handler - must be added after all routes
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err);
    
    // Handle Zod validation errors
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        issues: err.issues
      });
    }
    
    // Handle foreign key constraint violations
    if (err.message && err.message.includes('violates foreign key constraint')) {
      const message = getFriendlyForeignKeyError(err.message);
      return res.status(400).json({
        message: 'Invalid reference',
        details: message
      });
    }
    
    // Handle unique constraint violations
    if (err.message && err.message.includes('violates unique constraint')) {
      return res.status(400).json({
        message: 'Duplicate entry',
        details: 'A record with this value already exists'
      });
    }
    
    // Handle other known error types
    if (err.status && err.status < 500) {
      return res.status(err.status).json({
        message: err.message || 'Client error'
      });
    }
    
    // Handle unknown server errors
    res.status(500).json({ 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  });

  // Helper function to convert foreign key errors to user-friendly messages
  function getFriendlyForeignKeyError(errorMessage: string): string {
    if (errorMessage.includes('lead_source_id')) {
      return 'The specified lead source does not exist. Please create the lead source first or use a valid lead source ID.';
    }
    if (errorMessage.includes('csr_id')) {
      return 'The specified CSR does not exist. Please create the CSR first or use a valid CSR ID.';
    }
    if (errorMessage.includes('sales_rep_id')) {
      return 'The specified sales representative does not exist. Please create the sales rep first or use a valid sales rep ID.';
    }
    if (errorMessage.includes('service_id')) {
      return 'The specified service does not exist. Please create the service first or use a valid service ID.';
    }
    return 'The referenced record does not exist. Please check your input and try again.';
  }

  const httpServer = createServer(app);
  return httpServer;
}