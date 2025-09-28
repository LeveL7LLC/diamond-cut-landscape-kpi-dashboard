interface ThermometerProps {
  value: number;
  label: string;
  "data-testid"?: string;
}

export default function Thermometer({ value, label, "data-testid": testId }: ThermometerProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const percentage = `${(clamped * 100).toFixed(0)}%`;
  
  return (
    <div className="rounded-2xl bg-card/80 p-4 border border-card-border backdrop-blur-sm" data-testid={testId}>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out" 
          style={{ width: percentage }}
        />
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{percentage}</div>
    </div>
  );
}