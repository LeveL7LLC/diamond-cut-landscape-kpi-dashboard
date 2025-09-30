import { useState, useEffect, useMemo, useCallback } from 'react';
import { DollarSign, PhoneCall, CalendarCheck2, ClipboardCheck, Banknote, Receipt, AlertTriangle, Bell, TrendingUp, Target, BarChart3, Plus, Database } from 'lucide-react';
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  
  // State management - Initialize with proper 30-day range ending yesterday
  const initRange = (days: number): DateRange => {
    const end = new Date();
    end.setDate(end.getDate() - 1); // Set end to yesterday (previous day)
    const start = new Date();
    start.setDate(end.getDate() - (days - 1)); // Adjust start to maintain the correct number of days
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      preset: (days + 'd') as '7d' | '30d' | '90d'
    };
  };

  const [dateRange, setDateRange] = useState<DateRange>(initRange(30));

  const [showAlerts, setShowAlerts] = useState(false);
  
  // Navigation menu state for mobile-friendly behavior
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);

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

  const monthlyFinanceData = Array.isArray(monthlyFinance) ? monthlyFinance : [];
  const salesGoalsData = Array.isArray(salesGoals) ? salesGoals : [];
  const arAgingData = Array.isArray(arAging) ? arAging : [];
  const customerConcernsData = Array.isArray(customerConcerns) ? customerConcerns : [];

  // Process data for segmented line charts
  const generateSegmentData = useCallback((options: any[], selected: string[], apiData?: any[]) => {
    // Consistent mock proportions for each option type
    const mockProportions: { [key: string]: number } = {
      'angi': 0.35,
      'nextdoor': 0.25,
      'google-ads': 0.20,
      'google-lsa': 0.20,
      'postcards': 0.15,
      'website': 0.10,
      'ava': 0.30,
      'marco': 0.25,
      'tia': 0.25,
      'jordan': 0.20,
      'diego': 0.30,
      'brooke': 0.25,
      'sam': 0.25,
      'lena': 0.20,
      'hardscapes': 0.35,
      'planting': 0.25,
      'irrigation': 0.20,
      'lighting': 0.15,
      'pergolas': 0.15,
      'water-features': 0.10,
      'turf': 0.10
    };

    return options
      .filter(opt => selected.includes(opt.value))
      .map(opt => {
        // Use real data if available and valid, otherwise fallback to consistent mock
        const realData = apiData?.find(item => 
          item.name === opt.label || 
          item.id === opt.value ||
          item.name?.toLowerCase().replace(/\s+/g, '-') === opt.value
        );
        
        let proportion = mockProportions[opt.value] || 0.15;
        
        if (realData) {
          const dataValue = realData.count || realData.value || realData.amount || 0;
          if (typeof dataValue === 'number' && !isNaN(dataValue) && dataValue > 0) {
            // Use a reasonable scaling factor - adjust based on your data range
            proportion = Math.min(dataValue / 100, 1); // Cap at 100%
          }
        }
        
        return {
          value: opt.value,
          label: opt.label,
          color: opt.color,
          proportion: Math.min(proportion, 1) // Ensure proportion doesn't exceed 1
        };
      });
  }, []);

  const leadsSegmentData = useMemo(() => 
    generateSegmentData(LEAD_SOURCES_OPTIONS, selectedLeadSources, leadSources), 
    [generateSegmentData, selectedLeadSources, leadSources]
  );
  
  const csrSegmentData = useMemo(() => 
    generateSegmentData(CSR_OPTIONS, selectedCSRs, csrs), 
    [generateSegmentData, selectedCSRs, csrs]
  );
  
  const salesSegmentData = useMemo(() => 
    generateSegmentData(SALES_OPTIONS, selectedSalesReps, salesReps), 
    [generateSegmentData, selectedSalesReps, salesReps]
  );
  
  const servicesSegmentData = useMemo(() => 
    generateSegmentData(SERVICE_OPTIONS, selectedServices, services), 
    [generateSegmentData, selectedServices, services]
  );

  // Filtered data calculations for KPI tiles
  const filteredLeadsTotal = useMemo(() => {
    if (!dailyLeads || dailyLeads.length === 0) {
      return MOCK_KPI_VALUES.qualifiedLeads;
    }
    
    // Since the database uses IDs, we need to match leadSourceId with actual lead source names
    const filteredData = dailyLeads.filter((item: any) => {
      if (item.leadSourceId && leadSources && leadSources.length > 0) {
        // Find the lead source by ID
        const leadSource = leadSources.find((source: any) => source.id === item.leadSourceId);
        if (leadSource) {
          const sourceName = leadSource.name?.toLowerCase().replace(/\s+/g, '-');
          return selectedLeadSources.includes(sourceName);
        }
      }
      
      // Fallback: if no leadSourceId matching, include all items when all sources are selected
      return selectedLeadSources.length === LEAD_SOURCES_OPTIONS.length;
    });
    
    const total = filteredData.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
    return total.toString();
  }, [dailyLeads, selectedLeadSources, leadSources]);

  const filteredBookingRate = useMemo(() => {
    if (!dailyBookings || dailyBookings.length === 0) {
      return MOCK_KPI_VALUES.bookingRate;
    }
    
    // Filter bookings by selected CSRs - this data contains both leads and appointments per CSR
    const filteredBookings = dailyBookings.filter((item: any) => {
      if (item.csrId && csrs && csrs.length > 0) {
        const csr = csrs.find((c: any) => c.id === item.csrId);
        if (csr) {
          const csrName = csr.name?.toLowerCase().replace(/\s+/g, '-');
          return selectedCSRs.includes(csrName);
        }
      }
      return selectedCSRs.length === CSR_OPTIONS.length;
    });
    
    const totalLeads = filteredBookings.reduce((sum: number, item: any) => sum + (item.leads || 0), 0);
    const totalAppointments = filteredBookings.reduce((sum: number, item: any) => sum + (item.appointments || 0), 0);
    const rate = totalLeads > 0 ? Math.round((totalAppointments / totalLeads) * 100) : 0;
    return `${rate}%`;
  }, [dailyBookings, selectedCSRs, csrs]);

  // Separate calculation for booking rate total leads (for validation display)
  const filteredBookingLeads = useMemo(() => {
    if (!dailyBookings || dailyBookings.length === 0) {
      return 0;
    }
    
    const filteredBookings = dailyBookings.filter((item: any) => {
      if (item.csrId && csrs && csrs.length > 0) {
        const csr = csrs.find((c: any) => c.id === item.csrId);
        if (csr) {
          const csrName = csr.name?.toLowerCase().replace(/\s+/g, '-');
          return selectedCSRs.includes(csrName);
        }
      }
      return selectedCSRs.length === CSR_OPTIONS.length;
    });
    
    return filteredBookings.reduce((sum: number, item: any) => sum + (item.leads || 0), 0);
  }, [dailyBookings, selectedCSRs, csrs]);

  const filteredCloseRate = useMemo(() => {
    if (!dailyBookings || !dailyCloses || dailyBookings.length === 0 || dailyCloses.length === 0) {
      return MOCK_KPI_VALUES.closeRate;
    }
    
    const filteredCloses = dailyCloses.filter((item: any) => {
      if (item.salesRepId && salesReps && salesReps.length > 0) {
        const salesRep = salesReps.find((rep: any) => rep.id === item.salesRepId);
        if (salesRep) {
          const repName = salesRep.name?.toLowerCase().replace(/\s+/g, '-');
          return selectedSalesReps.includes(repName);
        }
      }
      return selectedSalesReps.length === SALES_OPTIONS.length;
    });
    
    const totalBookings = dailyBookings.reduce((sum: number, item: any) => sum + (item.appointments || 0), 0);
    const totalCloses = filteredCloses.reduce((sum: number, item: any) => sum + (item.signed || 0), 0);
    const rate = totalBookings > 0 ? Math.round((totalCloses / totalBookings) * 100) : 0;
    return `${rate}%`;
  }, [dailyBookings, dailyCloses, selectedSalesReps, salesReps]);

  const filteredContractValue = useMemo(() => {
    if (!dailyContracts || dailyContracts.length === 0) {
      return MOCK_KPI_VALUES.avgContractValue;
    }
    
    const filteredContracts = dailyContracts.filter((item: any) => {
      if (item.serviceId && services && services.length > 0) {
        const service = services.find((s: any) => s.id === item.serviceId);
        if (service) {
          const serviceName = service.name?.toLowerCase().replace(/\s+/g, '-');
          return selectedServices.includes(serviceName);
        }
      }
      return selectedServices.length === SERVICE_OPTIONS.length;
    });
    
    const totalValue = filteredContracts.reduce((sum: number, item: any) => sum + parseFloat(item.amount || '0'), 0);
    const totalCount = filteredContracts.length;
    const avgValue = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;
    return `$${avgValue.toLocaleString()}`;
  }, [dailyContracts, selectedServices, services]);

  // Processed data for legends (use API data when available, fallback to mock)
  const processedLeadSources = useMemo(() => {
    const allSources = leadSources && leadSources.length > 0 
      ? leadSources.slice(0, 4).map((source: any, index: number) => ({
          name: source.name,
          value: source.name.toLowerCase().replace(/\s+/g, '-'),
          color: LEAD_SOURCES_OPTIONS[index]?.color || "#22c55e",
          count: source.count
        }))
      : [
          { name: "Angi", value: "angi", color: "#22c55e", count: 42 },
          { name: "Nextdoor", value: "nextdoor", color: "#60a5fa", count: 38 },
          { name: "Google Ads", value: "google-ads", color: "#f59e0b", count: 35 },
          { name: "Google LSA", value: "google-lsa", color: "#a78bfa", count: 28 }
        ];
    
    // Filter based on selected values
    return allSources.filter(source => selectedLeadSources.includes(source.value));
  }, [leadSources, selectedLeadSources]);

  const processedCSRs = useMemo(() => {
    const allCSRs = csrs && csrs.length > 0 
      ? csrs.map((csr: any, index: number) => ({
          name: csr.name,
          value: csr.name.toLowerCase().replace(/\s+/g, '-'),
          color: CSR_OPTIONS[index]?.color || "#22c55e"
        }))
      : MOCK_CSRS.map(csr => ({
          ...csr,
          value: csr.name.toLowerCase().replace(/\s+/g, '-')
        }));
    
    // Filter based on selected values
    return allCSRs.filter(csr => selectedCSRs.includes(csr.value));
  }, [csrs, selectedCSRs]);

  const processedSalesReps = useMemo(() => {
    const allSalesReps = salesReps && salesReps.length > 0 
      ? salesReps.map((rep: any, index: number) => ({
          name: rep.name,
          value: rep.name.toLowerCase().replace(/\s+/g, '-'),
          color: SALES_OPTIONS[index]?.color || "#22c55e"
        }))
      : MOCK_SALES_REPS.map(rep => ({
          ...rep,
          value: rep.name.toLowerCase().replace(/\s+/g, '-')
        }));
    
    // Filter based on selected values
    return allSalesReps.filter(rep => selectedSalesReps.includes(rep.value));
  }, [salesReps, selectedSalesReps]);

  const processedServices = useMemo(() => {
    const allServices = services && services.length > 0 
      ? services.map((service: any, index: number) => ({
          name: service.name,
          value: service.name.toLowerCase().replace(/\s+/g, '-'),
          color: SERVICE_OPTIONS[index]?.color || "#22c55e"
        }))
      : MOCK_SERVICES.map(service => ({
          ...service,
          value: service.name.toLowerCase().replace(/\s+/g, '-')
        }));
    
    // Filter based on selected values
    return allServices.filter(service => selectedServices.includes(service.value));
  }, [services, selectedServices]);

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

  // Navigation menu handlers for mobile-friendly behavior
  useEffect(() => {
    let hoverTimeout: NodeJS.Timeout;
    
    if (isNavHovered) {
      setIsNavOpen(true);
    } else {
      // Delay closing to allow moving to the popover content
      hoverTimeout = setTimeout(() => {
        setIsNavOpen(false);
      }, 150);
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [isNavHovered]);

  const handleNavMouseEnter = () => {
    setIsNavHovered(true);
  };

  const handleNavMouseLeave = () => {
    setIsNavHovered(false);
  };

  const handleNavClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Popover open={isNavOpen} onOpenChange={setIsNavOpen}>
          <PopoverTrigger asChild>
            <div 
              className="flex items-center gap-3 sm:gap-4 cursor-pointer hover-elevate p-2 rounded-lg" 
              data-testid="nav-logo-trigger"
              onMouseEnter={handleNavMouseEnter}
              onMouseLeave={handleNavMouseLeave}
              onClick={handleNavClick}
            >
              <img 
                src={logoPath} 
                alt="Diamond Cut Landscape Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Diamond Cut Landscape</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Executive Dashboard</p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-48 p-2 bg-neutral-900 border-neutral-700 text-white" 
            side="bottom" 
            align="start"
            onMouseEnter={handleNavMouseEnter}
            onMouseLeave={handleNavMouseLeave}
          >
            <div className="flex flex-col gap-1">
              <Link href="/">
                <Button 
                  variant={location === "/" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2 hover:bg-emerald-500/20 hover:text-emerald-100"
                  data-testid="nav-dashboard"
                  onClick={handleNavLinkClick}
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/data-input">
                <Button 
                  variant={location === "/data-input" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2 hover:bg-emerald-500/20 hover:text-emerald-100"
                  data-testid="nav-data-input"
                  onClick={handleNavLinkClick}
                >
                  <Plus className="h-4 w-4" />
                  Data Entry
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
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
          </div>
          
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Updated {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiTile
          icon={PhoneCall}
          label="Qualified Leads"
          value={filteredLeadsTotal}
          sub="2025-08-25 → 2025-09-28"
          data-testid="kpi-qualified-leads"
          rightSlot={<LeadSourcesDropdown selectedValues={selectedLeadSources} onSelectionChange={setSelectedLeadSources} />}
          sparkline={<SegmentedLine segments={leadsSegmentData} />}
          bottomSlot={leadSourcesLegend}
        />
        
        <KpiTile
          icon={CalendarCheck2}
          label="Booking Rate"
          value={filteredBookingRate}
          sub={`${filteredBookingLeads} Leads → Consult`}
          data-testid="kpi-booking-rate"
          rightSlot={<CSRDropdown selectedValues={selectedCSRs} onSelectionChange={setSelectedCSRs} />}
          sparkline={<SegmentedLine segments={csrSegmentData} />}
          bottomSlot={csrLegend}
        />
        
        <KpiTile
          icon={ClipboardCheck}
          label="Close Rate"
          value={filteredCloseRate}
          sub="Signed / Presented"
          data-testid="kpi-close-rate"
          rightSlot={<SalesDropdown selectedValues={selectedSalesReps} onSelectionChange={setSelectedSalesReps} />}
          sparkline={<SegmentedLine segments={salesSegmentData} />}
          bottomSlot={salesRepsLegend}
        />
        
        <KpiTile
          icon={DollarSign}
          label="Avg Contract Value"
          value={filteredContractValue}
          sub="2025-09-28 → 2025-09-28"
          data-testid="kpi-contract-value"
          rightSlot={<ServicesDropdown selectedValues={selectedServices} onSelectionChange={setSelectedServices} />}
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
              if (monthlyFinanceData.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.value;
              }
              
              // Get current month entries and calculate average
              const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
              const currentMonthEntries = monthlyFinanceData.filter(entry => 
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
              return averageGrossProfit; // Data is already in decimal format (0.48 = 48%)
            })()}
            mom={(() => {
              if (monthlyFinanceData.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.mom;
              }
              
              // Get current and previous month averages
              const currentMonth = new Date().toISOString().slice(0, 7);
              const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
              
              const currentMonthEntries = monthlyFinanceData.filter(entry => entry.month.startsWith(currentMonth));
              const previousMonthEntries = monthlyFinanceData.filter(entry => entry.month.startsWith(previousMonth));
              
              if (currentMonthEntries.length === 0 || previousMonthEntries.length === 0) {
                return MOCK_PROFIT_DATA.grossProfit.mom;
              }
              
              // Calculate averages for both months
              const currentAvg = currentMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.grossProfitPercent || '0'), 0) / currentMonthEntries.length;
              const previousAvg = previousMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.grossProfitPercent || '0'), 0) / previousMonthEntries.length;
              
              return (currentAvg - previousAvg); // Data is already in decimal format
            })()}
            data-testid="profit-gross"
          />
          <ProfitWidget
            label="Net Profit"
            value={(() => {
              // Check if database has monthly finance data for profit calculations
              if (monthlyFinanceData.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.value;
              }
              
              // Get current month entries and calculate average
              const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
              const currentMonthEntries = monthlyFinanceData.filter(entry => 
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
              return averageNetProfit; // Data is already in decimal format (0.16 = 16%)
            })()}
            mom={(() => {
              if (monthlyFinanceData.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.mom;
              }
              
              // Get current and previous month averages
              const currentMonth = new Date().toISOString().slice(0, 7);
              const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
              
              const currentMonthEntries = monthlyFinanceData.filter(entry => entry.month.startsWith(currentMonth));
              const previousMonthEntries = monthlyFinanceData.filter(entry => entry.month.startsWith(previousMonth));
              
              if (currentMonthEntries.length === 0 || previousMonthEntries.length === 0) {
                return MOCK_PROFIT_DATA.netProfit.mom;
              }
              
              // Calculate averages for both months
              const currentAvg = currentMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.netProfitPercent || '0'), 0) / currentMonthEntries.length;
              const previousAvg = previousMonthEntries.reduce((sum, entry) => 
                sum + parseFloat(entry.netProfitPercent || '0'), 0) / previousMonthEntries.length;
              
              return (currentAvg - previousAvg); // Data is already in decimal format
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
                // Check if database has sales goals data (this matches the Analytics > Goals tab)
                if (salesGoalsData.length === 0) {
                  const current = (MOCK_MONTHLY_REVENUE.currentRevenue / 1000).toFixed(0);
                  const goal = (MOCK_MONTHLY_REVENUE.goal / 1000).toFixed(0);
                  return `$${current}k / $${goal}k`;
                }
                // Calculate from sales goals data - filter for current month (September 2025)
                const currentMonth = new Date().toISOString().slice(0, 7); // "2025-09"
                const currentMonthGoals = salesGoalsData.filter(goal => goal.period.startsWith(currentMonth));
                const totalActual = currentMonthGoals.reduce((sum, goal) => sum + parseFloat(goal.actualAmount || '0'), 0);
                const totalGoal = currentMonthGoals.reduce((sum, goal) => sum + parseFloat(goal.goalAmount || '0'), 0);
                const current = (totalActual / 1000).toFixed(0);
                const goal = (totalGoal / 1000).toFixed(0);
                return `$${current}k / $${goal}k`;
              })()}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Goal</span>
                <span className="text-muted-foreground">
                  {(() => {
                    if (salesGoalsData.length === 0) {
                      return `$${(MOCK_MONTHLY_REVENUE.goal / 1000).toFixed(0)}k`;
                    }
                    const currentMonth = new Date().toISOString().slice(0, 7);
                    const currentMonthGoals = salesGoalsData.filter(goal => goal.period.startsWith(currentMonth));
                    const totalGoal = currentMonthGoals.reduce((sum, goal) => sum + parseFloat(goal.goalAmount || '0'), 0);
                    return `$${(totalGoal / 1000).toFixed(0)}k`;
                  })()}
                </span>
              </div>
              <div className="flex h-1.5 bg-muted/20 rounded-full overflow-hidden">
                {(() => {
                  // Check if database has sales goals data
                  if (salesGoalsData.length === 0) {
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
                  
                  // Calculate from sales goals data - filter for current month
                  const currentMonth = new Date().toISOString().slice(0, 7);
                  const currentMonthGoals = salesGoalsData.filter(goal => goal.period.startsWith(currentMonth));
                  const totalRevenue = currentMonthGoals.reduce((sum, goal) => sum + parseFloat(goal.actualAmount || '0'), 0);
                  const colors = ['primary', 'chart-2', 'chart-3', 'chart-4'];
                  
                  return currentMonthGoals.map((goal, index) => (
                    <div 
                      key={goal.id}
                      className={`bg-${colors[index % colors.length]} h-full`} 
                      style={{ width: `${Math.round((parseFloat(goal.actualAmount || '0') / totalRevenue) * 100)}%` }}
                    />
                  ));
                })()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
                {(() => {
                  // Check if database has sales goals data
                  if (salesGoalsData.length === 0 || !salesReps || salesReps.length === 0) {
                    return MOCK_MONTHLY_REVENUE.salesRepContributions.map((rep) => (
                      <div key={rep.name} className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 bg-${rep.color} rounded-full`}></div>
                        <span>{rep.name}: ${(rep.amount / 1000).toFixed(0)}k</span>
                      </div>
                    ));
                  }
                  
                  // Use actual sales goals data - filter for current month
                  const currentMonth = new Date().toISOString().slice(0, 7);
                  const currentMonthGoals = salesGoalsData.filter(goal => goal.period.startsWith(currentMonth));
                  const colors = ['primary', 'chart-2', 'chart-3', 'chart-4'];
                  
                  return currentMonthGoals.map((goalData, index) => {
                    const salesRep = salesReps.find(rep => rep.id === goalData.salesRepId);
                    const amount = parseFloat(goalData.actualAmount || '0');
                    return (
                      <div key={goalData.id} className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 bg-${colors[index % colors.length]} rounded-full`}></div>
                        <span>{salesRep?.name || 'Unknown'}: ${(amount / 1000).toFixed(0)}k</span>
                      </div>
                    );
                  });
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
            if (monthlyFinanceData.length === 0) {
              return MOCK_PROGRESS_BILLING.onTimeRate;
            }
            // Calculate on-time billing rate from database data
            const latestMonth = monthlyFinanceData[monthlyFinanceData.length - 1];
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
            // Calculate total collections from AR Aging data
            if (arAgingData.length === 0) {
              return MOCK_KPI_VALUES.projectCollections;
            }
            // Get the latest AR aging record
            const latestAging = arAgingData[0]; // Assuming sorted by date desc
            const totalOutstanding = parseFloat(latestAging.bucket030 || '0') + 
                                   parseFloat(latestAging.bucket3160 || '0') + 
                                   parseFloat(latestAging.bucket6190 || '0') + 
                                   parseFloat(latestAging.bucket90plus || '0');
            
            // Calculate total collections (using mock ratio for now - could be enhanced with actual collected data)
            const collectedRatio = 0.65; // 65% collected as shown in the bottom slot
            const totalCollected = totalOutstanding / (1 - collectedRatio) * collectedRatio;
            const totalProject = totalCollected + totalOutstanding;
            
            return `$${Math.round(totalProject).toLocaleString()}`;
          })()}
          sub="Collected vs Outstanding"
          data-testid="kpi-project-collections"
          sparkline={
            <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
              {(() => {
                // Check if database has data for collection percentages
                if (monthlyFinanceData.length === 0) {
                  return (
                    <>
                      <div className="bg-primary h-full" style={{ width: `${MOCK_PROJECT_COLLECTIONS.collectedPercentage}%` }}></div>
                      <div className="bg-chart-2 h-full" style={{ width: `${MOCK_PROJECT_COLLECTIONS.outstandingPercentage}%` }}></div>
                    </>
                  );
                }
                // Calculate from database data
                const latestMonth = monthlyFinanceData[monthlyFinanceData.length - 1];
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
              {(() => {
                if (arAgingData.length === 0) {
                  return (
                    <>
                      <span>Collected: $316,758 (65%)</span>
                      <span>Outstanding: $170,562 (35%)</span>
                    </>
                  );
                }
                const latestAging = arAgingData[0];
                const totalOutstanding = parseFloat(latestAging.bucket030 || '0') + 
                                       parseFloat(latestAging.bucket3160 || '0') + 
                                       parseFloat(latestAging.bucket6190 || '0') + 
                                       parseFloat(latestAging.bucket90plus || '0');
                
                const collectedRatio = 0.65;
                const totalCollected = totalOutstanding / (1 - collectedRatio) * collectedRatio;
                
                return (
                  <>
                    <span>Collected: ${Math.round(totalCollected).toLocaleString()} (65%)</span>
                    <span>Outstanding: ${Math.round(totalOutstanding).toLocaleString()} (35%)</span>
                  </>
                );
              })()}
            </div>
          }
        />
        
        <KpiTile
          icon={Receipt}
          label="Collection Due"
          value={(() => {
            // Check if database has AR aging data for collection calculations
            if (arAgingData.length === 0) {
              return MOCK_KPI_VALUES.collectionDue;
            }
            // Get the latest AR aging record and sum all buckets
            const latestAging = arAgingData[0]; // Assuming sorted by date desc
            const totalDue = parseFloat(latestAging.bucket030 || '0') + 
                           parseFloat(latestAging.bucket3160 || '0') + 
                           parseFloat(latestAging.bucket6190 || '0') + 
                           parseFloat(latestAging.bucket90plus || '0');
            return `$${Math.round(totalDue).toLocaleString()}`;
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
            if (customerConcernsData.length === 0) {
              return MOCK_KPI_VALUES.customerConcerns;
            }
            return customerConcernsData.length.toString();
          })()}
          sub="Total Concerns"
          data-testid="kpi-customer-concerns"
          sparkline={(() => {
            if (customerConcernsData.length === 0) {
              return (
                <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
                  <div className="bg-chart-3 h-full" style={{ width: '45%' }}></div>
                  <div className="bg-chart-4 h-full" style={{ width: '30%' }}></div>
                  <div className="bg-destructive h-full" style={{ width: '25%' }}></div>
                </div>
              );
            }
            
            const lowCount = customerConcernsData.filter((concern: any) => concern.priority === 'Low').length;
            const medCount = customerConcernsData.filter((concern: any) => concern.priority === 'Med').length;
            const highCount = customerConcernsData.filter((concern: any) => concern.priority === 'High').length;
            const total = customerConcernsData.length || 1;
            
            const lowPercent = (lowCount / total) * 100;
            const medPercent = (medCount / total) * 100;
            const highPercent = (highCount / total) * 100;
            
            return (
              <div className="flex h-2 bg-muted/20 rounded-full overflow-hidden">
                <div className="bg-chart-3 h-full" style={{ width: `${lowPercent}%` }}></div>
                <div className="bg-chart-4 h-full" style={{ width: `${medPercent}%` }}></div>
                <div className="bg-destructive h-full" style={{ width: `${highPercent}%` }}></div>
              </div>
            );
          })()}
          bottomSlot={(() => {
            if (customerConcernsData.length === 0) {
              return (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low: 8</span>
                  <span>Med: 5</span>
                  <span>High: 4</span>
                </div>
              );
            }
            
            const lowCount = customerConcernsData.filter((concern: any) => concern.priority === 'Low').length;
            const medCount = customerConcernsData.filter((concern: any) => concern.priority === 'Med').length;
            const highCount = customerConcernsData.filter((concern: any) => concern.priority === 'High').length;
            
            return (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low: {lowCount}</span>
                <span>Med: {medCount}</span>
                <span>High: {highCount}</span>
              </div>
            );
          })()}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <SalesGoalsChart selectedValues={selectedSalesReps} onSelectionChange={setSelectedSalesReps} />
        <ARAgingChart />
        <CapacityChart />
      </div>
    </div>
  );
}
