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
}

function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div className={`rounded-2xl bg-card/80 p-4 border border-card-border backdrop-blur-sm ${className}`}>
      <h3 className="text-sm text-muted-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function SalesGoalsChart() {
  return (
    <ChartCard title="Sales Goals vs Actual ($)">
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