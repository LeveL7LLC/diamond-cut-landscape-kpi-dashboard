import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSalesReps, useCSRs, useServices, useLeadSources } from '@/hooks/useApiData';
import DataTable from './DataTable';
import type { Column } from './DataTable';

// API functions for time-series data
const fetchDailyLeads = async () => {
  const response = await fetch('/api/daily-leads');
  if (!response.ok) throw new Error('Failed to fetch daily leads');
  return response.json();
};

const fetchDailyBookings = async () => {
  const response = await fetch('/api/daily-bookings');
  if (!response.ok) throw new Error('Failed to fetch daily bookings');
  return response.json();
};

const fetchDailyCloses = async () => {
  const response = await fetch('/api/daily-closes');
  if (!response.ok) throw new Error('Failed to fetch daily closes');
  return response.json();
};

const fetchDailyContracts = async () => {
  const response = await fetch('/api/daily-contracts');
  if (!response.ok) throw new Error('Failed to fetch daily contracts');
  return response.json();
};

const updateRecord = async (endpoint: string, id: string, data: any) => {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
  return response.json();
};

const deleteRecord = async (endpoint: string, id: string) => {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
};

// Column definitions for each data type - matching actual schema
const dailyLeadsColumns: Column[] = [
  { key: 'date', label: 'Date', sortable: true, editable: true, type: 'date' },
  { key: 'leadSourceName', label: 'Lead Source', sortable: true, editable: false, type: 'text' },
  { key: 'count', label: 'Lead Count', sortable: true, editable: true, type: 'number' },
];

const dailyBookingsColumns: Column[] = [
  { key: 'date', label: 'Date', sortable: true, editable: true, type: 'date' },
  { key: 'csrName', label: 'CSR', sortable: true, editable: false, type: 'text' },
  { key: 'leads', label: 'Leads', sortable: true, editable: true, type: 'number' },
  { key: 'appointments', label: 'Appointments', sortable: true, editable: true, type: 'number' },
];

const dailyClosesColumns: Column[] = [
  { key: 'date', label: 'Date', sortable: true, editable: true, type: 'date' },
  { key: 'salesRepName', label: 'Sales Rep', sortable: true, editable: false, type: 'text' },
  { key: 'presented', label: 'Presented', sortable: true, editable: true, type: 'number' },
  { key: 'signed', label: 'Signed', sortable: true, editable: true, type: 'number' },
];

const dailyContractsColumns: Column[] = [
  { key: 'date', label: 'Date', sortable: true, editable: true, type: 'date' },
  { key: 'serviceName', label: 'Service', sortable: true, editable: false, type: 'text' },
  { key: 'amount', label: 'Amount ($)', sortable: true, editable: true, type: 'number' },
];

export default function TimeSeriesView() {
  const [activeTab, setActiveTab] = useState('daily-leads');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries for each data type
  const dailyLeadsQuery = useQuery({
    queryKey: ['daily-leads'],
    queryFn: fetchDailyLeads,
  });

  const dailyBookingsQuery = useQuery({
    queryKey: ['daily-bookings'],
    queryFn: fetchDailyBookings,
  });

  const dailyClosesQuery = useQuery({
    queryKey: ['daily-closes'],
    queryFn: fetchDailyCloses,
  });

  const dailyContractsQuery = useQuery({
    queryKey: ['daily-contracts'],
    queryFn: fetchDailyContracts,
  });

  // Get reference data for name resolution
  const { data: salesReps } = useSalesReps();
  const { data: csrs } = useCSRs();
  const { data: services } = useServices();
  const { data: leadSources } = useLeadSources();

  // Transform data to include names instead of IDs
  const transformedDailyLeads = useMemo(() => {
    if (!dailyLeadsQuery.data || !leadSources) return [];
    
    return dailyLeadsQuery.data.map((lead: any) => {
      const leadSource = leadSources.find((ls: any) => ls.id === lead.leadSourceId);
      return {
        ...lead,
        leadSourceName: leadSource?.name || 'Unknown Lead Source'
      };
    });
  }, [dailyLeadsQuery.data, leadSources]);

  const transformedDailyBookings = useMemo(() => {
    if (!dailyBookingsQuery.data || !csrs) return [];
    
    return dailyBookingsQuery.data.map((booking: any) => {
      const csr = csrs.find((c: any) => c.id === booking.csrId);
      return {
        ...booking,
        csrName: csr?.name || 'Unknown CSR'
      };
    });
  }, [dailyBookingsQuery.data, csrs]);

  const transformedDailyCloses = useMemo(() => {
    if (!dailyClosesQuery.data || !salesReps) return [];
    
    return dailyClosesQuery.data.map((close: any) => {
      const salesRep = salesReps.find((rep: any) => rep.id === close.salesRepId);
      return {
        ...close,
        salesRepName: salesRep?.name || 'Unknown Rep'
      };
    });
  }, [dailyClosesQuery.data, salesReps]);

  const transformedDailyContracts = useMemo(() => {
    if (!dailyContractsQuery.data || !services) return [];
    
    return dailyContractsQuery.data.map((contract: any) => {
      const service = services.find((s: any) => s.id === contract.serviceId);
      return {
        ...contract,
        serviceName: service?.name || 'Unknown Service'
      };
    });
  }, [dailyContractsQuery.data, services]);

  // Mutations for updates and deletes
  const updateMutation = useMutation({
    mutationFn: ({ endpoint, id, data }: { endpoint: string; id: string; data: any }) =>
      updateRecord(endpoint, id, data),
    onSuccess: (_, { endpoint }) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update record",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ endpoint, id }: { endpoint: string; id: string }) =>
      deleteRecord(endpoint, id),
    onSuccess: (_, { endpoint }) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete record",
        variant: "destructive",
      });
    },
  });

  // Handler functions
  const handleEdit = (endpoint: string) => async (id: string, field: string, value: any) => {
    updateMutation.mutate({
      endpoint,
      id,
      data: { [field]: value },
    });
  };

  const handleDelete = (endpoint: string) => async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate({ endpoint, id });
    }
  };

  const handleBulkDelete = (endpoint: string) => async (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} records?`)) {
      for (const id of ids) {
        deleteMutation.mutate({ endpoint, id });
      }
    }
  };

  const handleAddNew = () => {
    toast({
      title: "Coming Soon",
      description: "Add new functionality will be implemented next",
    });
  };

  // No data processing needed - using raw schema data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Time-Series Data Management</h3>
        {/* Add New button commented out - use Data Input page for creating new records */}
        {/* <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button> */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily-leads">Daily Leads</TabsTrigger>
          <TabsTrigger value="daily-bookings">Daily Bookings</TabsTrigger>
          <TabsTrigger value="daily-closes">Daily Closes</TabsTrigger>
          <TabsTrigger value="daily-contracts">Daily Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-leads" className="mt-6">
          <DataTable
            data={transformedDailyLeads}
            columns={dailyLeadsColumns}
            loading={dailyLeadsQuery.isLoading}
            onEdit={handleEdit('daily-leads')}
            onDelete={handleDelete('daily-leads')}
            onBulkDelete={handleBulkDelete('daily-leads')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="daily-leads"
          />
        </TabsContent>

        <TabsContent value="daily-bookings" className="mt-6">
          <DataTable
            data={transformedDailyBookings}
            columns={dailyBookingsColumns}
            loading={dailyBookingsQuery.isLoading}
            onEdit={handleEdit('daily-bookings')}
            onDelete={handleDelete('daily-bookings')}
            onBulkDelete={handleBulkDelete('daily-bookings')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="daily-bookings"
          />
        </TabsContent>

        <TabsContent value="daily-closes" className="mt-6">
          <DataTable
            data={transformedDailyCloses}
            columns={dailyClosesColumns}
            loading={dailyClosesQuery.isLoading}
            onEdit={handleEdit('daily-closes')}
            onDelete={handleDelete('daily-closes')}
            onBulkDelete={handleBulkDelete('daily-closes')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="daily-closes"
          />
        </TabsContent>

        <TabsContent value="daily-contracts" className="mt-6">
          <DataTable
            data={transformedDailyContracts}
            columns={dailyContractsColumns}
            loading={dailyContractsQuery.isLoading}
            onEdit={handleEdit('daily-contracts')}
            onDelete={handleDelete('daily-contracts')}
            onBulkDelete={handleBulkDelete('daily-contracts')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="daily-contracts"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}