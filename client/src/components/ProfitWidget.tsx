interface ProfitWidgetProps {
  label: string;
  value: number;
  mom: number; // month-over-month change
  "data-testid"?: string;
}

export default function ProfitWidget({ label, value, mom, "data-testid": testId }: ProfitWidgetProps) {
  const percentage = `${(value * 100).toFixed(0)}%`;
  const momText = `${mom >= 0 ? '+' : ''}${(mom * 100).toFixed(1)} pp`;
  const momClass = mom >= 0 ? 'text-chart-1' : 'text-destructive';
  
  return (
    <div className="rounded-2xl bg-card/80 p-4 border border-card-border backdrop-blur-sm" data-testid={testId}>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-semibold text-foreground">{percentage}</div>
      <div className="text-xs text-muted-foreground mt-1">
        MoM: <span className={momClass}>{momText}</span>
      </div>
    </div>
  );
}