import { db } from "../server/db";
import {
  leadSources,
  csrs,
  salesReps,
  services,
  dailyLeads,
  dailyBookings,
  dailyCloses,
  dailyContracts,
  monthlyFinance,
  arAging,
  marginVariance,
  customerConcerns,
  salesGoals,
  weeklyCapacity,
  pipelineSnapshots,
  monthlyRevenue,
  annualRevenue
} from "../shared/schema";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Seed Lead Sources
    console.log("📊 Seeding lead sources...");
    const leadSourceData = [
      { name: "Angi", value: "angi", color: "#22c55e" },
      { name: "Nextdoor", value: "nextdoor", color: "#60a5fa" },
      { name: "Google Ads", value: "google-ads", color: "#f59e0b" },
      { name: "Google LSA", value: "google-lsa", color: "#a78bfa" },
      { name: "Postcards", value: "postcards", color: "#34d399" },
      { name: "Website", value: "website", color: "#93c5fd" }
    ];
    
    const insertedLeadSources = await db.insert(leadSources).values(leadSourceData).returning();
    console.log(`✅ Inserted ${insertedLeadSources.length} lead sources`);

    // 2. Seed CSRs
    console.log("👥 Seeding CSRs...");
    const csrData = [
      { name: "Ava", value: "ava", color: "#f59e0b" },
      { name: "Marco", value: "marco", color: "#22c55e" },
      { name: "Tia", value: "tia", color: "#60a5fa" },
      { name: "Jordan", value: "jordan", color: "#a78bfa" }
    ];
    
    const insertedCSRs = await db.insert(csrs).values(csrData).returning();
    console.log(`✅ Inserted ${insertedCSRs.length} CSRs`);

    // 3. Seed Sales Reps
    console.log("💼 Seeding sales reps...");
    const salesRepData = [
      { name: "Diego", value: "diego", color: "#22c55e" },
      { name: "Brooke", value: "brooke", color: "#60a5fa" },
      { name: "Sam", value: "sam", color: "#f59e0b" },
      { name: "Lena", value: "lena", color: "#a78bfa" }
    ];
    
    const insertedSalesReps = await db.insert(salesReps).values(salesRepData).returning();
    console.log(`✅ Inserted ${insertedSalesReps.length} sales reps`);

    // 4. Seed Services
    console.log("🛠️ Seeding services...");
    const serviceData = [
      { name: "Hardscapes", value: "hardscapes", color: "#22c55e" },
      { name: "Planting", value: "planting", color: "#60a5fa" },
      { name: "Irrigation", value: "irrigation", color: "#f59e0b" },
      { name: "Lighting", value: "lighting", color: "#a78bfa" },
      { name: "Pergolas", value: "pergolas", color: "#34d399" },
      { name: "Water Features", value: "water-features", color: "#93c5fd" },
      { name: "Turf", value: "turf", color: "#ef4444" }
    ];
    
    const insertedServices = await db.insert(services).values(serviceData).returning();
    console.log(`✅ Inserted ${insertedServices.length} services`);

    // 5. Seed Daily Leads (last 30 days)
    console.log("📈 Seeding daily leads data...");
    const dailyLeadsData = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const source of insertedLeadSources) {
        dailyLeadsData.push({
          date: dateStr,
          leadSourceId: source.id,
          count: Math.floor(Math.random() * 15) + 5 // 5-20 leads per day per source
        });
      }
    }
    
    await db.insert(dailyLeads).values(dailyLeadsData);
    console.log(`✅ Inserted ${dailyLeadsData.length} daily leads records`);

    // 6. Seed Daily Bookings
    console.log("📅 Seeding daily bookings data...");
    const dailyBookingsData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const csr of insertedCSRs) {
        dailyBookingsData.push({
          date: dateStr,
          csrId: csr.id,
          leads: Math.floor(Math.random() * 20) + 10, // 10-30 leads
          appointments: Math.floor(Math.random() * 15) + 5 // 5-20 appointments
        });
      }
    }
    
    await db.insert(dailyBookings).values(dailyBookingsData);
    console.log(`✅ Inserted ${dailyBookingsData.length} daily bookings records`);

    // 7. Seed Daily Closes
    console.log("🤝 Seeding daily closes data...");
    const dailyClosesData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const rep of insertedSalesReps) {
        dailyClosesData.push({
          date: dateStr,
          salesRepId: rep.id,
          presented: Math.floor(Math.random() * 8) + 2, // 2-10 presentations
          signed: Math.floor(Math.random() * 4) + 1 // 1-5 signed
        });
      }
    }
    
    await db.insert(dailyCloses).values(dailyClosesData);
    console.log(`✅ Inserted ${dailyClosesData.length} daily closes records`);

    // 8. Seed Daily Contracts
    console.log("💰 Seeding daily contracts data...");
    const dailyContractsData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const service of insertedServices) {
        // Random chance of having a contract on any given day
        if (Math.random() > 0.3) {
          dailyContractsData.push({
            date: dateStr,
            serviceId: service.id,
            amount: (Math.random() * 50000 + 10000).toFixed(2) // $10k-$60k contracts
          });
        }
      }
    }
    
    await db.insert(dailyContracts).values(dailyContractsData);
    console.log(`✅ Inserted ${dailyContractsData.length} daily contracts records`);

    // 9. Seed Sales Goals (current month)
    console.log("🎯 Seeding sales goals...");
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const salesGoalsData = insertedSalesReps.map(rep => ({
      salesRepId: rep.id,
      period: currentMonth.toISOString().split('T')[0],
      goalAmount: "200000.00", // $200k goal per rep
      actualAmount: (Math.random() * 250000 + 150000).toFixed(2), // $150k-$400k actual
      periodType: "monthly"
    }));
    
    await db.insert(salesGoals).values(salesGoalsData);
    console.log(`✅ Inserted ${salesGoalsData.length} sales goals records`);

    // 10. Seed Monthly Finance (last 6 months)
    console.log("📊 Seeding monthly finance data...");
    const monthlyFinanceData = [];
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthlyFinanceData.push({
        month: month.toISOString().split('T')[0],
        grossProfitPercent: (Math.random() * 0.1 + 0.4).toFixed(2), // 40-50%
        netProfitPercent: (Math.random() * 0.08 + 0.15).toFixed(2), // 15-23%
        revenue: (Math.random() * 200000 + 800000).toFixed(2) // $800k-$1M
      });
    }
    
    await db.insert(monthlyFinance).values(monthlyFinanceData);
    console.log(`✅ Inserted ${monthlyFinanceData.length} monthly finance records`);

    // 11. Seed AR Aging (weekly snapshots)
    console.log("📋 Seeding AR aging data...");
    const arAgingData = [];
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      const base = 60000 + Math.random() * 10000;
      
      arAgingData.push({
        asOf: date.toISOString().split('T')[0],
        bucket030: base.toFixed(2),
        bucket3160: (base * 0.45).toFixed(2),
        bucket6190: (base * 0.2).toFixed(2),
        bucket90plus: (base * 0.12).toFixed(2)
      });
    }
    
    await db.insert(arAging).values(arAgingData);
    console.log(`✅ Inserted ${arAgingData.length} AR aging records`);

    // 12. Seed Weekly Capacity (next 4 weeks)
    console.log("⏰ Seeding weekly capacity data...");
    const weeklyCapacityData = [];
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + (i * 7));
      
      weeklyCapacityData.push({
        weekStarting: weekStart.toISOString().split('T')[0],
        availableHours: 360,
        bookedHours: Math.floor(Math.random() * 120) + 300 // 300-420 hours
      });
    }
    
    await db.insert(weeklyCapacity).values(weeklyCapacityData);
    console.log(`✅ Inserted ${weeklyCapacityData.length} weekly capacity records`);

    // 13. Seed Annual Revenue (2024)
    console.log("📈 Seeding annual revenue data...");
    const annualRevenueData = [
      // Company total
      {
        year: 2024,
        goalAmount: "5200000.00", // $5.2M goal
        actualAmount: "3850000.00", // $3.85M actual
        salesRepId: null
      },
      // Individual reps
      ...insertedSalesReps.map(rep => ({
        year: 2024,
        goalAmount: "1300000.00", // $1.3M goal per rep
        actualAmount: rep.value === "diego" ? "1650000.00" :
                     rep.value === "brooke" ? "1450000.00" :
                     rep.value === "sam" ? "750000.00" : "1000000.00",
        salesRepId: rep.id
      }))
    ];
    
    await db.insert(annualRevenue).values(annualRevenueData);
    console.log(`✅ Inserted ${annualRevenueData.length} annual revenue records`);

    // 14. Seed Customer Concerns
    console.log("⚠️ Seeding customer concerns data...");
    const customerConcernsData = [];
    
    const concernDescriptions = [
      "Pricing concerns about landscape design",
      "Quality issues with recent installation",
      "Timeline delays on maintenance schedule",
      "Communication gaps during project",
      "Weather-related service delays",
      "Equipment noise complaints",
      "Billing discrepancy questions",
      "Service scope clarification needed"
    ];
    
    for (let i = 0; i < 17; i++) { // 17 total concerns to match dashboard
      const concernDate = new Date(today);
      concernDate.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Last 30 days
      
      customerConcernsData.push({
        date: concernDate.toISOString().split('T')[0],
        description: concernDescriptions[i % concernDescriptions.length],
        priority: ['Low', 'Med', 'High'][Math.floor(Math.random() * 3)],
        serviceId: Math.random() > 0.5 ? insertedServices[Math.floor(Math.random() * insertedServices.length)].id : null
      });
    }
    
    await db.insert(customerConcerns).values(customerConcernsData);
    console.log(`✅ Inserted ${customerConcernsData.length} customer concerns records`);

    // 15. Seed Margin Variance (last 20 jobs)
    console.log("📊 Seeding margin variance data...");
    const marginVarianceData = [];
    
    const jobNames = [
      "Sunset Ridge Hardscape", "Oakwood Irrigation Install", "Pine Valley Lighting",
      "Maple Street Pergola", "Cedar Park Water Feature", "Birch Lane Turf Install",
      "Willow Creek Planting", "Elm Street Hardscape", "Aspen Heights Lighting",
      "Redwood Gardens Irrigation", "Cypress Point Pergola", "Magnolia Drive Turf",
      "Hickory Hills Planting", "Poplar Grove Hardscape", "Sycamore Court Lighting",
      "Chestnut Ridge Water Feature", "Dogwood Lane Irrigation", "Spruce Valley Pergola",
      "Juniper Park Turf", "Cottonwood Creek Planting"
    ];
    
    for (let i = 0; i < 20; i++) {
      const jobDate = new Date(today);
      jobDate.setDate(today.getDate() - Math.floor(Math.random() * 60)); // Last 60 days
      
      const bidMargin = (Math.random() * 15 + 25).toFixed(2); // 25-40% bid margin
      const actualMargin = (parseFloat(bidMargin) + (Math.random() * 10 - 5)).toFixed(2); // ±5% variance
      
      marginVarianceData.push({
        date: jobDate.toISOString().split('T')[0],
        jobName: jobNames[i],
        bidMargin: bidMargin,
        actualMargin: Math.max(0, parseFloat(actualMargin)).toFixed(2), // Ensure non-negative
        serviceId: insertedServices[Math.floor(Math.random() * insertedServices.length)].id
      });
    }
    
    await db.insert(marginVariance).values(marginVarianceData);
    console.log(`✅ Inserted ${marginVarianceData.length} margin variance records`);

    // 16. Seed Pipeline Snapshots (daily for last 30 days)
    console.log("🔄 Seeding pipeline snapshots data...");
    const pipelineSnapshotsData = [];
    const stages = ["leads", "qualified", "quoted", "closed"];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let cumulativeValue = 0;
      stages.forEach((stage, index) => {
        let stageValue;
        if (stage === "leads") {
          stageValue = Math.random() * 200000 + 800000; // $800k-$1M in leads
        } else if (stage === "qualified") {
          stageValue = cumulativeValue * (0.6 + Math.random() * 0.2); // 60-80% of previous
        } else if (stage === "quoted") {
          stageValue = cumulativeValue * (0.4 + Math.random() * 0.2); // 40-60% of previous
        } else { // closed
          stageValue = cumulativeValue * (0.2 + Math.random() * 0.15); // 20-35% of previous
        }
        
        cumulativeValue = stageValue;
        
        pipelineSnapshotsData.push({
          date: dateStr,
          stage: stage,
          value: stageValue.toFixed(2)
        });
      });
    }
    
    await db.insert(pipelineSnapshots).values(pipelineSnapshotsData);
    console.log(`✅ Inserted ${pipelineSnapshotsData.length} pipeline snapshots records`);

    // 17. Seed Monthly Revenue (last 12 months)
    console.log("💰 Seeding monthly revenue data...");
    const monthlyRevenueData = [];
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = month.toISOString().split('T')[0];
      
      // Company total
      const companyGoal = 450000 + Math.random() * 100000; // $450k-$550k goal
      const companyActual = companyGoal * (0.8 + Math.random() * 0.4); // 80-120% of goal
      
      monthlyRevenueData.push({
        month: monthStr,
        goalAmount: companyGoal.toFixed(2),
        actualAmount: companyActual.toFixed(2),
        salesRepId: null // Company total
      });
      
      // Individual sales rep data
      insertedSalesReps.forEach(rep => {
        const repGoal = 112500 + Math.random() * 25000; // ~$112k-$137k per rep
        const repActual = repGoal * (0.7 + Math.random() * 0.6); // 70-130% of goal
        
        monthlyRevenueData.push({
          month: monthStr,
          goalAmount: repGoal.toFixed(2),
          actualAmount: repActual.toFixed(2),
          salesRepId: rep.id
        });
      });
    }
    
    await db.insert(monthlyRevenue).values(monthlyRevenueData);
    console.log(`✅ Inserted ${monthlyRevenueData.length} monthly revenue records`);

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding when this file is executed directly
console.log("🚀 Starting database seeding process...");
seedDatabase()
  .then(() => {
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedDatabase };