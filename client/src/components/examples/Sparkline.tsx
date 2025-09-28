import Sparkline from '../Sparkline';

export default function SparklineExample() {
  // Mock data for demonstration
  const sampleData = Array.from({ length: 14 }, (_, i) => ({
    value: 100 + Math.sin(i / 3) * 15 + (Math.random() - 0.5) * 10,
    date: new Date(Date.now() - (14 - i) * 86400000).toISOString().slice(0, 10)
  }));

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Green Sparkline</h3>
        <Sparkline data={sampleData} color="#22c55e" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Blue Sparkline</h3>
        <Sparkline data={sampleData} color="#60a5fa" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Amber Sparkline</h3>
        <Sparkline data={sampleData} color="#f59e0b" />
      </div>
    </div>
  );
}