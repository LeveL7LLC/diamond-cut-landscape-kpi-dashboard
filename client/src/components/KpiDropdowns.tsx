import { useState } from 'react';
import KpiDropdown from './KpiDropdown';

// Lead Sources
export const LEAD_SOURCES_OPTIONS = [
  { value: "angi", label: "Angi", color: "#22c55e" },
  { value: "nextdoor", label: "Nextdoor", color: "#60a5fa" },
  { value: "google-ads", label: "Google Ads", color: "#f59e0b" },
  { value: "google-lsa", label: "Google LSA", color: "#a78bfa" },
  { value: "postcards", label: "Postcards", color: "#34d399" },
  { value: "website", label: "Website", color: "#93c5fd" }
];

// CSR Names
export const CSR_OPTIONS = [
  { value: "ava", label: "Ava", color: "#f59e0b" },
  { value: "marco", label: "Marco", color: "#22c55e" },
  { value: "tia", label: "Tia", color: "#60a5fa" },
  { value: "jordan", label: "Jordan", color: "#a78bfa" }
];

// Sales People
export const SALES_OPTIONS = [
  { value: "diego", label: "Diego", color: "#22c55e" },
  { value: "brooke", label: "Brooke", color: "#60a5fa" },
  { value: "sam", label: "Sam", color: "#f59e0b" },
  { value: "lena", label: "Lena", color: "#a78bfa" }
];

// Service Categories
export const SERVICE_OPTIONS = [
  { value: "hardscapes", label: "Hardscapes", color: "#22c55e" },
  { value: "planting", label: "Planting", color: "#60a5fa" },
  { value: "irrigation", label: "Irrigation", color: "#f59e0b" },
  { value: "lighting", label: "Lighting", color: "#a78bfa" },
  { value: "pergolas", label: "Pergolas", color: "#34d399" },
  { value: "water-features", label: "Water Features", color: "#93c5fd" },
  { value: "turf", label: "Turf", color: "#ef4444" }
];

export function LeadSourcesDropdown({ onSelectionChange }: { onSelectionChange?: (selected: string[]) => void }) {
  const [selected, setSelected] = useState(LEAD_SOURCES_OPTIONS.map(opt => opt.value));
  
  const handleChange = (newSelected: string[]) => {
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };
  
  return (
    <KpiDropdown
      options={LEAD_SOURCES_OPTIONS}
      selected={selected}
      onSelectionChange={handleChange}
      placeholder="All Sources"
      data-testid="dropdown-lead-sources"
    />
  );
}

export function CSRDropdown({ onSelectionChange }: { onSelectionChange?: (selected: string[]) => void }) {
  const [selected, setSelected] = useState(CSR_OPTIONS.map(opt => opt.value));
  
  const handleChange = (newSelected: string[]) => {
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };
  
  return (
    <KpiDropdown
      options={CSR_OPTIONS}
      selected={selected}
      onSelectionChange={handleChange}
      placeholder="All CSRs"
      data-testid="dropdown-csr"
    />
  );
}

export function SalesDropdown({ onSelectionChange }: { onSelectionChange?: (selected: string[]) => void }) {
  const [selected, setSelected] = useState(SALES_OPTIONS.map(opt => opt.value));
  
  const handleChange = (newSelected: string[]) => {
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };
  
  return (
    <KpiDropdown
      options={SALES_OPTIONS}
      selected={selected}
      onSelectionChange={handleChange}
      placeholder="All Sales"
      data-testid="dropdown-sales"
    />
  );
}

export function ServicesDropdown({ onSelectionChange }: { onSelectionChange?: (selected: string[]) => void }) {
  const [selected, setSelected] = useState(SERVICE_OPTIONS.map(opt => opt.value));
  
  const handleChange = (newSelected: string[]) => {
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };
  
  return (
    <KpiDropdown
      options={SERVICE_OPTIONS}
      selected={selected}
      onSelectionChange={handleChange}
      placeholder="All Services"
      data-testid="dropdown-services"
    />
  );
}