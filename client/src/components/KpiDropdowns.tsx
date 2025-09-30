import { useState, useMemo } from 'react';
import KpiDropdown from './KpiDropdown';
import { useLeadSources, useCSRs, useSalesReps, useServices } from '@/hooks/useApiData';

// Color palette for consistent styling
const COLORS = [
  "#22c55e", "#60a5fa", "#f59e0b", "#a78bfa", 
  "#34d399", "#93c5fd", "#ef4444", "#8b5cf6",
  "#06b6d4", "#84cc16", "#f97316", "#ec4899"
];

// Fallback options for when data is loading or unavailable
export const LEAD_SOURCES_OPTIONS = [
  { value: "angi", label: "Angi", color: "#22c55e" },
  { value: "nextdoor", label: "Nextdoor", color: "#60a5fa" },
  { value: "google-ads", label: "Google Ads", color: "#f59e0b" },
  { value: "google-lsa", label: "Google LSA", color: "#a78bfa" },
  { value: "postcards", label: "Postcards", color: "#34d399" },
  { value: "website", label: "Website", color: "#93c5fd" }
];

export const CSR_OPTIONS = [
  { value: "ava", label: "Ava", color: "#f59e0b" },
  { value: "marco", label: "Marco", color: "#22c55e" },
  { value: "tia", label: "Tia", color: "#60a5fa" },
  { value: "jordan", label: "Jordan", color: "#a78bfa" }
];

export const SALES_OPTIONS = [
  { value: "diego", label: "Diego", color: "#22c55e" },
  { value: "brooke", label: "Brooke", color: "#60a5fa" },
  { value: "sam", label: "Sam", color: "#f59e0b" },
  { value: "lena", label: "Lena", color: "#a78bfa" }
];

export const SERVICE_OPTIONS = [
  { value: "hardscapes", label: "Hardscapes", color: "#22c55e" },
  { value: "planting", label: "Planting", color: "#60a5fa" },
  { value: "irrigation", label: "Irrigation", color: "#f59e0b" },
  { value: "lighting", label: "Lighting", color: "#a78bfa" },
  { value: "pergolas", label: "Pergolas", color: "#34d399" },
  { value: "water-features", label: "Water Features", color: "#93c5fd" },
  { value: "turf", label: "Turf", color: "#ef4444" }
];

export function LeadSourcesDropdown({ 
  selectedValues, 
  onSelectionChange 
}: { 
  selectedValues: string[]; 
  onSelectionChange: (values: string[]) => void; 
}) {
  const { data: leadSources, isLoading } = useLeadSources();
  
  const options = useMemo(() => {
    if (isLoading || !leadSources || leadSources.length === 0) {
      return LEAD_SOURCES_OPTIONS;
    }
    
    return leadSources.map((source: any, index: number) => ({
      value: source.name.toLowerCase().replace(/\s+/g, '-'),
      label: source.name,
      color: COLORS[index % COLORS.length]
    }));
  }, [leadSources, isLoading]);

  return (
    <KpiDropdown
      options={options}
      selected={selectedValues}
      onSelectionChange={onSelectionChange}
    />
  );
}

export function CSRDropdown({ 
  selectedValues, 
  onSelectionChange 
}: { 
  selectedValues: string[]; 
  onSelectionChange: (values: string[]) => void; 
}) {
  const { data: csrs, isLoading } = useCSRs();
  
  const options = useMemo(() => {
    if (isLoading || !csrs || csrs.length === 0) {
      return CSR_OPTIONS;
    }
    
    return csrs.map((csr: any, index: number) => ({
      value: csr.name.toLowerCase().replace(/\s+/g, '-'),
      label: csr.name,
      color: COLORS[index % COLORS.length]
    }));
  }, [csrs, isLoading]);

  return (
    <KpiDropdown
      options={options}
      selected={selectedValues}
      onSelectionChange={onSelectionChange}
    />
  );
}

export function SalesDropdown({ 
  selectedValues, 
  onSelectionChange 
}: { 
  selectedValues: string[]; 
  onSelectionChange: (values: string[]) => void; 
}) {
  const { data: salesReps, isLoading } = useSalesReps();
  
  const options = useMemo(() => {
    if (isLoading || !salesReps || salesReps.length === 0) {
      return SALES_OPTIONS;
    }
    
    return salesReps.map((rep: any, index: number) => ({
      value: rep.name.toLowerCase().replace(/\s+/g, '-'),
      label: rep.name,
      color: COLORS[index % COLORS.length]
    }));
  }, [salesReps, isLoading]);

  return (
    <KpiDropdown
      options={options}
      selected={selectedValues}
      onSelectionChange={onSelectionChange}
    />
  );
}

export function ServicesDropdown({ 
  selectedValues, 
  onSelectionChange 
}: { 
  selectedValues: string[]; 
  onSelectionChange: (values: string[]) => void; 
}) {
  const { data: services, isLoading } = useServices();
  
  const options = useMemo(() => {
    if (isLoading || !services || services.length === 0) {
      return SERVICE_OPTIONS;
    }
    
    return services.map((service: any, index: number) => ({
      value: service.name.toLowerCase().replace(/\s+/g, '-'),
      label: service.name,
      color: COLORS[index % COLORS.length]
    }));
  }, [services, isLoading]);

  return (
    <KpiDropdown
      options={options}
      selected={selectedValues}
      onSelectionChange={onSelectionChange}
    />
  );
}
