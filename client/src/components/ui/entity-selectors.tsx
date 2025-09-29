import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLeadSources, useCSRs, useSalesReps, useServices } from "@/hooks/useApiData";

interface EntitySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function LeadSourceSelector({
  value,
  onChange,
  placeholder = "Select lead source",
  disabled = false,
  className,
  "data-testid": testId,
}: EntitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: leadSources } = useLeadSources();

  const selectedSource = leadSources?.find((source: any) => source.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          data-testid={testId}
        >
          {selectedSource ? selectedSource.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search lead sources..." />
          <CommandList>
            <CommandEmpty>No lead source found.</CommandEmpty>
            <CommandGroup>
              {leadSources?.map((source: any) => (
                <CommandItem
                  key={source.id}
                  value={source.name}
                  onSelect={() => {
                    onChange?.(source.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === source.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {source.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function CSRSelector({
  value,
  onChange,
  placeholder = "Select CSR",
  disabled = false,
  className,
  "data-testid": testId,
}: EntitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: csrs } = useCSRs();

  const selectedCSR = csrs?.find((csr: any) => csr.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          data-testid={testId}
        >
          {selectedCSR ? selectedCSR.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search CSRs..." />
          <CommandList>
            <CommandEmpty>No CSR found.</CommandEmpty>
            <CommandGroup>
              {csrs?.map((csr: any) => (
                <CommandItem
                  key={csr.id}
                  value={csr.name}
                  onSelect={() => {
                    onChange?.(csr.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === csr.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {csr.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SalesRepSelector({
  value,
  onChange,
  placeholder = "Select sales rep",
  disabled = false,
  className,
  "data-testid": testId,
}: EntitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: salesReps } = useSalesReps();

  const selectedRep = salesReps?.find((rep: any) => rep.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          data-testid={testId}
        >
          {selectedRep ? selectedRep.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search sales reps..." />
          <CommandList>
            <CommandEmpty>No sales rep found.</CommandEmpty>
            <CommandGroup>
              {salesReps?.map((rep: any) => (
                <CommandItem
                  key={rep.id}
                  value={rep.name}
                  onSelect={() => {
                    onChange?.(rep.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === rep.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {rep.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ServiceSelector({
  value,
  onChange,
  placeholder = "Select service",
  disabled = false,
  className,
  "data-testid": testId,
}: EntitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: services } = useServices();

  const selectedService = services?.find((service: any) => service.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          data-testid={testId}
        >
          {selectedService ? selectedService.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search services..." />
          <CommandList>
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup>
              {services?.map((service: any) => (
                <CommandItem
                  key={service.id}
                  value={service.name}
                  onSelect={() => {
                    onChange?.(service.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === service.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {service.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}