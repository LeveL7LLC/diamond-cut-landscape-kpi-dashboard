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
          <Bar dataKey="actual" fill="#22c55e" name="Actual" />
          <Bar dataKey="goal" fill="#60a5fa" name="Goal" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ARAgingChart() {
  return (
    <ChartCard title="AR Aging">
      <ResponsiveContainer width="100%" height={200}>
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
          <Bar dataKey="amount" fill={COLORS[0]} />
        </BarChart>
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