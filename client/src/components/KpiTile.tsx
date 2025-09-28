import { LucideIcon } from "lucide-react";

interface KpiTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  rightSlot?: React.ReactNode;
  sparkline?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  "data-testid"?: string;
}

export default function KpiTile({ 
  icon: Icon, 
  label, 
  value, 
  sub, 
  rightSlot, 
  sparkline,
  bottomSlot,
  "data-testid": testId
}: KpiTileProps) {
  return (
    <div 
      className="rounded-2xl bg-gradient-to-br from-card/90 via-card/80 to-card/70 p-4 shadow-lg border border-card-border backdrop-blur-sm"
      data-testid={testId}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-muted">
            <Icon size={24} className="text-primary" />
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        {rightSlot}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      {sparkline && <div className="mt-2">{sparkline}</div>}
      {bottomSlot && <div className="mt-2">{bottomSlot}</div>}
    </div>
  );
}