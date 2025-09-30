import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable, { Column } from './DataTable';
import { useToast } from "@/hooks/use-toast";

// API functions
const fetchLeadSources = async () => {
  const response = await fetch('/api/lead-sources');
  if (!response.ok) throw new Error('Failed to fetch lead sources');
  return response.json();
};

const fetchCsrs = async () => {
  const response = await fetch('/api/csrs');
  if (!response.ok) throw new Error('Failed to fetch CSRs');
  return response.json();
};

const fetchSalesReps = async () => {
  const response = await fetch('/api/sales-reps');
  if (!response.ok) throw new Error('Failed to fetch sales reps');
  return response.json();
};

const fetchServices = async () => {
  const response = await fetch('/api/services');
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

const updateEntity = async (endpoint: string, id: string, field: string, value: any) => {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [field]: value }),
  });
  if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
  return response.json();
};

const deleteEntity = async (endpoint: string, id: string) => {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
};

// Column definitions - matching the actual schema structure
const leadSourceColumns: Column[] = [
  { key: 'name', label: 'Name', sortable: true, editable: true, type: 'text' },
  { key: 'value', label: 'Value (for filtering)', sortable: true, editable: true, type: 'text' },
  { key: 'color', label: 'Color', sortable: true, editable: true, type: 'text' },
  { key: 'active', label: 'Active', sortable: true, editable: true, type: 'select', options: ['true', 'false'] },
];

const csrColumns: Column[] = [
  { key: 'name', label: 'Name', sortable: true, editable: true, type: 'text' },
  { key: 'value', label: 'Value (for filtering)', sortable: true, editable: true, type: 'text' },
  { key: 'color', label: 'Color', sortable: true, editable: true, type: 'text' },
  { key: 'active', label: 'Active', sortable: true, editable: true, type: 'select', options: ['true', 'false'] },
];

const salesRepColumns: Column[] = [
  { key: 'name', label: 'Name', sortable: true, editable: true, type: 'text' },
  { key: 'value', label: 'Value (for filtering)', sortable: true, editable: true, type: 'text' },
  { key: 'color', label: 'Color', sortable: true, editable: true, type: 'text' },
  { key: 'active', label: 'Active', sortable: true, editable: true, type: 'select', options: ['true', 'false'] },
];

const serviceColumns: Column[] = [
  { key: 'name', label: 'Service Name', sortable: true, editable: true, type: 'text' },
  { key: 'value', label: 'Value (for filtering)', sortable: true, editable: true, type: 'text' },
  { key: 'color', label: 'Color', sortable: true, editable: true, type: 'text' },
  { key: 'active', label: 'Active', sortable: true, editable: true, type: 'select', options: ['true', 'false'] },
];

export default function CoreEntitiesView() {
  const [activeTab, setActiveTab] = useState('lead-sources');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const leadSourcesQuery = useQuery({
    queryKey: ['lead-sources'],
    queryFn: fetchLeadSources,
  });

  const csrsQuery = useQuery({
    queryKey: ['csrs'],
    queryFn: fetchCsrs,
  });

  const salesRepsQuery = useQuery({
    queryKey: ['sales-reps'],
    queryFn: fetchSalesReps,
  });

  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ endpoint, id, field, value }: { 
      endpoint: string; 
      id: string; 
      field: string; 
      value: any; 
    }) => updateEntity(endpoint, id, field, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.endpoint] });
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ endpoint, id }: { endpoint: string; id: string }) => 
      deleteEntity(endpoint, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.endpoint] });
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async ({ endpoint, ids }: { endpoint: string; ids: string[] }) => {
      await Promise.all(ids.map(id => deleteEntity(endpoint, id)));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.endpoint] });
      toast({
        title: "Success",
        description: `${variables.ids.length} records deleted successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete records",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleEdit = async (endpoint: string) => (id: string, field: string, value: any) => {
    return updateMutation.mutateAsync({ endpoint, id, field, value });
  };

  const handleDelete = async (endpoint: string) => (id: string) => {
    return deleteMutation.mutateAsync({ endpoint, id });
  };

  const handleBulkDelete = async (endpoint: string) => (ids: string[]) => {
    return bulkDeleteMutation.mutateAsync({ endpoint, ids });
  };

  const handleAddNew = () => {
    // TODO: Implement add new functionality
    toast({
      title: "Coming Soon",
      description: "Add new functionality will be implemented next",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Core Entities Management</h3>
        {/* Add New button commented out - use Data Input page for creating new records */}
        {/* <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button> */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lead-sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="csrs">CSRs</TabsTrigger>
          <TabsTrigger value="sales-reps">Sales Reps</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="lead-sources" className="mt-6">
          <DataTable
            data={leadSourcesQuery.data || []}
            columns={leadSourceColumns}
            loading={leadSourcesQuery.isLoading}
            onEdit={handleEdit('lead-sources')}
            onDelete={handleDelete('lead-sources')}
            onBulkDelete={handleBulkDelete('lead-sources')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="lead-sources"
          />
        </TabsContent>

        <TabsContent value="csrs" className="mt-6">
          <DataTable
            data={csrsQuery.data || []}
            columns={csrColumns}
            loading={csrsQuery.isLoading}
            onEdit={handleEdit('csrs')}
            onDelete={handleDelete('csrs')}
            onBulkDelete={handleBulkDelete('csrs')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="csrs"
          />
        </TabsContent>

        <TabsContent value="sales-reps" className="mt-6">
          <DataTable
            data={salesRepsQuery.data || []}
            columns={salesRepColumns}
            loading={salesRepsQuery.isLoading}
            onEdit={handleEdit('sales-reps')}
            onDelete={handleDelete('sales-reps')}
            onBulkDelete={handleBulkDelete('sales-reps')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="sales-reps"
          />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <DataTable
            data={servicesQuery.data || []}
            columns={serviceColumns}
            loading={servicesQuery.isLoading}
            onEdit={handleEdit('services')}
            onDelete={handleDelete('services')}
            onBulkDelete={handleBulkDelete('services')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="services"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}