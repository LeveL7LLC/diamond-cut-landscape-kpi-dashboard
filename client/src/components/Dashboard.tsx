import { useState } from 'react';
import { DollarSign, PhoneCall, CalendarCheck2, ClipboardCheck } from 'lucide-react';
import KpiTile from './KpiTile';
import Thermometer from './Thermometer';
import ProfitWidget from './ProfitWidget';
import DateRangeSelector, { type DateRange } from './DateRangeSelector';
import LeadSourceSelector, { LEAD_SOURCES, type LeadSource } from './LeadSourceSelector';
import { LeadSourcesDropdown, CSRDropdown, SalesDropdown, ServicesDropdown } from './KpiDropdowns';
import { SalesGoalsChart, ARAgingChart, CapacityChart } from './DashboardCharts';
import Sparkline from './Sparkline';

export default function Dashboard() {
  // Mock state management //todo: remove mock functionality
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '2025-08-25',
    end: '2025-09-28',
    preset: '30d'
  });

  const [selectedSources, setSelectedSources] = useState<LeadSource[]>([...LEAD_SOURCES]);

  // Mock sparkline data //todo: remove mock functionality
  const generateSparklineData = (baseValue: number, points: number = 14) => {
    return Array.from({ length: points }, (_, i) => ({
      value: baseValue + (Math.sin(i / 3) * baseValue * 0.15) + (Math.random() - 0.5) * baseValue * 0.1,
      date: new Date(Date.now() - (points - i) * 86400000).toISOString().slice(0, 10)
    }));
  };

  const leadsSparklineData = generateSparklineData(380, 14);
  const bookingSparklineData = generateSparklineData(32, 14);
  const closeSparklineData = generateSparklineData(48, 14);
  const contractSparklineData = generateSparklineData(31103, 14);

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
          <LeadSourceSelector selected={selectedSources} setSelected={setSelectedSources} />
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
          rightSlot={<LeadSourcesDropdown />}
          sparkline={<Sparkline data={leadsSparklineData} color="#22c55e" />}
          bottomSlot={leadSourcesLegend}
        />
        
        <KpiTile
          icon={CalendarCheck2}
          label="Booking Rate"
          value="32%"
          sub="Leads → Consult"
          data-testid="kpi-booking-rate"
          rightSlot={<CSRDropdown />}
          sparkline={<Sparkline data={bookingSparklineData} color="#60a5fa" />}
          bottomSlot={csrLegend}
        />
        
        <KpiTile
          icon={ClipboardCheck}
          label="Close Rate"
          value="48%"
          sub="Signed / Presented"
          data-testid="kpi-close-rate"
          rightSlot={<SalesDropdown />}
          sparkline={<Sparkline data={closeSparklineData} color="#f59e0b" />}
          bottomSlot={salesRepsLegend}
        />
        
        <KpiTile
          icon={DollarSign}
          label="Avg Contract Value"
          value="$31,103"
          sub="2025-09-28 → 2025-09-28"
          data-testid="kpi-contract-value"
          rightSlot={<ServicesDropdown />}
          sparkline={<Sparkline data={contractSparklineData} color="#a78bfa" />}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <SalesGoalsChart />
        <ARAgingChart />
        <CapacityChart />
      </div>
    </div>
  );
}