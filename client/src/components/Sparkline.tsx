import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineData {
  value: number;
  date?: string;
}

interface SparklineProps {
  data: SparklineData[];
  color?: string;
  height?: number;
}

export default function Sparkline({ data, color = "#22c55e", height = 40 }: SparklineProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}