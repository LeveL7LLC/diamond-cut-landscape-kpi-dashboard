import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { SalesDropdown } from './KpiDropdowns';
import { useState, useMemo } from 'react';
import { 
  useSalesGoals, 
  useArAging, 
  useMarginVariance, 
  useServices, 
  useWeeklyCapacity 
} from '@/hooks/useApiData';
import { MOCK_SALES_GOALS, MOCK_WEEKLY_CAPACITY, MOCK_AR_AGING, MOCK_MARGIN_VARIANCE, MOCK_SERVICE_MIX } from '@/lib/mockData';

// Mock data for demonstrations //todo: remove mock functionality

const COLORS = ['#22c55e', '#60a5fa', '#f59e0b', '#ef4444'];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
}

function ChartCard({ title, children, className = "", rightSlot }: ChartCardProps) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br from-card/90 via-card/80 to-card/70 p-4 border border-card-border backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-foreground/90">{title}</h3>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

interface SalesGoalsChartProps {
  onSelectionChange?: (selected: string[]) => void;
}

export function SalesGoalsChart({ onSelectionChange }: SalesGoalsChartProps = {}) {
  const { data: salesGoals } = useSalesGoals();
  
  const chartData = useMemo(() => {
    if (!salesGoals || salesGoals.length === 0) {
      return MOCK_SALES_GOALS; // fallback to centralized mock data
    }
    
    return salesGoals.map((goal: any) => ({
      name: goal.salesRep || new Date(goal.month).toLocaleDateString('en-US', { month: 'short' }),
      actual: goal.actualAmount || 0,
      goal: goal.goalAmount || 0
    }));
  }, [salesGoals]);

  return (
    <ChartCard 
      title="Sales Goals vs Actual ($)"
      rightSlot={
        <SalesDropdown 
          selectedValues={[]} 
          onSelectionChange={onSelectionChange || (() => {})} 
        />
      }
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Bar dataKey="actual" fill="#22c55e" name="Actual" radius={[4, 4, 0, 0]} />
          <Bar dataKey="goal" fill="#60a5fa" name="Goal" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}



export function ARAgingChart() {
  const [activeChart, setActiveChart] = useState<'ar-aging' | 'margin-variance' | 'service-mix'>('ar-aging');
  
  // API data hooks
  const { data: arAging } = useArAging();
  const { data: marginVariance } = useMarginVariance();
  const { data: services } = useServices();

  const chartButtons = [
    { id: 'ar-aging' as const, label: 'AR Aging' },
    { id: 'margin-variance' as const, label: 'Margin Variance' },
    { id: 'service-mix' as const, label: 'Service Mix' }
  ];

  // Process API data for charts
  const processedArAgingData = useMemo(() => {
    if (!arAging || arAging.length === 0) {
      return MOCK_AR_AGING; // fallback to centralized mock data
    }
    
    // Get the latest AR aging record and transform bucket data into chart format
    const latestAging = arAging[0]; // Assuming sorted by date desc
    const bucket030 = parseFloat(latestAging.bucket030 || '0');
    const bucket3160 = parseFloat(latestAging.bucket3160 || '0');
    const bucket6190 = parseFloat(latestAging.bucket6190 || '0');
    const bucket90plus = parseFloat(latestAging.bucket90plus || '0');
    
    const total = bucket030 + bucket3160 + bucket6190 + bucket90plus;
    
    return [
      { 
        name: "0-30", 
        value: total > 0 ? Math.round((bucket030 / total) * 100) : 0, 
        amount: bucket030 
      },
      { 
        name: "31-60", 
        value: total > 0 ? Math.round((bucket3160 / total) * 100) : 0, 
        amount: bucket3160 
      },
      { 
        name: "61-90", 
        value: total > 0 ? Math.round((bucket6190 / total) * 100) : 0, 
        amount: bucket6190 
      },
      { 
        name: "90+", 
        value: total > 0 ? Math.round((bucket90plus / total) * 100) : 0, 
        amount: bucket90plus 
      }
    ];
  }, [arAging]);

  const processedMarginVarianceData = useMemo(() => {
    if (!marginVariance || marginVariance.length === 0) {
      return MOCK_MARGIN_VARIANCE; // fallback to centralized mock data
    }
    
    // Group margin variance data by month and calculate averages
    const monthlyData: { [key: string]: { actualSum: number, bidSum: number, count: number } } = {};
    
    marginVariance.forEach((item: any) => {
      const date = new Date(item.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { actualSum: 0, bidSum: 0, count: 0 };
      }
      
      monthlyData[monthKey].actualSum += parseFloat(item.actualMargin || '0');
      monthlyData[monthKey].bidSum += parseFloat(item.bidMargin || '0');
      monthlyData[monthKey].count += 1;
    });
    
    // Convert to chart format with averages
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        actual: Math.round((data.actualSum / data.count) * 100) / 100,
        target: Math.round((data.bidSum / data.count) * 100) / 100
      }))
      .sort((a, b) => {
        // Sort by month chronologically
        const dateA = new Date(a.month + ' 2025');
        const dateB = new Date(b.month + ' 2025');
        return dateA.getTime() - dateB.getTime();
      });
  }, [marginVariance]);

  const processedServiceMixData = useMemo(() => {
    if (!services || services.length === 0) {
      return MOCK_SERVICE_MIX; // fallback to centralized mock data
    }
    
    const colors = ['#22c55e', '#60a5fa', '#f59e0b', '#a78bfa', '#ef4444'];
    return services.map((service: any, index: number) => ({
      name: service.name,
      value: service.percentage || Math.floor(Math.random() * 30) + 10,
      color: colors[index % colors.length]
    }));
  }, [services]);

  const renderChart = () => {
    switch (activeChart) {
      case 'ar-aging':
        return (
          <BarChart data={processedArAgingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
            />
            <Bar dataKey="amount" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'margin-variance':
        return (
          <LineChart data={processedMarginVarianceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${value}%`, '']}
            />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} name="Actual" />
            <Line type="monotone" dataKey="target" stroke="#60a5fa" strokeWidth={2} name="Target" />
          </LineChart>
        );
      
      case 'service-mix':
        return (
          <PieChart margin={{ top: 25, right: 20, left: 20, bottom: 60 }}>
            <Pie
              data={processedServiceMixData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              innerRadius={20}
            >
              {processedServiceMixData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: any) => [`${value}%`, 'Share']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="rect"
              wrapperStyle={{ paddingTop: '30px' }}
            />
          </PieChart>
        );
    }
  };

  const getTitle = () => {
    switch (activeChart) {
      case 'ar-aging': return 'AR Aging';
      case 'margin-variance': return 'Margin Variance (%)';
      case 'service-mix': return 'Service Mix (%)';
    }
  };

  return (
    <ChartCard 
      title={getTitle()}
      rightSlot={
        <div className="flex gap-1">
          {chartButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveChart(button.id)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                activeChart === button.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
              }`}
              data-testid={`button-chart-${button.id}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={200}>
        {renderChart()}
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CapacityChart() {
  const { data: weeklyCapacity } = useWeeklyCapacity();

  const processedCapacityData = useMemo(() => {
    if (!weeklyCapacity || weeklyCapacity.length === 0) {
      return MOCK_WEEKLY_CAPACITY; // fallback to centralized mock data
    }
    
    return weeklyCapacity.map((item: any) => ({
      week: new Date(item.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      capacity: parseInt(item.availableHours) || 0,
      utilization: parseInt(item.bookedHours) || 0
    }));
  }, [weeklyCapacity]);

  return (
    <ChartCard title="Weekly Capacity">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={processedCapacityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: any) => [`${value} hrs`, '']}
          />
          <Legend />
          <Area type="monotone" dataKey="capacity" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Capacity" />
          <Area type="monotone" dataKey="utilization" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.5} name="Utilization" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <SalesGoalsChart />
      <ARAgingChart />
      <CapacityChart />
    </div>
  );
}