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
  return useQuery<any[]>({
    queryKey: ['lead-sources'],
    queryFn: () => fetchApiData<any[]>('/api/lead-sources'),
  });
}

export function useCSRs() {
  return useQuery<any[]>({
    queryKey: ['csrs'],
    queryFn: () => fetchApiData<any[]>('/api/csrs'),
  });
}

export function useSalesReps() {
  return useQuery<any[]>({
    queryKey: ['sales-reps'],
    queryFn: () => fetchApiData<any[]>('/api/sales-reps'),
  });
}

export function useServices() {
  return useQuery<any[]>({
    queryKey: ['services'],
    queryFn: () => fetchApiData<any[]>('/api/services'),
  });
}

// Time-series data hooks
export function useDailyLeads(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery<any[]>({
    queryKey: ['daily-leads', startDate, endDate],
    queryFn: () => fetchApiData<any[]>(`/api/daily-leads${queryString ? `?${queryString}` : ''}`),
  });
}

export function useDailyBookings(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery<any[]>({
    queryKey: ['daily-bookings', startDate, endDate],
    queryFn: () => fetchApiData<any[]>(`/api/daily-bookings${queryString ? `?${queryString}` : ''}`),
  });
}

export function useDailyCloses(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery<any[]>({
    queryKey: ['daily-closes', startDate, endDate],
    queryFn: () => fetchApiData<any[]>(`/api/daily-closes${queryString ? `?${queryString}` : ''}`),
  });
}

export function useDailyContracts(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery<any[]>({
    queryKey: ['daily-contracts', startDate, endDate],
    queryFn: () => fetchApiData<any[]>(`/api/daily-contracts${queryString ? `?${queryString}` : ''}`),
  });
}

// Financial and analytics hooks
export function useMonthlyFinance() {
  return useQuery<any[]>({
    queryKey: ['monthly-finance'],
    queryFn: () => fetchApiData<any[]>('/api/monthly-finance'),
  });
}

export function useArAging() {
  return useQuery<any[]>({
    queryKey: ['ar-aging'],
    queryFn: () => fetchApiData<any[]>('/api/ar-aging'),
  });
}

export function useMarginVariance(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const queryString = params.toString();
  
  return useQuery<any[]>({
    queryKey: ['margin-variance', startDate, endDate],
    queryFn: () => fetchApiData<any[]>(`/api/margin-variance${queryString ? `?${queryString}` : ''}`),
  });
}

export function useCustomerConcerns() {
  return useQuery<any[]>({
    queryKey: ['customer-concerns'],
    queryFn: () => fetchApiData<any[]>('/api/customer-concerns'),
  });
}

export function useSalesGoals() {
  return useQuery<any[]>({
    queryKey: ['sales-goals'],
    queryFn: () => fetchApiData<any[]>('/api/sales-goals'),
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
