import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // Calculate dropdown position when opened
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.right + window.scrollX - 192, // 192px is w-48 (12rem * 16px)
      });
    }
  }, [open]);

  const dropdownContent = open ? (
    <>
      {/* Backdrop to close dropdown */}
      <div 
        className="fixed inset-0 z-[100]" 
        onClick={() => setOpen(false)}
      />
      
      <div 
        className="fixed w-48 rounded-lg p-2 shadow-xl z-[9999]"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
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
      
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}