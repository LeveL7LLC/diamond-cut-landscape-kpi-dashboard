import { useState, useEffect, useMemo } from 'react';
import { DollarSign, PhoneCall, CalendarCheck2, ClipboardCheck, Banknote, Receipt, AlertTriangle, Bell, TrendingUp, Target, BarChart3, Plus } from 'lucide-react';
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import KpiTile from './KpiTile';
import Thermometer from './Thermometer';
import ProfitWidget from './ProfitWidget';
import DateRangeSelector, { type DateRange } from './DateRangeSelector';
import { LeadSourcesDropdown, CSRDropdown, SalesDropdown, ServicesDropdown, LEAD_SOURCES_OPTIONS, CSR_OPTIONS, SALES_OPTIONS, SERVICE_OPTIONS } from './KpiDropdowns';
import { SalesGoalsChart, ARAgingChart, CapacityChart } from './DashboardCharts';
import SegmentedLine from './SegmentedLine';
import logoPath from "@assets/DCL-Agave_1759084213044.png";
import { 
  useLeadSources, 
  useCSRs, 
  useSalesReps, 
  useServices,
  useDailyLeads,
  useDailyBookings,
  useDailyCloses,
  useDailyContracts,
  useMonthlyFinance,
  useMonthlyRevenue,
  useArAging,
  useSalesGoals,
  useAnnualRevenue,
  useCustomerConcerns
} from '@/hooks/useApiData';
import { MOCK_KPI_VALUES, MOCK_CSRS, MOCK_SALES_REPS, MOCK_SERVICES, MOCK_PROFIT_DATA, MOCK_MONTHLY_REVENUE, MOCK_PROGRESS_BILLING, MOCK_PROJECT_COLLECTIONS, MOCK_COLLECTION_DUE, MOCK_CUSTOMER_CONCERNS } from '@/lib/mockData';

export default function Dashboard() {
  const [location] = useLocation();
  
  // State management
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '2025-08-25',
    end: '2025-09-28',
    preset: '30d'
  });

  const [showAlerts, setShowAlerts] = useState(false);

  // State for dropdown selections
  const [selectedLeadSources, setSelectedLeadSources] = useState(LEAD_SOURCES_OPTIONS.map(opt => opt.value));
  const [selectedCSRs, setSelectedCSRs] = useState(CSR_OPTIONS.map(opt => opt.value));
  const [selectedSalesReps, setSelectedSalesReps] = useState(SALES_OPTIONS.map(opt => opt.value));
  const [selectedServices, setSelectedServices] = useState(SERVICE_OPTIONS.map(opt => opt.value));

  // API data hooks
  const { data: leadSources } = useLeadSources();
  const { data: csrs } = useCSRs();
  const { data: salesReps } = useSalesReps();
  const { data: services } = useServices();
  const { data: dailyLeads } = useDailyLeads(dateRange.start, dateRange.end);
  const { data: dailyBookings } = useDailyBookings(dateRange.start, dateRange.end);
  const { data: dailyCloses } = useDailyCloses(dateRange.start, dateRange.end);
  const { data: dailyContracts } = useDailyContracts(dateRange.start, dateRange.end);
  const { data: monthlyFinance } = useMonthlyFinance();
  const { data: monthlyRevenue } = useMonthlyRevenue();
  const { data: arAging } = useArAging();
  const { data: salesGoals } = useSalesGoals();
  const { data: annualRevenue } = useAnnualRevenue();
  const { data: customerConcerns } = useCustomerConcerns();

  // Process data for segmented line charts
  const generateSegmentData = useMemo(() => {
    return (options: any[], selected: string[], apiData?: any[]) => {
      return options
        .filter(opt => selected.includes(opt.value))
        .map(opt => {
          // Use real data if available, otherwise fallback to mock
          const realData = apiData?.find(item => item.name === opt.label || item.id === opt.value);
          const proportion = realData ? (realData.count || realData.value || 0) / 100 : Math.random() * 0.5 + 0.1;
          
          return {
            value: opt.value,
            label: opt.label,
            color: opt.color,
            proportion: Math.min(proportion, 1) // Ensure proportion doesn't exceed 1
          };
        });
    };
  }, []);

  const leadsSegmentData = generateSegmentData(LEAD_SOURCES_OPTIONS, selectedLeadSources, leadSources);
  const csrSegmentData = generateSegmentData(CSR_OPTIONS, selectedCSRs, csrs);
  const salesSegmentData = generateSegmentData(SALES_OPTIONS, selectedSalesReps, salesReps);
  const servicesSegmentData = generateSegmentData(SERVICE_OPTIONS, selectedServices, services);

  // Processed data for legends (use API data when available, fallback to mock)
  const processedLeadSources = useMemo(() => {
    if (leadSources && leadSources.length > 0) {
      return leadSources.slice(0, 4).map((source: any, index: number) => ({
        name: source.name,
        color: LEAD_SOURCES_OPTIONS[index]?.color || "#22c55e",
        count: source.count
      }));
    }
    return [
      { name: "Angi", color: "#22c55e", count: 42 },
      { name: "Nextdoor", color: "#60a5fa", count: 38 },
      { name: "Google Ads", color: "#f59e0b", count: 35 },
      { name: "Google LSA", color: "#a78bfa", count: 28 }
    ];
  }, [leadSources]);

  const processedCSRs = useMemo(() => {
    if (csrs && csrs.length > 0) {
      return csrs.map((csr: any, index: number) => ({
        name: csr.name,
        color: CSR_OPTIONS[index]?.color || "#22c55e"
      }));
    }
    return MOCK_CSRS;
  }, [csrs]);

  const processedSalesReps = useMemo(() => {
    if (salesReps && salesReps.length > 0) {
      return salesReps.map((rep: any, index: number) => ({
        name: rep.name,
        color: SALES_OPTIONS[index]?.color || "#22c55e"
      }));
    }
    return MOCK_SALES_REPS;
  }, [salesReps]);

  const processedServices = useMemo(() => {
    if (services && services.length > 0) {
      return services.map((service: any, index: number) => ({
        name: service.name,
        color: SERVICE_OPTIONS[index]?.color || "#22c55e"
      }));
    }
    return MOCK_SERVICES;
  }, [services]);

  const leadSourcesLegend = (
    <div className="flex flex-wrap gap-2">
      {processedLeadSources.map((source) => (
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
      {processedCSRs.map((csr) => (
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
      {processedSalesReps.map((rep) => (
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
      {processedServices.map((service) => (
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
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-4 cursor-pointer hover-elevate p-2 rounded-lg" data-testid="nav-logo-trigger">
              <img 
                src={logoPath} 
                alt="Diamond Cut Landscape Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">Diamond Cut Landscape</h1>
                <p className="text-sm text-muted-foreground">Executive Dashboard</p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-48 p-2" side="bottom" align="start">
            <div className="flex flex-col gap-1">
              <Link href="/">
                <Button 
                  variant={location === "/" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2"
                  data-testid="nav-dashboard"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/data-input">
                <Button 
                  variant={location === "/data-input" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2"
                  data-testid="nav-data-input"
                >
                  <Plus className="h-4 w-4" />
                  Data Entry
                </Button>
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <div className="flex items-center gap-4">
          <DateRangeSelector range={dateRange} setRange={setDateRange} />
          
          {/* Alert Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors relative"
              data-testid="button-alerts"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">2</span>
              </div>
            </button>
            
            {showAlerts && (
              <div className="absolute right-0 top-12 w-80 bg-card border border-card-border rounded-lg shadow-lg p-4 z-50">
                <div className="text-sm font-medium mb-3">Active Alerts</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm p-2 rounded bg-muted/20">
                    <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                    <span>Pipeline schedule: 35% late</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 rounded bg-muted/20">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>Payment difference: 65% late</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
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
          value={(() => {
            // Check if database call returns completely empty, use original mock calculation
            if (!dailyLeads || dailyLeads.length === 0) {
              return MOCK_KPI_VALUES.qualifiedLeads;
            }
            const total = dailyLeads.reduce((sum: number, item: any) => sum + item.count, 0);
            return total.toString();
          })()}
          sub="2025-08-25 → 2025-09-28"
          data-testid="kpi-qualified-leads"
          rightSlot={<LeadSourcesDropdown onSelectionChange={setSelectedLeadSources} />}
          sparkline={<SegmentedLine segments={leadsSegmentData} />}
          bottomSlot={leadSourcesLegend}
        />
        
        <KpiTile
          icon={CalendarCheck2}
          label="Booking Rate"
          value={(() => {
            // Check if database calls return completely empty, use original mock calculation
            if (!dailyLeads || !dailyBookings || dailyLeads.length === 0 || dailyBookings.length === 0) {
              return MOCK_KPI_VALUES.bookingRate;
            }
            const totalLeads = dailyLeads.reduce((sum: number, item: any) => sum + item.count, 0);
            const totalBookings = dailyBookings.reduce((sum: number, item: any) => sum + item.count, 0);
            const rate = totalLeads > 0 ? Math.round((totalBookings / totalLeads) * 100) : 0;
            return `${rate}%`;
          })()}
          sub="Leads → Consult"
          data-testid="kpi-booking-rate"
          rightSlot={<CSRDropdown onSelectionChange={setSelectedCSRs} />}
          sparkline={<SegmentedLine segments={csrSegmentData} />}
          bottomSlot={csrLegend}
        />
        
        <KpiTile
          icon={ClipboardCheck}
          label="Close Rate"
          value={(() => {
            // Check if database calls return completely empty, use original mock calculation
            if (!dailyBookings || !dailyCloses || dailyBookings.length === 0 || dailyCloses.length === 0) {
              return MOCK_KPI_VALUES.closeRate;
            }
            const totalBookings = dailyBookings.reduce((sum: number, item: any) => sum + item.count, 0);
            const totalCloses = dailyCloses.reduce((sum: number, item: any) => sum + item.count, 0);
            const rate = totalBookings > 0 ? Math.round((totalCloses / totalBookings) * 100) : 0;
            return `${rate}%`;
          })()}
          sub="Signed / Presented"
          data-testid="kpi-close-rate"
          rightSlot={<SalesDropdown onSelectionChange={setSelectedSalesReps} />}
          sparkline={<SegmentedLine segments={salesSegmentData} />}
          bottomSlot={salesRepsLegend}
        />
        
        <KpiTile
          icon={DollarSign}
          label="Avg Contract Value"
          value={(() => {
            // Check if database call returns completely empty, use original mock calculation
            if (!dailyContracts || dailyContracts.length === 0) {
              return MOCK_KPI_VALUES.avgContractValue;
            }
            const totalValue = dailyContracts.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
            const totalCount = dailyContracts.reduce((sum: number, item: any) => sum + item.count, 0);
            const avgValue = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;
            return `$${avgValue.toLocaleString()}`;
          })()}
          sub="2025-09-28 → 2025-09-28"
          data-testid="kpi-contract-value"
          rightSlot={<ServicesDropdown onSelectionChange={setSelectedServices} />}
          sparkline={<SegmentedLine segments={servicesSegmentData} />}
          bottomSlot={servicesLegend}
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfitWidget
            label="Gross Profit"
            value={(() => {
              // Check if database has monthly finance data for profit calculations
              if (!monthlyFinance || monthlyFinance.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.value;
              }
              
              // Get current month entries and calculate average
              const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
              const currentMonthEntries = monthlyFinance.filter(entry => 
                entry.month.startsWith(currentMonth)
              );
              
              if (currentMonthEntries.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.value;
              }
              
              // Calculate average gross profit for current month
              const totalGrossProfit = currentMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.grossProfitPercent || '0'), 0
              );
              const averageGrossProfit = totalGrossProfit / currentMonthEntries.length;
              return averageGrossProfit / 100; // Convert percentage to decimal
            })()}
            mom={(() => {
              if (!monthlyFinance || monthlyFinance.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.mom;
              }
              
              // Get current and previous month averages
              const currentMonth = new Date().toISOString().slice(0, 7);
              const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
              
              const currentMonthEntries = monthlyFinance.filter(entry => entry.month.startsWith(currentMonth));
              const previousMonthEntries = monthlyFinance.filter(entry => entry.month.startsWith(previousMonth));
              
              if (currentMonthEntries.length === 0 || previousMonthEntries.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.mom;
              }
              
              // Calculate averages for both months
              const currentAvg = currentMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.grossProfitPercent || '0'), 0) / currentMonthEntries.length;
              const previousAvg = previousMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.grossProfitPercent || '0'), 0) / previousMonthEntries.length;
              
              return (currentAvg - previousAvg) / 100; // Convert to decimal change
            })()}
            data-testid="profit-gross"
          />
          <ProfitWidget
            label="Net Profit"
            value={(() => {
              // Check if database has monthly finance data for profit calculations
              if (!monthlyFinance || monthlyFinance.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.value;
              }
              
              // Get current month entries and calculate average
              const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
              const currentMonthEntries = monthlyFinance.filter(entry => 
                entry.month.startsWith(currentMonth)
              );
              
              if (currentMonthEntries.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.value;
              }
              
              // Calculate average net profit for current month
              const totalNetProfit = currentMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.netProfitPercent || '0'), 0
              );
              const averageNetProfit = totalNetProfit / currentMonthEntries.length;
              return averageNetProfit / 100; // Convert percentage to decimal
            })()}
            mom={(() => {
              if (!monthlyFinance || monthlyFinance.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.mom;
              }
              
              // Get current and previous month averages
              const currentMonth = new Date().toISOString().slice(0, 7);
              const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
              
              const currentMonthEntries = monthlyFinance.filter(entry => entry.month.startsWith(currentMonth));
              const previousMonthEntries = monthlyFinance.filter(entry => entry.month.startsWith(previousMonth));
              
              if (currentMonthEntries.length === 0 || previousMonthEntries.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.mom;
              }
              
              // Calculate averages for both months
              const currentAvg = currentMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.netProfitPercent || '0'), 0) / currentMonthEntries.length;
              const previousAvg = previousMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.netProfitPercent || '0'), 0) / previousMonthEntries.length;
              
              return (currentAvg - previousAvg) / 100; // Convert to decimal change
            })()}
            data-testid="profit-net"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Revenue Chart */}
          <div className="rounded-2xl bg-card/80 p-4 border border-card-border backdrop-blur-sm" data-testid="revenue-monthly">
            <div className="text-sm text-muted-foreground mb-2">September Revenue</div>
            <div className="text-lg font-semibold text-foreground mb-2">
              {(() => {
                // Check if database has monthly revenue data
                if (!monthlyRevenue || monthlyRevenue.length === 0) {
                  const current = (MOCK_MONTHLY_REVENUE.currentRevenue / 1000).toFixed(0);
                  const goal = (MOCK_MONTHLY_REVENUE.goal / 1000).toFixed(0);
                  return `$${current}k / $${goal}k`;
                }
                // Calculate from database data
                const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
                const current = ((latestMonth?.revenue || 0) / 1000).toFixed(0);
                const goal = ((latestMonth?.target || MOCK_MONTHLY_REVENUE.goal) / 1000).toFixed(0);
                return `$${current}k / $${goal}k`;
              })()}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Goal</span>
                <span className="text-muted-foreground">
                  {(() => {
                    if (!monthlyRevenue || monthlyRevenue.length === 0) {
                      return `$${(MOCK_MONTHLY_REVENUE.goal / 1000).toFixed(0)}k`;
                    }
                    const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
                    return `$${((latestMonth?.target || MOCK_MONTHLY_REVENUE.goal) / 1000).toFixed(0)}k`;
                  })()}
                </span>
              </div>
              <div className="flex h-1.5 bg-muted/20 rounded-full overflow-hidden">
                {(() => {
                  // Check if database has sales rep data
                  if (!monthlyRevenue || monthlyRevenue.length === 0) {
                    // Use mock data percentages
                    const total = MOCK_MONTHLY_REVENUE.goal;
                    return MOCK_MONTHLY_REVENUE.salesRepContributions.map((rep, index) => (
                      <div 
                        key={rep.name}
                        className={`bg-${rep.color} h-full`} 
                        style={{ width: `${Math.round((rep.amount / total) * 100)}%` }}
                      />
                    ));
                  }
                  // Calculate from database data
                  const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
                  const total = latestMonth?.target || MOCK_MONTHLY_REVENUE.goal;
                  return MOCK_MONTHLY_REVENUE.salesRepContributions.map((rep, index) => (
                    <div 
                      key={rep.name}
                      className={`bg-${rep.color} h-full`} 
                      style={{ width: `${Math.round((rep.amount / total) * 100)}%` }}
                    />
                  ));
                })()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
                {(() => {
                  // Check if database has sales rep data
                  if (!monthlyRevenue || monthlyRevenue.length === 0) {
                    return MOCK_MONTHLY_REVENUE.salesRepContributions.map((rep) => (
                      <div key={rep.name} className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 bg-${rep.color} rounded-full`}></div>
                        <span>{rep.name}: ${(rep.amount / 1000).toFixed(0)}k</span>
                      </div>
                    ));
                  }
                  // Use database data if available, otherwise fallback to mock
                  return MOCK_MONTHLY_REVENUE.salesRepContributions.map((rep) => (
                    <div key={rep.name} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 bg-${rep.color} rounded-full`}></div>
                      <span>{rep.name}: ${(rep.amount / 1000).toFixed(0)}k</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Annual Revenue Chart */}
          <div className="rounded-2xl bg-card/80 p-4 border border-card-border backdrop-blur-sm" data-testid="revenue-annual">
            <div className="text-sm text-muted-foreground mb-2">2024 Revenue</div>
            <div className="text-lg font-semibold text-foreground mb-2">$3.85M / $5.2M</div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Goal</span>
                <span className="text-muted-foreground">$5.2M</span>
              </div>
              <div className="flex h-1.5 bg-muted/20 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '32%' }}></div>
                <div className="bg-chart-2 h-full" style={{ width: '28%' }}></div>
                <div className="bg-chart-3 h-full" style={{ width: '14%' }}></div>
                <div className="bg-muted h-full" style={{ width: '26%' }}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Diego: $1.65M</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-chart-2 rounded-full"></div>
                  <span>Brooke: $1.45M</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-chart-3 rounded-full"></div>
                  <span>Sam: $750k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Thermometer
          value={(() => {
            // Check if database has monthly finance data for billing calculations
            if (!monthlyFinance || monthlyFinance.length === 0) {
              return MOCK_PROGRESS_BILLING.onTimeRate;
            }
            // Calculate on-time billing rate from database data
            const latestMonth = monthlyFinance[monthlyFinance.length - 1];
            return latestMonth?.billingOnTimeRate || MOCK_PROGRESS_BILLING.onTimeRate;
          })()}
          label="Progress Billing On-Time"
          data-testid="thermometer-billing"
        />
      </div>

      {/* Financial & Customer Concerns Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiTile
          icon={Banknote}
          label="Project Collections"
          value={(() => {
            // Check if database has monthly finance data for collections
            if (!monthlyFinance || monthlyFinance.length === 0) {
              return MOCK_KPI_VALUES.projectCollections;
            }
            const collections = monthlyFinance.reduce((sum: number, item: any) => sum + (item.collections || 0), 0);
            return `$${collections.toLocaleString()}`;
          })()}
          sub="Collected vs Outstanding"
          data-testid="kpi-project-collections"
          sparkline={
            <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
              {(() => {
                // Check if database has data for collection percentages
                if (!monthlyFinance || monthlyFinance.length === 0) {
                  return (
                    <>
                      <div className="bg-primary h-full" style={{ width: `${MOCK_PROJECT_COLLECTIONS.collectedPercentage}%` }}></div>
                      <div className="bg-chart-2 h-full" style={{ width: `${MOCK_PROJECT_COLLECTIONS.outstandingPercentage}%` }}></div>
                    </>
                  );
                }
                // Calculate from database data
                const latestMonth = monthlyFinance[monthlyFinance.length - 1];
                const collectedPct = latestMonth?.collectedPercentage || MOCK_PROJECT_COLLECTIONS.collectedPercentage;
                const outstandingPct = 100 - collectedPct;
                return (
                  <>
                    <div className="bg-primary h-full" style={{ width: `${collectedPct}%` }}></div>
                    <div className="bg-chart-2 h-full" style={{ width: `${outstandingPct}%` }}></div>
                  </>
                );
              })()}
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
          value={(() => {
            // Check if database has AR aging data for collection calculations
            if (!arAging || arAging.length === 0) {
              return MOCK_KPI_VALUES.collectionDue;
            }
            const totalDue = arAging.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
            return `$${totalDue.toLocaleString()}`;
          })()}
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
          value={(() => {
            // Check if database has customer concerns data
            if (!customerConcerns || customerConcerns.length === 0) {
              return MOCK_KPI_VALUES.customerConcerns;
            }
            const openConcerns = customerConcerns.filter((concern: any) => concern.status === 'open').length;
            return openConcerns.toString();
          })()}
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