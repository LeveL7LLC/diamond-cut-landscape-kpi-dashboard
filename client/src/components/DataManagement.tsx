import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Plus, Database } from "lucide-react";
import CoreEntitiesView from './CoreEntitiesView';
import TimeSeriesView from './TimeSeriesView';
import FinancialAnalyticsView from './FinancialAnalyticsView';
import AnalyticsView from './AnalyticsView';
import SearchResults from './SearchResults';

export default function DataManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('core-entities');

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Global search query
  const searchQuery = useQuery({
    queryKey: ['global-search', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm.trim()) return { results: [] };
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: debouncedSearchTerm.length > 0,
  });

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export data for tab:', activeTab);
  };

  const handleAddNew = () => {
    // TODO: Implement add new functionality
    console.log('Add new item for tab:', activeTab);
  };

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 via-orange-100 to-red-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 border border-red-200 rounded-lg shadow-sm">
                <Database className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-red-900">
                  Data Management
                </h1>
                <p className="text-red-700 mt-1 font-medium">
                  ⚠️ Critical Operations - View, edit, and manage your dashboard data
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              {/* Add New button commented out - use Data Input page for creating new records */}
              {/* <Button 
                onClick={handleAddNew}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New
              </Button> */}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search across all data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Additional filters can be added here */}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <SearchResults
          results={searchQuery.data?.results || []}
          searchTerm={debouncedSearchTerm}
          onNavigateToTab={handleNavigateToTab}
          isLoading={searchQuery.isLoading}
        />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="core-entities" className="text-xs sm:text-sm">
              Core Entities
            </TabsTrigger>
            <TabsTrigger value="time-series" className="text-xs sm:text-sm">
              Time Series
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs sm:text-sm">
              Financial
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="core-entities">
            <Card>
              <CardHeader>
                <CardTitle>Core Entities</CardTitle>
                <CardDescription>
                  Manage lead sources, CSRs, sales representatives, and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CoreEntitiesView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-series">
            <Card>
              <CardHeader>
                <CardTitle>Time Series Data</CardTitle>
                <CardDescription>
                  View and edit daily metrics including leads, bookings, closes, and contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSeriesView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Data</CardTitle>
                <CardDescription>
                  Manage revenue, margins, AR aging, and financial metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialAnalyticsView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Goals</CardTitle>
                <CardDescription>
                  Track customer concerns, sales goals, capacity, and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsView />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}