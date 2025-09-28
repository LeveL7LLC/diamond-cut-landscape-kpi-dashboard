import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Users, Target, TrendingUp, DollarSign, 
  FileText, BarChart3, Calendar, Database, Menu, X
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  insertLeadSourceSchema, insertCsrSchema, insertSalesRepSchema, insertServiceSchema,
  insertDailyLeadsSchema, insertDailyBookingsSchema, insertDailyClosesSchema,
  insertDailyContractsSchema, insertMonthlyFinanceSchema, insertArAgingSchema,
  insertMarginVarianceSchema, insertCustomerConcernsSchema, insertSalesGoalsSchema,
  insertWeeklyCapacitySchema, insertPipelineSnapshotsSchema, insertMonthlyRevenueSchema,
  insertAnnualRevenueSchema,
  type InsertLeadSource, type InsertCsr, type InsertSalesRep, type InsertService,
  type InsertDailyLeads, type InsertDailyBookings, type InsertDailyCloses,
  type InsertDailyContracts, type InsertMonthlyFinance, type InsertArAging,
  type InsertMarginVariance, type InsertCustomerConcerns, type InsertSalesGoals,
  type InsertWeeklyCapacity, type InsertPipelineSnapshots, type InsertMonthlyRevenue,
  type InsertAnnualRevenue
} from "@shared/schema";

export default function DataInput() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("core");
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  // Generic mutation handler for all forms
  const createMutation = (endpoint: string, successMessage: string, invalidateKeys: string[]) => {
    return useMutation({
      mutationFn: async (data: any) => {
        const response = await apiRequest("POST", endpoint, data);
        return response.json();
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: successMessage,
        });
        // Invalidate relevant queries
        invalidateKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to save data",
          variant: "destructive",
        });
      },
    });
  };

  // Core Entity Forms
  const LeadSourceForm = () => {
    const form = useForm<InsertLeadSource>({
      resolver: zodResolver(insertLeadSourceSchema),
      defaultValues: { 
        name: "", 
        value: "", 
        color: "#3b82f6", 
        active: true 
      },
    });

    const mutation = createMutation("/api/lead-sources", "Lead source created successfully", ["/api/lead-sources"]);

    const onSubmit = (data: InsertLeadSource) => {
      mutation.mutate(data);
      form.reset();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Add Lead Source
          </CardTitle>
          <CardDescription>Create a new lead source for tracking purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Google Ads, Referral, Cold Call" {...field} data-testid="input-lead-source-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (for filtering)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., google-ads, referral, cold-call" {...field} data-testid="input-lead-source-value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} data-testid="input-lead-source-color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-lead-source">
                {mutation.isPending ? "Adding..." : "Add Lead Source"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  const CsrForm = () => {
    const form = useForm<InsertCsr>({
      resolver: zodResolver(insertCsrSchema),
      defaultValues: { 
        name: "", 
        value: "", 
        color: "#3b82f6", 
        active: true 
      },
    });

    const mutation = createMutation("/api/csrs", "CSR created successfully", ["/api/csrs"]);

    const onSubmit = (data: InsertCsr) => {
      mutation.mutate(data);
      form.reset();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Add Customer Service Rep
          </CardTitle>
          <CardDescription>Add a new customer service representative</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} data-testid="input-csr-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (for filtering)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., john-smith" {...field} data-testid="input-csr-value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} data-testid="input-csr-color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-csr">
                {mutation.isPending ? "Adding..." : "Add CSR"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  const SalesRepForm = () => {
    const form = useForm<InsertSalesRep>({
      resolver: zodResolver(insertSalesRepSchema),
      defaultValues: { 
        name: "", 
        value: "", 
        color: "#3b82f6", 
        active: true 
      },
    });

    const mutation = createMutation("/api/sales-reps", "Sales rep created successfully", ["/api/sales-reps"]);

    const onSubmit = (data: InsertSalesRep) => {
      mutation.mutate(data);
      form.reset();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-400" />
            Add Sales Representative
          </CardTitle>
          <CardDescription>Add a new sales representative</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} data-testid="input-sales-rep-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (for filtering)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., jane-doe" {...field} data-testid="input-sales-rep-value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} data-testid="input-sales-rep-color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-sales-rep">
                {mutation.isPending ? "Adding..." : "Add Sales Rep"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  const ServiceForm = () => {
    const form = useForm<InsertService>({
      resolver: zodResolver(insertServiceSchema),
      defaultValues: { 
        name: "", 
        value: "", 
        color: "#3b82f6", 
        active: true 
      },
    });

    const mutation = createMutation("/api/services", "Service created successfully", ["/api/services"]);

    const onSubmit = (data: InsertService) => {
      mutation.mutate(data);
      form.reset();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Add Service
          </CardTitle>
          <CardDescription>Add a new service offering</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Landscape Design, Maintenance, Installation" {...field} data-testid="input-service-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (for filtering)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., landscape-design, maintenance" {...field} data-testid="input-service-value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} data-testid="input-service-color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-service">
                {mutation.isPending ? "Adding..." : "Add Service"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  // Daily Metrics Form
  const DailyMetricsForm = () => {
    const [metricType, setMetricType] = useState<"leads" | "bookings" | "closes" | "contracts">("leads");

    const leadsForm = useForm<InsertDailyLeads>({
      resolver: zodResolver(insertDailyLeadsSchema),
      defaultValues: { 
        date: new Date().toISOString().split('T')[0],
        leadSourceId: "",
        count: 0
      },
    });

    const bookingsForm = useForm<InsertDailyBookings>({
      resolver: zodResolver(insertDailyBookingsSchema),
      defaultValues: { 
        date: new Date().toISOString().split('T')[0],
        csrId: "",
        leads: 0,
        appointments: 0
      },
    });

    const closesForm = useForm<InsertDailyCloses>({
      resolver: zodResolver(insertDailyClosesSchema),
      defaultValues: { 
        date: new Date().toISOString().split('T')[0],
        salesRepId: "",
        presented: 0,
        signed: 0
      },
    });

    const contractsForm = useForm<InsertDailyContracts>({
      resolver: zodResolver(insertDailyContractsSchema),
      defaultValues: { 
        date: new Date().toISOString().split('T')[0],
        serviceId: "",
        amount: "0.00"
      },
    });

    const leadsMutation = createMutation("/api/daily-leads", "Daily leads recorded successfully", ["/api/daily-leads"]);
    const bookingsMutation = createMutation("/api/daily-bookings", "Daily bookings recorded successfully", ["/api/daily-bookings"]);
    const closesMutation = createMutation("/api/daily-closes", "Daily closes recorded successfully", ["/api/daily-closes"]);
    const contractsMutation = createMutation("/api/daily-contracts", "Daily contracts recorded successfully", ["/api/daily-contracts"]);

    const onSubmitLeads = (data: InsertDailyLeads) => {
      leadsMutation.mutate(data);
      leadsForm.reset();
    };

    const onSubmitBookings = (data: InsertDailyBookings) => {
      bookingsMutation.mutate(data);
      bookingsForm.reset();
    };

    const onSubmitCloses = (data: InsertDailyCloses) => {
      closesMutation.mutate(data);
      closesForm.reset();
    };

    const onSubmitContracts = (data: InsertDailyContracts) => {
      contractsMutation.mutate(data);
      contractsForm.reset();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Daily Metrics Entry
          </CardTitle>
          <CardDescription>Record daily performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button 
              variant={metricType === "leads" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMetricType("leads")}
              data-testid="button-metric-leads"
            >
              Leads
            </Button>
            <Button 
              variant={metricType === "bookings" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMetricType("bookings")}
              data-testid="button-metric-bookings"
            >
              Bookings
            </Button>
            <Button 
              variant={metricType === "closes" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMetricType("closes")}
              data-testid="button-metric-closes"
            >
              Closes
            </Button>
            <Button 
              variant={metricType === "contracts" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMetricType("contracts")}
              data-testid="button-metric-contracts"
            >
              Contracts
            </Button>
          </div>

          {metricType === "leads" && (
            <Form {...leadsForm}>
              <form onSubmit={leadsForm.handleSubmit(onSubmitLeads)} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={leadsForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-leads-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={leadsForm.control}
                    name="leadSourceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Source ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Lead Source UUID" {...field} data-testid="input-leads-source" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={leadsForm.control}
                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-leads-count"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={leadsMutation.isPending} data-testid="button-submit-leads">
                  {leadsMutation.isPending ? "Recording..." : "Record Leads"}
                </Button>
              </form>
            </Form>
          )}

          {metricType === "bookings" && (
            <Form {...bookingsForm}>
              <form onSubmit={bookingsForm.handleSubmit(onSubmitBookings)} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={bookingsForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-bookings-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookingsForm.control}
                    name="csrId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CSR ID</FormLabel>
                        <FormControl>
                          <Input placeholder="CSR UUID" {...field} data-testid="input-bookings-csr" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookingsForm.control}
                    name="leads"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leads</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-bookings-leads"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bookingsForm.control}
                    name="appointments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointments</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-bookings-appointments"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={bookingsMutation.isPending} data-testid="button-submit-bookings">
                  {bookingsMutation.isPending ? "Recording..." : "Record Bookings"}
                </Button>
              </form>
            </Form>
          )}

          {metricType === "closes" && (
            <Form {...closesForm}>
              <form onSubmit={closesForm.handleSubmit(onSubmitCloses)} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={closesForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-closes-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={closesForm.control}
                    name="salesRepId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Rep ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Sales Rep UUID" {...field} data-testid="input-closes-sales-rep" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={closesForm.control}
                    name="presented"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Presented</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-closes-presented"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={closesForm.control}
                    name="signed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-closes-signed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={closesMutation.isPending} data-testid="button-submit-closes">
                  {closesMutation.isPending ? "Recording..." : "Record Closes"}
                </Button>
              </form>
            </Form>
          )}

          {metricType === "contracts" && (
            <Form {...contractsForm}>
              <form onSubmit={contractsForm.handleSubmit(onSubmitContracts)} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={contractsForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-contracts-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contractsForm.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Service UUID" {...field} data-testid="input-contracts-service" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contractsForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            step="0.01"
                            {...field}
                            data-testid="input-contracts-amount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={contractsMutation.isPending} data-testid="button-submit-contracts">
                  {contractsMutation.isPending ? "Recording..." : "Record Contracts"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    );
  };

  // Financial Data Forms
  const FinancialDataForms = () => {
    const [financialType, setFinancialType] = useState<"monthly-finance" | "ar-aging" | "margin-variance">("monthly-finance");

    const monthlyFinanceForm = useForm<InsertMonthlyFinance>({
      resolver: zodResolver(insertMonthlyFinanceSchema),
      defaultValues: {
        month: new Date().toISOString().split('T')[0],
        grossProfitPercent: "0.00",
        netProfitPercent: "0.00",
        revenue: "0.00"
      },
    });

    const arAgingForm = useForm<InsertArAging>({
      resolver: zodResolver(insertArAgingSchema),
      defaultValues: {
        asOf: new Date().toISOString().split('T')[0],
        bucket030: "0.00",
        bucket3160: "0.00",
        bucket6190: "0.00",
        bucket90plus: "0.00"
      },
    });

    const marginVarianceForm = useForm<InsertMarginVariance>({
      resolver: zodResolver(insertMarginVarianceSchema),
      defaultValues: {
        date: new Date().toISOString().split('T')[0],
        jobName: "",
        bidMargin: "0.00",
        actualMargin: "0.00",
        serviceId: ""
      },
    });

    const monthlyFinanceMutation = createMutation("/api/monthly-finance", "Monthly finance data recorded successfully", ["/api/monthly-finance"]);
    const arAgingMutation = createMutation("/api/ar-aging", "AR aging data recorded successfully", ["/api/ar-aging"]);
    const marginVarianceMutation = createMutation("/api/margin-variance", "Margin variance data recorded successfully", ["/api/margin-variance"]);

    const onSubmitMonthlyFinance = (data: InsertMonthlyFinance) => {
      monthlyFinanceMutation.mutate(data);
      monthlyFinanceForm.reset();
    };

    const onSubmitArAging = (data: InsertArAging) => {
      arAgingMutation.mutate(data);
      arAgingForm.reset();
    };

    const onSubmitMarginVariance = (data: InsertMarginVariance) => {
      marginVarianceMutation.mutate(data);
      marginVarianceForm.reset();
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Financial Data Entry
          </CardTitle>
          <CardDescription>Record financial metrics and performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button 
              variant={financialType === "monthly-finance" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFinancialType("monthly-finance")}
              data-testid="button-financial-monthly"
            >
              Monthly Finance
            </Button>
            <Button 
              variant={financialType === "ar-aging" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFinancialType("ar-aging")}
              data-testid="button-financial-ar"
            >
              AR Aging
            </Button>
            <Button 
              variant={financialType === "margin-variance" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFinancialType("margin-variance")}
              data-testid="button-financial-margin"
            >
              Margin Variance
            </Button>
          </div>

          {financialType === "monthly-finance" && (
            <Form {...monthlyFinanceForm}>
              <form onSubmit={monthlyFinanceForm.handleSubmit(onSubmitMonthlyFinance)} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={monthlyFinanceForm.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-monthly-finance-month" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={monthlyFinanceForm.control}
                    name="grossProfitPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gross Profit %</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-monthly-finance-gross"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={monthlyFinanceForm.control}
                    name="netProfitPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net Profit %</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-monthly-finance-net"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={monthlyFinanceForm.control}
                    name="revenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-monthly-finance-revenue"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={monthlyFinanceMutation.isPending} data-testid="button-submit-monthly-finance">
                  {monthlyFinanceMutation.isPending ? "Recording..." : "Record Monthly Finance"}
                </Button>
              </form>
            </Form>
          )}

          {financialType === "ar-aging" && (
            <Form {...arAgingForm}>
              <form onSubmit={arAgingForm.handleSubmit(onSubmitArAging)} className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <FormField
                    control={arAgingForm.control}
                    name="asOf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>As Of Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-ar-aging-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={arAgingForm.control}
                    name="bucket030"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>0-30 Days ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-ar-aging-0-30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={arAgingForm.control}
                    name="bucket3160"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>31-60 Days ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-ar-aging-31-60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={arAgingForm.control}
                    name="bucket6190"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>61-90 Days ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-ar-aging-61-90"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={arAgingForm.control}
                    name="bucket90plus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>90+ Days ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-ar-aging-90plus"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={arAgingMutation.isPending} data-testid="button-submit-ar-aging">
                  {arAgingMutation.isPending ? "Recording..." : "Record AR Aging"}
                </Button>
              </form>
            </Form>
          )}

          {financialType === "margin-variance" && (
            <Form {...marginVarianceForm}>
              <form onSubmit={marginVarianceForm.handleSubmit(onSubmitMarginVariance)} className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <FormField
                    control={marginVarianceForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-margin-variance-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marginVarianceForm.control}
                    name="jobName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Job/Project Name" {...field} data-testid="input-margin-variance-job" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marginVarianceForm.control}
                    name="bidMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bid Margin %</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-margin-variance-bid"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marginVarianceForm.control}
                    name="actualMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actual Margin %</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field}
                            data-testid="input-margin-variance-actual"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={marginVarianceForm.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service ID (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Service UUID" {...field} data-testid="input-margin-variance-service" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={marginVarianceMutation.isPending} data-testid="button-submit-margin-variance">
                  {marginVarianceMutation.isPending ? "Recording..." : "Record Margin Variance"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    );
  };

  // Analytics Data Forms
  const AnalyticsDataForms = () => {
    const [analyticsType, setAnalyticsType] = useState<"customer-concerns" | "sales-goals" | "capacity-revenue">("customer-concerns");

    const customerConcernsForm = useForm<InsertCustomerConcerns>({
      resolver: zodResolver(insertCustomerConcernsSchema),
      defaultValues: {
        date: new Date().toISOString().split('T')[0],
        concern: "",
        count: 0,
        serviceId: ""
      },
    });

    const salesGoalsForm = useForm<InsertSalesGoals>({
      resolver: zodResolver(insertSalesGoalsSchema),
      defaultValues: {
        month: new Date().toISOString().split('T')[0],
        salesRepId: "",
        goalAmount: "0.00",
        actualAmount: "0.00"
      },
    });

    const weeklyCapacityForm = useForm<InsertWeeklyCapacity>({
      resolver: zodResolver(insertWeeklyCapacitySchema),
      defaultValues: {
        weekOf: new Date().toISOString().split('T')[0],
        totalHours: 0,
        utilizationPercent: "0.00"
      },
    });

    const monthlyRevenueForm = useForm<InsertMonthlyRevenue>({
      resolver: zodResolver(insertMonthlyRevenueSchema),
      defaultValues: {
        month: new Date().toISOString().split('T')[0],
        salesRepId: "",
        amount: "0.00"
      },
    });

    const annualRevenueForm = useForm<InsertAnnualRevenue>({
      resolver: zodResolver(insertAnnualRevenueSchema),
      defaultValues: {
        year: new Date().getFullYear(),
        salesRepId: "",
        amount: "0.00"
      },
    });

    const customerConcernsMutation = createMutation("/api/customer-concerns", "Customer concerns recorded successfully", ["/api/customer-concerns"]);
    const salesGoalsMutation = createMutation("/api/sales-goals", "Sales goals recorded successfully", ["/api/sales-goals"]);
    const weeklyCapacityMutation = createMutation("/api/weekly-capacity", "Weekly capacity recorded successfully", ["/api/weekly-capacity"]);
    const monthlyRevenueMutation = createMutation("/api/monthly-revenue", "Monthly revenue recorded successfully", ["/api/monthly-revenue"]);
    const annualRevenueMutation = createMutation("/api/annual-revenue", "Annual revenue recorded successfully", ["/api/annual-revenue"]);

    const onSubmitCustomerConcerns = (data: InsertCustomerConcerns) => {
      customerConcernsMutation.mutate(data);
      customerConcernsForm.reset();
    };

    const onSubmitSalesGoals = (data: InsertSalesGoals) => {
      salesGoalsMutation.mutate(data);
      salesGoalsForm.reset();
    };

    const onSubmitWeeklyCapacity = (data: InsertWeeklyCapacity) => {
      weeklyCapacityMutation.mutate(data);
      weeklyCapacityForm.reset();
    };

    const onSubmitMonthlyRevenue = (data: InsertMonthlyRevenue) => {
      monthlyRevenueMutation.mutate(data);
      monthlyRevenueForm.reset();
    };

    const onSubmitAnnualRevenue = (data: InsertAnnualRevenue) => {
      annualRevenueMutation.mutate(data);
      annualRevenueForm.reset();
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-400" />
              Analytics Data Entry
            </CardTitle>
            <CardDescription>Record performance analytics and goal tracking data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Button 
                variant={analyticsType === "customer-concerns" ? "default" : "outline"} 
                size="sm"
                onClick={() => setAnalyticsType("customer-concerns")}
                data-testid="button-analytics-concerns"
              >
                Customer Concerns
              </Button>
              <Button 
                variant={analyticsType === "sales-goals" ? "default" : "outline"} 
                size="sm"
                onClick={() => setAnalyticsType("sales-goals")}
                data-testid="button-analytics-goals"
              >
                Sales Goals
              </Button>
              <Button 
                variant={analyticsType === "capacity-revenue" ? "default" : "outline"} 
                size="sm"
                onClick={() => setAnalyticsType("capacity-revenue")}
                data-testid="button-analytics-capacity"
              >
                Capacity & Revenue
              </Button>
            </div>

            {analyticsType === "customer-concerns" && (
              <Form {...customerConcernsForm}>
                <form onSubmit={customerConcernsForm.handleSubmit(onSubmitCustomerConcerns)} className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={customerConcernsForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-concerns-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerConcernsForm.control}
                      name="concern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Concern</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Pricing, Quality, Timeline" {...field} data-testid="input-concerns-concern" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerConcernsForm.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Count</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-concerns-count"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerConcernsForm.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Service UUID" {...field} data-testid="input-concerns-service" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={customerConcernsMutation.isPending} data-testid="button-submit-concerns">
                    {customerConcernsMutation.isPending ? "Recording..." : "Record Customer Concerns"}
                  </Button>
                </form>
              </Form>
            )}

            {analyticsType === "sales-goals" && (
              <Form {...salesGoalsForm}>
                <form onSubmit={salesGoalsForm.handleSubmit(onSubmitSalesGoals)} className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={salesGoalsForm.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Month</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-goals-month" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={salesGoalsForm.control}
                      name="salesRepId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales Rep ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Sales Rep UUID" {...field} data-testid="input-goals-sales-rep" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={salesGoalsForm.control}
                      name="goalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Amount ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field}
                              data-testid="input-goals-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={salesGoalsForm.control}
                      name="actualAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Actual Amount ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field}
                              data-testid="input-goals-actual"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={salesGoalsMutation.isPending} data-testid="button-submit-goals">
                    {salesGoalsMutation.isPending ? "Recording..." : "Record Sales Goals"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {analyticsType === "capacity-revenue" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Capacity</CardTitle>
                <CardDescription>Record weekly team capacity and utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...weeklyCapacityForm}>
                  <form onSubmit={weeklyCapacityForm.handleSubmit(onSubmitWeeklyCapacity)} className="space-y-4">
                    <FormField
                      control={weeklyCapacityForm.control}
                      name="weekOf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Week Of</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-capacity-week" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={weeklyCapacityForm.control}
                      name="totalHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Hours</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-capacity-hours"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={weeklyCapacityForm.control}
                      name="utilizationPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Utilization %</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field}
                              data-testid="input-capacity-utilization"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={weeklyCapacityMutation.isPending} data-testid="button-submit-capacity">
                      {weeklyCapacityMutation.isPending ? "Recording..." : "Record Capacity"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Tracking</CardTitle>
                <CardDescription>Record monthly and annual revenue by sales rep</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Monthly Revenue</h4>
                    <Form {...monthlyRevenueForm}>
                      <form onSubmit={monthlyRevenueForm.handleSubmit(onSubmitMonthlyRevenue)} className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <FormField
                            control={monthlyRevenueForm.control}
                            name="month"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Month</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-monthly-revenue-month" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={monthlyRevenueForm.control}
                            name="salesRepId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sales Rep ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Sales Rep UUID" {...field} data-testid="input-monthly-revenue-rep" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={monthlyRevenueForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    {...field}
                                    data-testid="input-monthly-revenue-amount"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit" size="sm" disabled={monthlyRevenueMutation.isPending} data-testid="button-submit-monthly-revenue">
                          {monthlyRevenueMutation.isPending ? "Recording..." : "Record Monthly Revenue"}
                        </Button>
                      </form>
                    </Form>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Annual Revenue</h4>
                    <Form {...annualRevenueForm}>
                      <form onSubmit={annualRevenueForm.handleSubmit(onSubmitAnnualRevenue)} className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <FormField
                            control={annualRevenueForm.control}
                            name="year"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="2020"
                                    max="2050"
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                                    data-testid="input-annual-revenue-year"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={annualRevenueForm.control}
                            name="salesRepId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sales Rep ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Sales Rep UUID" {...field} data-testid="input-annual-revenue-rep" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={annualRevenueForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    {...field}
                                    data-testid="input-annual-revenue-amount"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit" size="sm" disabled={annualRevenueMutation.isPending} data-testid="button-submit-annual-revenue">
                          {annualRevenueMutation.isPending ? "Recording..." : "Record Annual Revenue"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-neutral-100 hover:bg-neutral-800 p-2 rounded-lg transition-all duration-200"
                  data-testid="hamburger-menu-trigger"
                >
                  <div className="relative w-6 h-6">
                    {/* Animated hamburger/X icon */}
                    <div className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
                      <Menu className="w-6 h-6" />
                    </div>
                    <div className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'}`}>
                      <X className="w-6 h-6" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-2 w-full">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                    {location === "/" && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/data-input" className="flex items-center gap-2 w-full">
                    <Plus className="h-4 w-4" />
                    <span>Data Entry</span>
                    {location === "/data-input" && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <h1 className="text-3xl font-semibold text-neutral-100">
              KPI Data Entry
            </h1>
          </div>
          <p className="text-neutral-400">
            Enter data for Diamond Cut Landscape's key performance indicators
          </p>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core" data-testid="tab-core-entities">
            <Database className="h-4 w-4 mr-2" />
            Core Entities
          </TabsTrigger>
          <TabsTrigger value="daily" data-testid="tab-daily-metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Daily Metrics
          </TabsTrigger>
          <TabsTrigger value="financial" data-testid="tab-financial-data">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Data
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics-data">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadSourceForm />
            <CsrForm />
            <SalesRepForm />
            <ServiceForm />
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <DailyMetricsForm />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialDataForms />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDataForms />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}