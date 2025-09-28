import { useState } from 'react';
import { DollarSign, PhoneCall, CalendarCheck2, ClipboardCheck, Banknote, Receipt, AlertTriangle } from 'lucide-react';
import KpiTile from './KpiTile';
import Thermometer from './Thermometer';
import ProfitWidget from './ProfitWidget';
import DateRangeSelector, { type DateRange } from './DateRangeSelector';
import { LeadSourcesDropdown, CSRDropdown, SalesDropdown, ServicesDropdown, LEAD_SOURCES_OPTIONS, CSR_OPTIONS, SALES_OPTIONS, SERVICE_OPTIONS } from './KpiDropdowns';
import { SalesGoalsChart, ARAgingChart, CapacityChart } from './DashboardCharts';
import SegmentedLine from './SegmentedLine';

export default function Dashboard() {
  // Mock state management //todo: remove mock functionality
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '2025-08-25',
    end: '2025-09-28',
    preset: '30d'
  });


  // State for dropdown selections
  const [selectedLeadSources, setSelectedLeadSources] = useState(LEAD_SOURCES_OPTIONS.map(opt => opt.value));
  const [selectedCSRs, setSelectedCSRs] = useState(CSR_OPTIONS.map(opt => opt.value));
  const [selectedSalesReps, setSelectedSalesReps] = useState(SALES_OPTIONS.map(opt => opt.value));
  const [selectedServices, setSelectedServices] = useState(SERVICE_OPTIONS.map(opt => opt.value));

  // Generate segmented line data based on selections //todo: remove mock functionality
  const generateSegmentData = (options: any[], selected: string[]) => {
    return options
      .filter(opt => selected.includes(opt.value))
      .map(opt => ({
        value: opt.value,
        label: opt.label,
        color: opt.color,
        proportion: Math.random() * 0.5 + 0.1 // Mock proportional data
      }));
  };

  const leadsSegmentData = generateSegmentData(LEAD_SOURCES_OPTIONS, selectedLeadSources);
  const csrSegmentData = generateSegmentData(CSR_OPTIONS, selectedCSRs);
  const salesSegmentData = generateSegmentData(SALES_OPTIONS, selectedSalesReps);
  const servicesSegmentData = generateSegmentData(SERVICE_OPTIONS, selectedServices);

  // Mock data for KPI tiles //todo: remove mock functionality
  const mockLeadSources = [
    { name: "Angi", color: "#22c55e", count: 42 },
    { name: "Nextdoor", color: "#60a5fa", count: 38 },
    { name: "Google Ads", color: "#f59e0b", count: 35 },
    { name: "Google LSA", color: "#a78bfa", count: 28 },
    { name: "Postcards", color: "#34d399", count: 18 },
    { name: "Website", color: "#93c5fd", count: 15 }
  ];

  const mockCSRs = [
    { name: "Ava", color: "#f59e0b" },
    { name: "Marco", color: "#22c55e" },
    { name: "Tia", color: "#60a5fa" },
    { name: "Jordan", color: "#a78bfa" }
  ];

  const mockSalesReps = [
    { name: "Diego", color: "#22c55e" },
    { name: "Brooke", color: "#60a5fa" },
    { name: "Sam", color: "#f59e0b" },
    { name: "Lena", color: "#a78bfa" }
  ];

  const mockServices = [
    { name: "Shaping", color: "#ef4444" },
    { name: "Pergolas", color: "#22c55e" },
    { name: "Irrigation", color: "#60a5fa" },
    { name: "Waterfeatres", color: "#f59e0b" }
  ];

  const leadSourcesLegend = (
    <div className="flex flex-wrap gap-2">
      {mockLeadSources.slice(0, 4).map((source) => (
        <div key={source.name} className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: source.color }}
          />
          <span className="text-xs text-muted-foreground">{source.name}</span>
        </div>
      ))}
    </div>
  );

  const csrLegend = (
    <div className="flex flex-wrap gap-2">
      {mockCSRs.map((csr) => (
        <div key={csr.name} className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: csr.color }}
          />
          <span className="text-xs text-muted-foreground">{csr.name}</span>
        </div>
      ))}
    </div>
  );

  const salesRepsLegend = (
    <div className="flex flex-wrap gap-2">
      {mockSalesReps.map((rep) => (
        <div key={rep.name} className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: rep.color }}
          />
          <span className="text-xs text-muted-foreground">{rep.name}</span>
        </div>
      ))}
    </div>
  );

  const servicesLegend = (
    <div className="flex flex-wrap gap-2">
      {mockServices.map((service) => (
        <div key={service.name} className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: service.color }}
          />
          <span className="text-xs text-muted-foreground">{service.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
          <div>
            <h1 className="text-2xl font-bold">Diamond Cut Landscape</h1>
            <p className="text-sm text-muted-foreground">Executive Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DateRangeSelector range={dateRange} setRange={setDateRange} />
          <div className="text-sm text-muted-foreground">
            Updated {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiTile
          icon={PhoneCall}
          label="Qualified Leads"
          value="380"
          sub="2025-08-25 → 2025-09-28"
          data-testid="kpi-qualified-leads"
          rightSlot={<LeadSourcesDropdown onSelectionChange={setSelectedLeadSources} />}
          sparkline={<SegmentedLine segments={leadsSegmentData} />}
          bottomSlot={leadSourcesLegend}
        />
        
        <KpiTile
          icon={CalendarCheck2}
          label="Booking Rate"
          value="32%"
          sub="Leads → Consult"
          data-testid="kpi-booking-rate"
          rightSlot={<CSRDropdown onSelectionChange={setSelectedCSRs} />}
          sparkline={<SegmentedLine segments={csrSegmentData} />}
          bottomSlot={csrLegend}
        />
        
        <KpiTile
          icon={ClipboardCheck}
          label="Close Rate"
          value="48%"
          sub="Signed / Presented"
          data-testid="kpi-close-rate"
          rightSlot={<SalesDropdown onSelectionChange={setSelectedSalesReps} />}
          sparkline={<SegmentedLine segments={salesSegmentData} />}
          bottomSlot={salesRepsLegend}
        />
        
        <KpiTile
          icon={DollarSign}
          label="Avg Contract Value"
          value="$31,103"
          sub="2025-09-28 → 2025-09-28"
          data-testid="kpi-contract-value"
          rightSlot={<ServicesDropdown onSelectionChange={setSelectedServices} />}
          sparkline={<SegmentedLine segments={servicesSegmentData} />}
          bottomSlot={servicesLegend}
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <ProfitWidget
            label="Gross Profit"
            value={0.46}
            mom={0.024}
            data-testid="profit-gross"
          />
          <ProfitWidget
            label="Net Profit"
            value={0.20}
            mom={-0.008}
            data-testid="profit-net"
          />
        </div>
        
        <Thermometer
          value={0.78}
          label="Progress Billing On-Time"
          data-testid="thermometer-billing"
        />
        
        <div className="rounded-2xl bg-card/80 p-4 border border-card-border backdrop-blur-sm">
          <div className="text-sm text-muted-foreground mb-2">Alerts</div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
            <span>Pipeline schedule: 35% late</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <span>Payment difference: 65% late</span>
          </div>
        </div>
      </div>

      {/* Financial & Customer Concerns Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiTile
          icon={Banknote}
          label="Project Collections"
          value="$487,320"
          sub="Collected vs Outstanding"
          data-testid="kpi-project-collections"
          sparkline={
            <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '65%' }}></div>
              <div className="bg-chart-2 h-full" style={{ width: '35%' }}></div>
            </div>
          }
          bottomSlot={
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Collected: $316,758 (65%)</span>
              <span>Outstanding: $170,562 (35%)</span>
            </div>
          }
        />
        
        <KpiTile
          icon={Receipt}
          label="Collection Due"
          value="$89,450"
          sub="Jobs Completed"
          data-testid="kpi-collection-due"
          sparkline={
            <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
              <div className="bg-destructive h-full" style={{ width: '100%' }}></div>
            </div>
          }
          bottomSlot={
            <div className="text-xs text-muted-foreground">
              12 completed jobs awaiting payment
            </div>
          }
        />
        
        <KpiTile
          icon={AlertTriangle}
          label="Customer Concerns"
          value="17"
          sub="Active CCIs"
          data-testid="kpi-customer-concerns"
          sparkline={
            <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
              <div className="bg-chart-3 h-full" style={{ width: '45%' }}></div>
              <div className="bg-chart-4 h-full" style={{ width: '30%' }}></div>
              <div className="bg-destructive h-full" style={{ width: '25%' }}></div>
            </div>
          }
          bottomSlot={
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low: 8</span>
              <span>Med: 5</span>
              <span>High: 4</span>
            </div>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <SalesGoalsChart onSelectionChange={setSelectedSalesReps} />
        <ARAgingChart />
        <CapacityChart />
      </div>
    </div>
  );
}