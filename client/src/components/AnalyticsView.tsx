import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSalesReps, useServices } from '@/hooks/useApiData';
import DataTable from './DataTable';
import type { Column } from './DataTable';

// API functions for analytics data
const fetchCustomerConcerns = async () => {
  const response = await fetch('/api/customer-concerns');
  if (!response.ok) throw new Error('Failed to fetch customer concerns');
  return response.json();
};

const fetchSalesGoals = async () => {
  const response = await fetch('/api/sales-goals');
  if (!response.ok) throw new Error('Failed to fetch sales goals');
  return response.json();
};

const fetchWeeklyCapacity = async () => {
  const response = await fetch('/api/weekly-capacity');
  if (!response.ok) throw new Error('Failed to fetch weekly capacity');
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

const bulkDeleteRecords = async (endpoint: string, ids: string[]) => {
  const response = await fetch(`/api/${endpoint}/bulk-delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error(`Failed to bulk delete ${endpoint}`);
};

// Column definitions for each data type
const customerConcernsColumns: Column[] = [
  { key: 'date', label: 'Date', sortable: true, editable: true, type: 'date' },
  { key: 'description', label: 'Description', sortable: true, editable: true, type: 'text' },
  { key: 'priority', label: 'Priority', sortable: true, editable: true, type: 'select', options: ['Low', 'Med', 'High'] },
  { key: 'serviceId', label: 'Service (Optional)', sortable: true, editable: true, type: 'service-select' },
];

const salesGoalsColumns: Column[] = [
  { key: 'period', label: 'Period', sortable: true, editable: true, type: 'date' },
  { key: 'salesRepName', label: 'Sales Rep', sortable: true, editable: false, type: 'text' },
  { key: 'goalAmount', label: 'Goal Amount ($)', sortable: true, editable: true, type: 'number' },
  { key: 'actualAmount', label: 'Actual Amount ($)', sortable: true, editable: true, type: 'number' },
];

const weeklyCapacityColumns: Column[] = [
  { key: 'weekStarting', label: 'Week Starting', sortable: true, editable: true, type: 'date' },
  { key: 'availableHours', label: 'Available Hours', sortable: true, editable: true, type: 'number' },
  { key: 'bookedHours', label: 'Booked Hours', sortable: true, editable: true, type: 'number' },
];

export default function AnalyticsView() {
  const [activeTab, setActiveTab] = useState('customer-concerns');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries for each data type
  const customerConcernsQuery = useQuery({
    queryKey: ['customer-concerns'],
    queryFn: fetchCustomerConcerns,
  });

  const salesGoalsQuery = useQuery({
    queryKey: ['sales-goals'],
    queryFn: fetchSalesGoals,
  });

  const weeklyCapacityQuery = useQuery({
    queryKey: ['weekly-capacity'],
    queryFn: fetchWeeklyCapacity,
  });

  // Get reference data for name resolution
  const { data: salesReps } = useSalesReps();
  const { data: services } = useServices();

  // Transform customer concerns data to include service names for display
  const transformedCustomerConcerns = useMemo(() => {
    if (!customerConcernsQuery.data || !services) return [];
    
    return customerConcernsQuery.data.map((concern: any) => {
      const service = services.find((s: any) => s.id === concern.serviceId);
      return {
        ...concern,
        serviceName: concern.serviceId ? (service?.name || 'Unknown Service') : '',
        // Keep serviceId for editing, but we'll display serviceName
      };
    });
  }, [customerConcernsQuery.data, services]);

  // Transform sales goals data to include sales rep names
  const transformedSalesGoals = useMemo(() => {
    if (!salesGoalsQuery.data || !salesReps) return [];
    
    return salesGoalsQuery.data.map((goal: any) => {
      const salesRep = salesReps.find((rep: any) => rep.id === goal.salesRepId);
      return {
        ...goal,
        salesRepName: salesRep?.name || 'Unknown Rep'
      };
    });
  }, [salesGoalsQuery.data, salesReps]);

  // Mutations for updates and deletes
  const updateMutation = useMutation({
    mutationFn: ({ endpoint, id, data }: { endpoint: string; id: string; data: any }) =>
      updateRecord(endpoint, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
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
    onSuccess: () => {
      queryClient.invalidateQueries();
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

  const bulkDeleteMutation = useMutation({
    mutationFn: ({ endpoint, ids }: { endpoint: string; ids: string[] }) =>
      bulkDeleteRecords(endpoint, ids),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: `${variables.ids.length} records deleted successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete records",
        variant: "destructive",
      });
    },
  });

  // Event handlers
  const handleEdit = (endpoint: string) => (id: string, field: string, value: any) => {
    updateMutation.mutate({ endpoint, id, data: { [field]: value } });
  };

  const handleDelete = (endpoint: string) => (id: string) => {
    deleteMutation.mutate({ endpoint, id });
  };

  const handleBulkDelete = (endpoint: string) => (ids: string[]) => {
    bulkDeleteMutation.mutate({ endpoint, ids });
  };

  const handleAddNew = () => {
    toast({
      title: "Add New",
      description: "Add new functionality will be implemented next",
    });
  };

  // No data processing needed - using raw schema data

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="customer-concerns">Concerns</TabsTrigger>
            <TabsTrigger value="sales-goals">Goals</TabsTrigger>
            <TabsTrigger value="weekly-capacity">Capacity</TabsTrigger>
          </TabsList>
          
          {/* Add New button commented out - use Data Input page for creating new records */}
          {/* <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button> */}
        </div>

        <TabsContent value="customer-concerns" className="mt-6">
          <DataTable
            data={transformedCustomerConcerns}
            columns={customerConcernsColumns}
            loading={customerConcernsQuery.isLoading}
            onEdit={handleEdit('customer-concerns')}
            onDelete={handleDelete('customer-concerns')}
            onBulkDelete={handleBulkDelete('customer-concerns')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="customer-concerns"
          />
        </TabsContent>

        <TabsContent value="sales-goals" className="mt-6">
          <DataTable
            data={transformedSalesGoals}
            columns={salesGoalsColumns}
            loading={salesGoalsQuery.isLoading}
            onEdit={handleEdit('sales-goals')}
            onDelete={handleDelete('sales-goals')}
            onBulkDelete={handleBulkDelete('sales-goals')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="sales-goals"
          />
        </TabsContent>

        <TabsContent value="weekly-capacity" className="mt-6">
          <DataTable
            data={weeklyCapacityQuery.data || []}
            columns={weeklyCapacityColumns}
            loading={weeklyCapacityQuery.isLoading}
            onEdit={handleEdit('weekly-capacity')}
            onDelete={handleDelete('weekly-capacity')}
            onBulkDelete={handleBulkDelete('weekly-capacity')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="weekly-capacity"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}