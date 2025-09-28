import KpiTile from '../KpiTile';
import { PhoneCall } from 'lucide-react';

export default function KpiTileExample() {
  // Mock data for demonstration
  const mockSources = [
    { name: "Angi", color: "#22c55e", count: 42 },
    { name: "Nextdoor", color: "#60a5fa", count: 38 },
    { name: "Google Ads", color: "#f59e0b", count: 35 },
    { name: "Google LSA", color: "#a78bfa", count: 28 }
  ];

  const legendSlot = (
    <div className="flex flex-wrap gap-2">
      {mockSources.map((source) => (
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

  return (
    <KpiTile
      icon={PhoneCall}
      label="Qualified Leads"
      value="380"
      sub="2025-08-25 → 2025-09-28"
      data-testid="kpi-qualified-leads"
      bottomSlot={legendSlot}
    />
  );
}