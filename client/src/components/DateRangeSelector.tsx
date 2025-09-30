import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type DateRange = {
  start: string;
  end: string;
  preset: '7d' | '30d' | '90d' | 'custom';
};

interface DateRangeSelectorProps {
  range: DateRange;
  setRange: (range: DateRange) => void;
  "data-testid"?: string;
}

export default function DateRangeSelector({ range, setRange, "data-testid": testId }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);

  const initRange = (days: number): DateRange => {
    const end = new Date();
    end.setDate(end.getDate() - 1); // Set end to yesterday (previous day)
    const start = new Date();
    start.setDate(end.getDate() - (days - 1)); // Adjust start to maintain the correct number of days
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      preset: (days + 'd') as '7d' | '30d' | '90d'
    };
  };

  const applyPreset = (days: 7 | 30 | 90) => {
    setRange(initRange(days));
    setOpen(false);
  };

  const onCustomChange = (key: 'start' | 'end') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setRange({ ...range, [key]: v, preset: 'custom' });
  };

  return (
    <div className="relative" data-testid={testId}>
      <button 
        onClick={() => setOpen(o => !o)} 
        className="text-xs border border-border px-3 py-1.5 rounded-lg bg-card/70 hover:border-muted-foreground transition-colors flex items-center gap-2"
        data-testid="button-date-range"
      >
        {range.preset !== 'custom' ? range.preset.toUpperCase() : `${range.start} → ${range.end}`}
        <ChevronDown size={12} />
      </button>
      
      {open && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 rounded-xl border border-card-border bg-card/95 p-3 shadow-xl z-10 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground mb-2">Date range</div>
          <div className="flex gap-2 mb-3">
            {[7, 30, 90].map((days) => (
              <button 
                key={days}
                onClick={() => applyPreset(days as 7 | 30 | 90)}
                className={`px-2 py-1 rounded-md border transition-colors ${
                  range.preset === `${days}d` 
                    ? 'border-primary text-primary' 
                    : 'border-border text-muted-foreground hover:border-muted-foreground'
                }`}
                data-testid={`button-preset-${days}d`}
              >
                {days}d
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-[10px] text-muted-foreground">Start</label>
            <input 
              type="date" 
              value={range.start} 
              onChange={onCustomChange('start')} 
              className="bg-muted border border-border rounded-md px-2 py-1 text-xs"
              data-testid="input-start-date"
            />
            <label className="text-[10px] text-muted-foreground">End</label>
            <input 
              type="date" 
              value={range.end} 
              onChange={onCustomChange('end')} 
              className="bg-muted border border-border rounded-md px-2 py-1 text-xs"
              data-testid="input-end-date"
            />
          </div>
        </div>
      )}
    </div>
  );
}