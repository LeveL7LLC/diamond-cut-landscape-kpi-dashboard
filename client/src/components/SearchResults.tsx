import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, DollarSign, User, Building } from "lucide-react";

interface SearchResult {
  id: string;
  name?: string;
  description?: string;
  jobName?: string;
  value?: string;
  date?: string;
  period?: string;
  _table: string;
  _type: string;
  [key: string]: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchTerm: string;
  onNavigateToTab: (tabId: string) => void;
  isLoading?: boolean;
}

export default function SearchResults({ results, searchTerm, onNavigateToTab, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Searching across all data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!searchTerm) {
    return null;
  }

  if (results.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No results found for "{searchTerm}"
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (table: string) => {
    switch (table) {
      case 'Lead Sources':
      case 'CSRs':
      case 'Sales Reps':
      case 'Services':
        return <Building className="h-4 w-4" />;
      case 'Customer Concerns':
        return <User className="h-4 w-4" />;
      case 'Margin Variance':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getDisplayText = (result: SearchResult) => {
    if (result.name) return result.name;
    if (result.description) return result.description;
    if (result.jobName) return result.jobName;
    return 'Unknown';
  };

  const getSubText = (result: SearchResult) => {
    const parts = [];
    if (result.value) parts.push(`Value: ${result.value}`);
    if (result.date) parts.push(`Date: ${new Date(result.date).toLocaleDateString()}`);
    if (result.period) parts.push(`Period: ${new Date(result.period).toLocaleDateString()}`);
    if (result.priority) parts.push(`Priority: ${result.priority}`);
    if (result.bidMargin) parts.push(`Bid: ${result.bidMargin}%`);
    if (result.actualMargin) parts.push(`Actual: ${result.actualMargin}%`);
    return parts.join(' • ');
  };

  const getTabId = (type: string) => {
    switch (type) {
      case 'core-entities': return 'core-entities';
      case 'time-series': return 'time-series';
      case 'financial': return 'financial';
      case 'analytics': return 'analytics';
      default: return 'core-entities';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Search Results for "{searchTerm}" ({results.length} found)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {getIcon(result._table)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">
                      {getDisplayText(result)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {result._table}
                    </Badge>
                  </div>
                  {getSubText(result) && (
                    <div className="text-sm text-muted-foreground truncate">
                      {getSubText(result)}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateToTab(getTabId(result._type))}
                className="flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Go to {result._table}</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}