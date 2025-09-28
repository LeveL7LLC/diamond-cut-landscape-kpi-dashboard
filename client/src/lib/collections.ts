import { createCollection } from '@tanstack/react-db';
import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  type LeadSource, 
  type Csr, 
  type SalesRep, 
  type Service,
  type DailyLeads,
  type DailyBookings,
  type DailyCloses,
  type DailyContracts,
  type MonthlyFinance,
  type ArAging,
  type MarginVariance,
  type CustomerConcerns,
  type SalesGoals,
  type WeeklyCapacity,
  type PipelineSnapshots,
  type MonthlyRevenue,
  type AnnualRevenue
} from '@shared/schema';

// Helper function to create basic read-only collections
function createReadOnlyCollection<T extends { id: string }>(
  queryKey: string[], 
  endpoint: string
) {
  return createCollection(
    queryCollectionOptions<T>({
      queryClient,
      queryKey,
      queryFn: async () => {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Failed to fetch ${queryKey.join('-')}`);
        return response.json();
      },
      getKey: (item) => item.id,
    })
  );
}

// Helper function to create collections with optimistic updates
function createMutableCollection<T extends { id: string }>(
  queryKey: string[], 
  endpoint: string
) {
  return createCollection(
    queryCollectionOptions<T>({
      queryClient,
      queryKey,
      queryFn: async () => {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Failed to fetch ${queryKey.join('-')}`);
        return response.json();
      },
      getKey: (item) => item.id,
      // Simplified mutation that uses the existing apiRequest utility
      onUpdate: async ({ transaction }) => {
        try {
          // Get the first mutation (simplified for now)
          const firstMutation = transaction.mutations?.[0];
          if (firstMutation) {
            const { original, modified } = firstMutation;
            await apiRequest('PUT', `${endpoint}/${original.id}`, modified);
          }
        } catch (error) {
          // Let TanStack DB handle the rollback
          throw error;
        }
      },
    })
  );
}

// Core Entity Collections (mutable for configuration data)
export const leadSourcesCollection = createMutableCollection<LeadSource>(
  ['lead-sources'], 
  '/api/lead-sources'
);

export const csrsCollection = createMutableCollection<Csr>(
  ['csrs'], 
  '/api/csrs'
);

export const salesRepsCollection = createMutableCollection<SalesRep>(
  ['sales-reps'], 
  '/api/sales-reps'
);

export const servicesCollection = createMutableCollection<Service>(
  ['services'], 
  '/api/services'
);

// Time-Series Collections (read-only for dashboard display)
export const dailyLeadsCollection = createReadOnlyCollection<DailyLeads>(
  ['daily-leads'], 
  '/api/daily-leads'
);

export const dailyBookingsCollection = createReadOnlyCollection<DailyBookings>(
  ['daily-bookings'], 
  '/api/daily-bookings'
);

export const dailyClosesCollection = createReadOnlyCollection<DailyCloses>(
  ['daily-closes'], 
  '/api/daily-closes'
);

export const dailyContractsCollection = createReadOnlyCollection<DailyContracts>(
  ['daily-contracts'], 
  '/api/daily-contracts'
);

export const pipelineSnapshotsCollection = createReadOnlyCollection<PipelineSnapshots>(
  ['pipeline-snapshots'], 
  '/api/pipeline-snapshots'
);

// Financial and Analytics Collections (read-only for dashboard display)
export const monthlyFinanceCollection = createReadOnlyCollection<MonthlyFinance>(
  ['monthly-finance'], 
  '/api/monthly-finance'
);

export const arAgingCollection = createReadOnlyCollection<ArAging>(
  ['ar-aging'], 
  '/api/ar-aging'
);

export const marginVarianceCollection = createReadOnlyCollection<MarginVariance>(
  ['margin-variance'], 
  '/api/margin-variance'
);

export const customerConcernsCollection = createReadOnlyCollection<CustomerConcerns>(
  ['customer-concerns'], 
  '/api/customer-concerns'
);

export const salesGoalsCollection = createReadOnlyCollection<SalesGoals>(
  ['sales-goals'], 
  '/api/sales-goals'
);

export const weeklyCapacityCollection = createReadOnlyCollection<WeeklyCapacity>(
  ['weekly-capacity'], 
  '/api/weekly-capacity'
);

export const monthlyRevenueCollection = createReadOnlyCollection<MonthlyRevenue>(
  ['monthly-revenue'], 
  '/api/monthly-revenue'
);

export const annualRevenueCollection = createReadOnlyCollection<AnnualRevenue>(
  ['annual-revenue'], 
  '/api/annual-revenue'
);

// Export all collections for easy access
export const collections = {
  // Core entities (mutable for configuration)
  leadSources: leadSourcesCollection,
  csrs: csrsCollection,
  salesReps: salesRepsCollection,
  services: servicesCollection,
  
  // Time-series data (read-only for dashboard)
  dailyLeads: dailyLeadsCollection,
  dailyBookings: dailyBookingsCollection,
  dailyCloses: dailyClosesCollection,
  dailyContracts: dailyContractsCollection,
  pipelineSnapshots: pipelineSnapshotsCollection,
  
  // Financial and analytics (read-only for dashboard)
  monthlyFinance: monthlyFinanceCollection,
  arAging: arAgingCollection,
  marginVariance: marginVarianceCollection,
  customerConcerns: customerConcernsCollection,
  salesGoals: salesGoalsCollection,
  weeklyCapacity: weeklyCapacityCollection,
  monthlyRevenue: monthlyRevenueCollection,
  annualRevenue: annualRevenueCollection,
};