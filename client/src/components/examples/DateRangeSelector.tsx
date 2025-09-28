import { useState } from 'react';
import DateRangeSelector, { type DateRange } from '../DateRangeSelector';

export default function DateRangeSelectorExample() {
  const [range, setRange] = useState<DateRange>({
    start: '2025-08-25',
    end: '2025-09-28',
    preset: '30d'
  });

  return (
    <div className="p-4">
      <DateRangeSelector
        range={range}
        setRange={setRange}
        data-testid="date-range-selector"
      />
      <div className="mt-4 text-sm text-muted-foreground">
        Selected: {range.start} to {range.end} ({range.preset})
      </div>
    </div>
  );
}