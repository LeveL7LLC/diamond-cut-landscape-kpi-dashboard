import { useState, useRef, useEffect } from 'react';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const parentTileRef = useRef<HTMLElement | null>(null);
  const parentOriginalZIndex = useRef<string>('');

  const safeOptions = options || [];
  const safeSelected = selected || [];

  const toggle = (value: string) => {
    const has = safeSelected.includes(value);
    const next = has ? safeSelected.filter(s => s !== value) : [...safeSelected, value];
    onSelectionChange(next);
  };

  const selectAll = () => {
    if (options && options.length > 0) {
      onSelectionChange(options.map(opt => opt.value));
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const allSelected = safeSelected.length === safeOptions.length;
  const displayText = allSelected ? placeholder : `${safeSelected.length}/${safeOptions.length}`;

  useEffect(() => {
    if (buttonRef.current && !parentTileRef.current) {
      parentTileRef.current = buttonRef.current.closest('[data-kpi-tile]') as HTMLElement | null;
      if (parentTileRef.current) {
        parentOriginalZIndex.current = parentTileRef.current.style.zIndex;
      }
    }
  }, []);

  // Close the dropdown when the user scrolls the page
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleScroll = () => setOpen(false);
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    const tile = parentTileRef.current;
    if (!tile) {
      return;
    }

    if (open) {
      tile.style.zIndex = '1200';
    } else {
      tile.style.zIndex = parentOriginalZIndex.current || '';
    }

    return () => {
      tile.style.zIndex = parentOriginalZIndex.current || '';
    };
  }, [open]);

  const dropdownContent = open ? (
    <>
      {/* Backdrop to close dropdown */}
      <div 
        className="fixed inset-0 z-[100]" 
        onClick={() => setOpen(false)}
      />
      
      <div 
        className="absolute right-0 top-full mt-1 w-48 rounded-lg p-2 shadow-xl z-[9999]"
        style={{
          backgroundColor: 'hsl(220 9% 9%)',
          border: '1px solid hsl(220 9% 18%)',
          color: 'hsl(0 0% 95%)',
        }}
      >
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

        <div className="space-y-0.5">
          {safeOptions.map((option) => {
            const isSelected = safeSelected.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggle(option.value)}
                className={`w-full flex items-center justify-between p-1.5 rounded text-xs transition-colors ${
                  isSelected 
                    ? 'bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30' 
                    : 'hover:bg-muted/30'
                }`}
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
  ) : null;

  return (
    <div className="relative" data-testid={testId}>
      <button 
        ref={buttonRef}
        onClick={() => setOpen(o => !o)} 
        className="text-xs border border-border px-2 py-1 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors flex items-center gap-1"
        data-testid="button-kpi-dropdown"
      >
        {displayText}
        <ChevronDown size={10} />
      </button>

      {dropdownContent}
    </div>
  );
}
