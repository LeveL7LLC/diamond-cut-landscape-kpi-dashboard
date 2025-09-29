// Centralized mock data for fallbacks when database is empty
// This file contains all the original hardcoded data from the project

// Lead Sources Mock Data
export const MOCK_LEAD_SOURCES = [
  { name: "Angi", color: "#22c55e", count: 42 },
  { name: "Nextdoor", color: "#60a5fa", count: 38 },
  { name: "Google Ads", color: "#f59e0b", count: 35 },
  { name: "Google LSA", color: "#a78bfa", count: 28 }
];

// Calculate total qualified leads from mock data
export const MOCK_QUALIFIED_LEADS_TOTAL = MOCK_LEAD_SOURCES.reduce((sum, source) => sum + source.count, 0);

// CSRs Mock Data with booking counts
export const MOCK_CSRS = [
  { name: "Ava", color: "#f59e0b", bookings: 12 },
  { name: "Marco", color: "#22c55e", bookings: 15 },
  { name: "Tia", color: "#60a5fa", bookings: 11 },
  { name: "Jordan", color: "#a78bfa", bookings: 8 }
];

// Calculate total bookings from mock data
export const MOCK_TOTAL_BOOKINGS = MOCK_CSRS.reduce((sum, csr) => sum + csr.bookings, 0);

// Calculate booking rate from mock data (bookings / leads * 100)
export const MOCK_BOOKING_RATE = Math.round((MOCK_TOTAL_BOOKINGS / MOCK_QUALIFIED_LEADS_TOTAL) * 100);

// Sales Reps Mock Data with close counts
export const MOCK_SALES_REPS = [
  { name: "Diego", color: "#22c55e", closes: 8 },
  { name: "Brooke", color: "#60a5fa", closes: 9 },
  { name: "Sam", color: "#f59e0b", closes: 7 },
  { name: "Lena", color: "#a78bfa", closes: 7 }
];

// Calculate total closes from mock data
export const MOCK_TOTAL_CLOSES = MOCK_SALES_REPS.reduce((sum, rep) => sum + rep.closes, 0);

// Calculate close rate from mock data (closes / bookings * 100)
export const MOCK_CLOSE_RATE = Math.round((MOCK_TOTAL_CLOSES / MOCK_TOTAL_BOOKINGS) * 100);

// Services Mock Data with contract values
export const MOCK_SERVICES = [
  { name: "Landscape Design", color: "#22c55e", contracts: 8, totalValue: 280000 },
  { name: "Hardscaping", color: "#60a5fa", contracts: 6, totalValue: 210000 },
  { name: "Maintenance", color: "#f59e0b", contracts: 10, totalValue: 150000 },
  { name: "Irrigation", color: "#a78bfa", contracts: 7, totalValue: 175000 }
];

// Calculate total contracts and value from mock data
export const MOCK_TOTAL_CONTRACTS = MOCK_SERVICES.reduce((sum, service) => sum + service.contracts, 0);
export const MOCK_TOTAL_CONTRACT_VALUE = MOCK_SERVICES.reduce((sum, service) => sum + service.totalValue, 0);

// Calculate average contract value from mock data
export const MOCK_AVG_CONTRACT_VALUE = Math.round(MOCK_TOTAL_CONTRACT_VALUE / MOCK_TOTAL_CONTRACTS);

// Profit Mock Data
export const MOCK_PROFIT_DATA = {
  grossProfit: {
    value: 0.46, // 46%
    mom: 0.024   // 2.4% month-over-month
  },
  netProfit: {
    value: 0.20, // 20%
    mom: -0.008  // -0.8% month-over-month
  }
};

// Monthly Revenue Mock Data
export const MOCK_MONTHLY_REVENUE = {
  currentRevenue: 425000, // $425k
  goal: 500000, // $500k
  salesRepContributions: [
    { name: "Diego", amount: 180000, color: "primary" },
    { name: "Brooke", amount: 165000, color: "chart-2" },
    { name: "Sam", amount: 80000, color: "chart-3" }
  ]
};

// Calculate total from sales reps (should match currentRevenue)
export const MOCK_TOTAL_REP_REVENUE = MOCK_MONTHLY_REVENUE.salesRepContributions.reduce(
  (sum, rep) => sum + rep.amount, 0
);

// Calculate progress percentage
export const MOCK_REVENUE_PROGRESS = Math.round((MOCK_MONTHLY_REVENUE.currentRevenue / MOCK_MONTHLY_REVENUE.goal) * 100);

// Progress Billing Mock Data
export const MOCK_PROGRESS_BILLING = {
  onTimeRate: 0.78 // 78% on-time billing rate
};

// Project Collections Mock Data
export const MOCK_PROJECT_COLLECTIONS = {
  totalCollections: 487320, // $487,320
  collectedPercentage: 65, // 65% collected
  outstandingPercentage: 35 // 35% outstanding
};

// Collection Due Mock Data
export const MOCK_COLLECTION_DUE = {
  totalDue: 89450 // $89,450
};

// Customer Concerns Mock Data
export const MOCK_CUSTOMER_CONCERNS = {
  openConcerns: 17 // 17 active CCIs
};

// KPI Tiles Mock Values
export const MOCK_KPI_VALUES = {
  qualifiedLeads: MOCK_QUALIFIED_LEADS_TOTAL.toString(), // "143"
  bookingRate: `${MOCK_BOOKING_RATE}%`, // Calculated from mock data
  closeRate: `${MOCK_CLOSE_RATE}%`, // Calculated from mock data
  avgContractValue: `$${MOCK_AVG_CONTRACT_VALUE.toLocaleString()}`, // Calculated from mock data
  projectCollections: `$${MOCK_PROJECT_COLLECTIONS.totalCollections.toLocaleString()}`, // Calculated from mock data
  collectionDue: `$${MOCK_COLLECTION_DUE.totalDue.toLocaleString()}`, // Calculated from mock data
  customerConcerns: MOCK_CUSTOMER_CONCERNS.openConcerns.toString() // Calculated from mock data
};

// Charts Mock Data
export const MOCK_SALES_GOALS = [
  { name: "Diego", actual: 185, goal: 200 },
  { name: "Brooke", actual: 195, goal: 200 },
  { name: "Sam", actual: 210, goal: 200 },
  { name: "Lena", actual: 188, goal: 200 }
];

export const MOCK_AR_AGING = [
  { name: "0-30", value: 65, amount: 65000 },
  { name: "31-60", value: 25, amount: 25000 },
  { name: "61-90", value: 8, amount: 8000 },
  { name: "90+", value: 2, amount: 2000 }
];

export const MOCK_MARGIN_VARIANCE = [
  { month: "Jan", actual: 42, target: 45 },
  { month: "Feb", actual: 38, target: 45 },
  { month: "Mar", actual: 48, target: 45 },
  { month: "Apr", actual: 52, target: 45 },
  { month: "May", actual: 44, target: 45 },
  { month: "Jun", actual: 46, target: 45 }
];

export const MOCK_SERVICE_MIX = [
  { name: "Hardscapes", value: 35, color: "#22c55e" },
  { name: "Planting", value: 25, color: "#60a5fa" },
  { name: "Irrigation", value: 20, color: "#f59e0b" },
  { name: "Lighting", value: 12, color: "#a78bfa" },
  { name: "Other", value: 8, color: "#ef4444" }
];

export const MOCK_WEEKLY_CAPACITY = [
  { week: "Wk1", capacity: 400, utilization: 380 }, // Normal week, slight underutilization
  { week: "Wk2", capacity: 400, utilization: 340 }, // Someone called out sick, lower utilization
  { week: "Wk3", capacity: 400, utilization: 420 }, // Overtime week, utilization exceeds capacity
  { week: "Wk4", capacity: 400, utilization: 385 }  // Normal week, close to capacity
];