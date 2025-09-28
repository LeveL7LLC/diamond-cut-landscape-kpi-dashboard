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
import { useState } from 'react';

// Mock data for demonstrations //todo: remove mock functionality
const salesGoalsData = [
  { name: "Diego", actual: 185, goal: 200 },
  { name: "Brooke", actual: 195, goal: 200 },
  { name: "Sam", actual: 210, goal: 200 },
  { name: "Lena", actual: 188, goal: 200 }
];

const arAgingData = [
  { name: "0-30", value: 65, amount: 65000 },
  { name: "31-60", value: 25, amount: 25000 },
  { name: "61-90", value: 8, amount: 8000 },
  { name: "90+", value: 2, amount: 2000 }
];

const capacityData = [
  { week: "Wk1", booked: 380, available: 360 },
  { week: "Wk2", booked: 340, available: 360 },
  { week: "Wk3", booked: 420, available: 360 },
  { week: "Wk4", booked: 300, available: 360 }
];

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
  return (
    <ChartCard 
      title="Sales Goals vs Actual ($)"
      rightSlot={
        <SalesDropdown onSelectionChange={onSelectionChange} />
      }
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={salesGoalsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="actual" fill="#22c55e" name="Actual" radius={[4, 4, 0, 0]} />
          <Bar dataKey="goal" fill="#60a5fa" name="Goal" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Additional mock data for new chart types
const marginVarianceData = [
  { month: "Jan", actual: 42, target: 45 },
  { month: "Feb", actual: 38, target: 45 },
  { month: "Mar", actual: 48, target: 45 },
  { month: "Apr", actual: 52, target: 45 },
  { month: "May", actual: 44, target: 45 },
  { month: "Jun", actual: 46, target: 45 }
];

const serviceMixData = [
  { name: "Hardscapes", value: 35, color: "#22c55e" },
  { name: "Planting", value: 25, color: "#60a5fa" },
  { name: "Irrigation", value: 20, color: "#f59e0b" },
  { name: "Lighting", value: 12, color: "#a78bfa" },
  { name: "Other", value: 8, color: "#ef4444" }
];

export function ARAgingChart() {
  const [activeChart, setActiveChart] = useState<'ar-aging' | 'margin-variance' | 'service-mix'>('ar-aging');

  const chartButtons = [
    { id: 'ar-aging' as const, label: 'AR Aging' },
    { id: 'margin-variance' as const, label: 'Margin Variance' },
    { id: 'service-mix' as const, label: 'Service Mix' }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'ar-aging':
        return (
          <BarChart data={arAgingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <LineChart data={marginVarianceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 60 }}>
            <Pie
              data={serviceMixData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={65}
              innerRadius={20}
            >
              {serviceMixData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${value}%`, 'Share']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="rect"
              wrapperStyle={{ paddingTop: '10px' }}
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
  return (
    <ChartCard title="4-Week Capacity (hrs)">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={capacityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="booked" 
            stackId="1"
            stroke="#22c55e" 
            fill="#22c55e" 
            fillOpacity={0.6}
            name="Booked"
          />
          <Area 
            type="monotone" 
            dataKey="available" 
            stackId="2"
            stroke="#60a5fa" 
            fill="#60a5fa" 
            fillOpacity={0.3}
            name="Available"
          />
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