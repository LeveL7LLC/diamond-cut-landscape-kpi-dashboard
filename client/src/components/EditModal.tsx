import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServices } from '@/hooks/useApiData';
import type { Column } from './DataTable';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<void>;
  data: Record<string, any>;
  columns: Column[];
  title?: string;
}

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  data,
  columns,
  title = "Edit Record"
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { data: services } = useServices();

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && data) {
      setFormData({ ...data });
    }
  }, [isOpen, data]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderField = (column: Column) => {
    const value = formData[column.key] || '';

    if (!column.editable) {
      return (
        <div className="space-y-2">
          <Label htmlFor={column.key}>{column.label}</Label>
          <Input
            id={column.key}
            value={value}
            disabled
            className="bg-gray-50"
          />
        </div>
      );
    }

    switch (column.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(column.key, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${column.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {column.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Input
              id={column.key}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(column.key, e.target.value)}
              step={column.key.includes('rate') || column.key.includes('margin') ? '0.01' : '1'}
            />
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Input
              id={column.key}
              type="date"
              value={value ? new Date(value).toISOString().split('T')[0] : ''}
              onChange={(e) => handleFieldChange(column.key, e.target.value)}
            />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Input
              id={column.key}
              type="email"
              value={value}
              onChange={(e) => handleFieldChange(column.key, e.target.value)}
            />
          </div>
        );

      case 'service-select':
        return (
          <div className="space-y-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Select
              value={value || ''}
              onValueChange={(newValue) => handleFieldChange(column.key, newValue === 'none' ? null : newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Service</SelectItem>
                {services?.map((service: any) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={column.key}>{column.label}</Label>
            <Input
              id={column.key}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(column.key, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Make changes to the record below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {columns.map((column) => (
            <div key={column.key}>
              {renderField(column)}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}