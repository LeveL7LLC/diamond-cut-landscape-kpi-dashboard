import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const LEAD_SOURCES = [
  "Angi",
  "Nextdoor", 
  "Google Ads",
  "Google LSA",
  "Postcards",
  "Website",
] as const;

export type LeadSource = typeof LEAD_SOURCES[number];

interface LeadSourceSelectorProps {
  selected: LeadSource[];
  setSelected: (sources: LeadSource[]) => void;
  "data-testid"?: string;
}

export default function LeadSourceSelector({ selected, setSelected, "data-testid": testId }: LeadSourceSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggle = (src: LeadSource) => {
    const has = selected.includes(src);
    const next = has ? selected.filter(s => s !== src) : [...selected, src];
    setSelected(next);
  };

  const selectAll = () => {
    setSelected([...LEAD_SOURCES]);
  };

  const clearAll = () => {
    setSelected([]);
  };

  const all = selected.length === LEAD_SOURCES.length;

  return (
    <div className="relative" data-testid={testId}>
      <button 
        onClick={() => setOpen(o => !o)} 
        className="text-xs border border-border px-3 py-1.5 rounded-lg bg-card/70 hover:border-muted-foreground transition-colors flex items-center gap-2"
        data-testid="button-lead-sources"
      >
        {all ? 'All Sources' : `${selected.length} of ${LEAD_SOURCES.length}`}
        <ChevronDown size={12} />
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-card-border bg-card/95 p-3 shadow-xl z-10 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground mb-2">Lead Sources</div>
          
          <div className="flex gap-2 mb-3">
            <button 
              onClick={selectAll}
              className="px-2 py-1 rounded-md border border-border text-muted-foreground hover:border-muted-foreground text-xs"
              data-testid="button-select-all"
            >
              All
            </button>
            <button 
              onClick={clearAll}
              className="px-2 py-1 rounded-md border border-border text-muted-foreground hover:border-muted-foreground text-xs"
              data-testid="button-clear-all"
            >
              None
            </button>
          </div>

          <div className="space-y-1">
            {LEAD_SOURCES.map((src) => {
              const isSelected = selected.includes(src);
              return (
                <button
                  key={src}
                  onClick={() => toggle(src)}
                  className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                  data-testid={`button-source-${src.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="text-sm">{src}</span>
                  {isSelected && <Check size={14} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}