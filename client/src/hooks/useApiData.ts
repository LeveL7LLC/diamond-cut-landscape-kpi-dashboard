import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Helper function to fetch data from API
async function fetchApiData<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return response.json();
}

// Core entity hooks
export function useLeadSources() {
  return useQuery({
    queryKey: ['lead-sources'],
    queryFn: () => fetchApiData('/api/lead-sources'),
  });
}

export function useCSRs() {
  return useQuery({
    queryKey: ['csrs'],
    queryFn: () => fetchApiData('/api/csrs'),
  });
}

export function useSalesReps() {
  return useQuery({
    queryKey: ['sales-reps'],
    queryFn: () => fetchApiData('/api/sales-reps'),
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => fetchApiData('/api/services'),
  });
}

// Time-series data hooks
export function useDailyLeads(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['daily-leads', startDate, endDate],
    queryFn: () => fetchApiData(`/api/daily-leads${queryString ? `?${queryString}` : ''}`),
  });
}

export function useDailyBookings(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['daily-bookings', startDate, endDate],
    queryFn: () => fetchApiData(`/api/daily-bookings${queryString ? `?${queryString}` : ''}`),
  });
}

export function useDailyCloses(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['daily-closes', startDate, endDate],
    queryFn: () => fetchApiData(`/api/daily-closes${queryString ? `?${queryString}` : ''}`),
  });
}

export function useDailyContracts(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['daily-contracts', startDate, endDate],
    queryFn: () => fetchApiData(`/api/daily-contracts${queryString ? `?${queryString}` : ''}`),
  });
}

// Financial and analytics hooks
export function useMonthlyFinance() {
  return useQuery({
    queryKey: ['monthly-finance'],
    queryFn: () => fetchApiData('/api/monthly-finance'),
  });
}

export function useArAging() {
  return useQuery({
    queryKey: ['ar-aging'],
    queryFn: () => fetchApiData('/api/ar-aging'),
  });
}

export function useMarginVariance(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['margin-variance', startDate, endDate],
    queryFn: () => fetchApiData(`/api/margin-variance${queryString ? `?${queryString}` : ''}`),
  });
}

export function useCustomerConcerns() {
  return useQuery({
    queryKey: ['customer-concerns'],
    queryFn: () => fetchApiData('/api/customer-concerns'),
  });
}

export function useSalesGoals() {
  return useQuery({
    queryKey: ['sales-goals'],
    queryFn: () => fetchApiData('/api/sales-goals'),
  });
}

export function useWeeklyCapacity(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['weekly-capacity', startDate, endDate],
    queryFn: () => fetchApiData(`/api/weekly-capacity${queryString ? `?${queryString}` : ''}`),
  });
}

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: () => fetchApiData('/api/monthly-revenue'),
  });
}

export function useAnnualRevenue() {
  return useQuery({
    queryKey: ['annual-revenue'],
    queryFn: () => fetchApiData('/api/annual-revenue'),
  });
}

export function usePipelineSnapshots(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery({
    queryKey: ['pipeline-snapshots', startDate, endDate],
    queryFn: () => fetchApiData(`/api/pipeline-snapshots${queryString ? `?${queryString}` : ''}`),
  });
}