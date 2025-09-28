import { useState } from 'react';
import LeadSourceSelector, { LEAD_SOURCES, type LeadSource } from '../LeadSourceSelector';

export default function LeadSourceSelectorExample() {
  const [selected, setSelected] = useState<LeadSource[]>([...LEAD_SOURCES]);

  return (
    <div className="p-4">
      <LeadSourceSelector
        selected={selected}
        setSelected={setSelected}
        data-testid="lead-source-selector"
      />
      <div className="mt-4 text-sm text-muted-foreground">
        Selected: {selected.join(', ') || 'None'}
      </div>
    </div>
  );
}