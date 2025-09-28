import { LeadSourcesDropdown, CSRDropdown, SalesDropdown, ServicesDropdown } from '../KpiDropdowns';

export default function KpiDropdownExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Lead Sources</h3>
        <LeadSourcesDropdown />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">CSRs</h3>
        <CSRDropdown />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Sales People</h3>
        <SalesDropdown />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Services</h3>
        <ServicesDropdown />
      </div>
    </div>
  );
}