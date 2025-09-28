import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

interface KpiDropdownProps {
  options: DropdownOption[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  "data-testid"?: string;
}

export default function KpiDropdown({ 
  options, 
  selected, 
  onSelectionChange, 
  placeholder = "All",
  "data-testid": testId 
}: KpiDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    const has = selected.includes(value);
    const next = has ? selected.filter(s => s !== value) : [...selected, value];
    onSelectionChange(next);
  };

  const selectAll = () => {
    onSelectionChange(options.map(opt => opt.value));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const allSelected = selected.length === options.length;
  const displayText = allSelected ? placeholder : `${selected.length}/${options.length}`;

  return (
    <div className="relative" data-testid={testId}>
      <button 
        onClick={() => setOpen(o => !o)} 
        className="text-xs border border-border px-2 py-1 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors flex items-center gap-1"
        data-testid="button-kpi-dropdown"
      >
        {displayText}
        <ChevronDown size={10} />
      </button>
      
      {open && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          
          <div className="absolute right-0 mt-1 w-40 rounded-lg border border-card-border bg-card/95 p-2 shadow-xl z-20 backdrop-blur-sm">
            <div className="flex gap-1 mb-2">
              <button 
                onClick={selectAll}
                className="px-1.5 py-0.5 rounded text-[10px] border border-border text-muted-foreground hover:border-muted-foreground"
                data-testid="button-select-all"
              >
                All
              </button>
              <button 
                onClick={clearAll}
                className="px-1.5 py-0.5 rounded text-[10px] border border-border text-muted-foreground hover:border-muted-foreground"
                data-testid="button-clear-all"
              >
                None
              </button>
            </div>

            <div className="space-y-0.5 max-h-32 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggle(option.value)}
                    className="w-full flex items-center justify-between p-1.5 rounded text-xs hover:bg-muted/30 transition-colors"
                    data-testid={`button-option-${option.value.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {option.color && (
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>
                    {isSelected && <Check size={10} className="text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}