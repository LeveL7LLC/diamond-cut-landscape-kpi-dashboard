import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronUp, 
  ChevronDown, 
  Edit2, 
  Save, 
  X, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import EditModal from './EditModal';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'date' | 'email' | 'select';
  options?: string[]; // For select type
  width?: string;
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (id: string, field: string, value: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  loading?: boolean;
  pageSize?: number;
  searchable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  exportFileName?: string;
  className?: string;
}

export default function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  onBulkDelete,
  loading = false,
  pageSize = 10,
  searchable = false,
  selectable = false,
  exportable = false,
  exportFileName = 'data',
  className
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    let filtered = sortedData;
    
    // Apply global search
    if (searchable && searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column =>
          String(row[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply column-specific filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter(row =>
          String(row[columnKey] || '').toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });
    
    return filtered;
  }, [sortedData, searchTerm, columnFilters, columns, searchable]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Edit handlers
  const handleEditRow = (row: any) => {
    setEditingRow(row);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData: Record<string, any>) => {
    if (editingRow && onEdit) {
      try {
        // Update each changed field
        for (const [field, value] of Object.entries(updatedData)) {
          if (value !== editingRow[field]) {
            await onEdit(editingRow.id, field, value);
          }
        }
      } catch (error) {
        console.error('Failed to save edit:', error);
        throw error;
      }
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingRow(null);
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedRows.size === 0) return;
    
    try {
      await onBulkDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Export functions
  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = filteredData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = filteredData.map(row => {
      const exportRow: any = {};
      columns.forEach(col => {
        exportRow[col.label] = row[col.key];
      });
      return exportRow;
    });
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCell = (row: any, column: Column) => {
    const value = row[column.key];
    
    // Format the value based on column type
    if (column.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (column.type === 'date' && value) {
      // Handle date formatting without timezone conversion
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // If it's already in YYYY-MM-DD format, format it directly
        const [year, month, day] = value.split('-');
        return `${month}/${day}/${year}`;
      }
      // For other date formats, use toLocaleDateString but ensure correct timezone
      const date = new Date(value + 'T00:00:00'); // Add time to avoid timezone issues
      return date.toLocaleDateString();
    }
    
    if (column.type === 'service-select') {
      // For service-select columns, show the service name if available
      return row.serviceName || (value ? 'Unknown Service' : '');
    }
    
    return value || '';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and bulk actions */}
      {(searchable || exportable || (selectable && selectedRows.size > 0)) && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {searchable && (
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Input
                  placeholder="Search all columns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-1",
                    showFilters && "bg-primary text-primary-foreground"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            )}

             <div className="flex items-center gap-2">
               {exportable && (
                 <div className="flex items-center gap-1">
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={exportToCSV}
                     className="flex items-center gap-1"
                   >
                     <Download className="h-4 w-4" />
                     CSV
                   </Button>
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={exportToJSON}
                     className="flex items-center gap-1"
                   >
                     <Download className="h-4 w-4" />
                     JSON
                   </Button>
                 </div>
               )}
               
               {selectable && selectedRows.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedRows.size} selected
                    </span>
                    {onBulkDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onBulkDelete(Array.from(selectedRows))}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Selected
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

          {/* Column Filters */}
          {searchable && showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4 bg-gray-50 rounded-lg">
              {columns.map((column) => (
                <div key={column.key} className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    {column.label}
                  </label>
                  <Input
                    placeholder={`Filter ${column.label.toLowerCase()}...`}
                    value={columnFilters[column.key] || ''}
                    onChange={(e) => 
                      setColumnFilters(prev => ({
                        ...prev,
                        [column.key]: e.target.value
                      }))
                    }
                    className="h-8 text-sm"
                  />
                </div>
              ))}
              <div className="flex items-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setColumnFilters({})}
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={cn(
                    column.sortable && "cursor-pointer hover:bg-gray-50",
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 2 : 1)} 
                  className="text-center py-8"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 2 : 1)} 
                  className="text-center py-8 text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={(checked) => 
                          handleSelectRow(row.id, checked as boolean)
                        }
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRow(row)}
                          title="Edit record"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(row.id)}
                          title="Delete record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
            {filteredData.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
        data={editingRow || {}}
        columns={columns}
        title="Edit Record"
      />
    </div>
  );
}