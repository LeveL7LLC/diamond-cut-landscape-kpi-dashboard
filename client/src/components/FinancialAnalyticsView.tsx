import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useServices } from '@/hooks/useApiData';
import DataTable from './DataTable';
import type { Column } from './DataTable';

// API functions for financial and analytics data
const fetchMonthlyFinance = async () => {
  const response = await fetch('/api/monthly-finance');
  if (!response.ok) throw new Error('Failed to fetch monthly finance');
  return response.json();
};

const fetchArAging = async () => {
  const response = await fetch('/api/ar-aging');
  if (!response.ok) throw new Error('Failed to fetch AR aging');
  return response.json();
};

const fetchMarginVariance = async () => {
  const response = await fetch('/api/margin-variance');
  if (!response.ok) throw new Error('Failed to fetch margin variance');
  return response.json();
};

// Removed analytics API functions - moved to AnalyticsView

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

// Column definitions for each data type
const monthlyFinanceColumns: Column[] = [
  { key: 'month', label: 'Month', sortable: true, type: 'date' },
  { key: 'grossProfitPercent', label: 'Gross Profit %', sortable: true, editable: true, type: 'number' },
  { key: 'netProfitPercent', label: 'Net Profit %', sortable: true, editable: true, type: 'number' },
  { key: 'revenue', label: 'Revenue ($)', sortable: true, editable: true, type: 'number' },
];

const arAgingColumns: Column[] = [
  { key: 'asOf', label: 'As Of Date', sortable: true, editable: true, type: 'date' },
  { key: 'bucket030', label: '0-30 Days ($)', sortable: true, editable: true, type: 'number' },
  { key: 'bucket3160', label: '31-60 Days ($)', sortable: true, editable: true, type: 'number' },
  { key: 'bucket6190', label: '61-90 Days ($)', sortable: true, editable: true, type: 'number' },
  { key: 'bucket90plus', label: '90+ Days ($)', sortable: true, editable: true, type: 'number' },
];

const marginVarianceColumns: Column[] = [
  { key: 'date', label: 'Date', sortable: true, editable: true, type: 'date' },
  { key: 'jobName', label: 'Job Name', sortable: true, editable: true, type: 'text' },
  { key: 'bidMargin', label: 'Bid Margin (%)', sortable: true, editable: true, type: 'number' },
  { key: 'actualMargin', label: 'Actual Margin (%)', sortable: true, editable: true, type: 'number' },
  { key: 'serviceId', label: 'Service (Optional)', sortable: true, editable: true, type: 'service-select' },
];

// Analytics column definitions moved to AnalyticsView

export default function FinancialAnalyticsView() {
  const [activeTab, setActiveTab] = useState('monthly-finance');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries for each data type
  const monthlyFinanceQuery = useQuery({
    queryKey: ['monthly-finance'],
    queryFn: fetchMonthlyFinance,
  });

  const arAgingQuery = useQuery({
    queryKey: ['ar-aging'],
    queryFn: fetchArAging,
  });

  const marginVarianceQuery = useQuery({
    queryKey: ['margin-variance'],
    queryFn: fetchMarginVariance,
  });

  // Get services for name resolution
  const { data: services } = useServices();

  // Transform margin variance data to include service names
  const transformedMarginVariance = useMemo(() => {
    if (!marginVarianceQuery.data || !services) return [];
    
    return marginVarianceQuery.data.map((variance: any) => {
      const service = services.find((s: any) => s.id === variance.serviceId);
      return {
        ...variance,
        serviceName: variance.serviceId ? (service?.name || 'Unknown Service') : ''
      };
    });
  }, [marginVarianceQuery.data, services]);

  // Analytics queries moved to AnalyticsView

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

  // Process data to format values properly
  const processMonthlyFinanceData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      grossProfitPercent: parseFloat(item.grossProfitPercent) || 0,
      netProfitPercent: parseFloat(item.netProfitPercent) || 0,
      revenue: parseFloat(item.revenue) || 0,
    }));
  };

  // No data processing needed - using raw schema data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial & Analytics Data Management</h3>
        {/* Add New button commented out - use Data Input page for creating new records */}
        {/* <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button> */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly-finance">Finance</TabsTrigger>
          <TabsTrigger value="ar-aging">AR Aging</TabsTrigger>
          <TabsTrigger value="margin-variance">Margins</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly-finance" className="mt-6">
          <DataTable
            data={processMonthlyFinanceData(monthlyFinanceQuery.data || [])}
            columns={monthlyFinanceColumns}
            loading={monthlyFinanceQuery.isLoading}
            onEdit={handleEdit('monthly-finance')}
            onDelete={handleDelete('monthly-finance')}
            onBulkDelete={handleBulkDelete('monthly-finance')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="monthly-finance"
          />
        </TabsContent>

        <TabsContent value="ar-aging" className="mt-6">
          <DataTable
            data={arAgingQuery.data || []}
            columns={arAgingColumns}
            loading={arAgingQuery.isLoading}
            onEdit={handleEdit('ar-aging')}
            onDelete={handleDelete('ar-aging')}
            onBulkDelete={handleBulkDelete('ar-aging')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="ar-aging"
          />
        </TabsContent>

        <TabsContent value="margin-variance" className="mt-6">
          <DataTable
            data={transformedMarginVariance}
            columns={marginVarianceColumns}
            loading={marginVarianceQuery.isLoading}
            onEdit={handleEdit('margin-variance')}
            onDelete={handleDelete('margin-variance')}
            onBulkDelete={handleBulkDelete('margin-variance')}
            searchable={true}
            selectable={true}
            exportable={true}
            exportFileName="margin-variance"
          />
        </TabsContent>

        {/* Analytics tabs moved to AnalyticsView */}
      </Tabs>
    </div>
  );
}