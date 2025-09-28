import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { DollarSign, PhoneCall, CalendarCheck2, ClipboardCheck, AlertTriangle, ChevronDown, Check } from "lucide-react";

// ---- THEME ----
const brand = {
  bg: "bg-neutral-950",
  panel: "bg-neutral-900/80",
  text: "text-neutral-100",
  accent: "#22c55e", // emerald
  accent2: "#60a5fa", // blue
  warn: "#f59e0b", // amber
  danger: "#ef4444" // red
};

// ---- UTIL ----
const big = (n:number) => n.toLocaleString();
const pct = (n:number, d=0) => `${(n*100).toFixed(d)}%`;
const fmtDate = (d: Date) => d.toISOString().slice(0,10);
const initRange = (days:number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return { start: fmtDate(start), end: fmtDate(end), preset: (days+"d") as '7d'|'30d'|'90d' };
};
const inRange = (dateStr:string, range:{start:string; end:string}) => dateStr >= range.start && dateStr <= range.end;
const sum = (arr:number[]) => arr.reduce((a,b)=>a+b,0);
const avg = (arr:number[]) => arr.length? sum(arr)/arr.length : 0;
const daysInRange = (start:string, end:string) => {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.max(1, Math.floor(ms / (24*60*60*1000)) + 1);
};

// ---- CONFIG: Lead Sources ----
const LEAD_SOURCES = [
  "Angi",
  "Nextdoor",
  "Google Ads",
  "Google LSA",
  "Postcards",
  "Website",
] as const;

type LeadSource = typeof LEAD_SOURCES[number];

// ---- CONFIG: CSRs (for Booking Rate) ----
const CSR_LIST = ["Ava", "Marco", "Tia", "Jordan"] as const;
type CSR = typeof CSR_LIST[number];

// ---- CONFIG: Sales reps (for Close Rate & Goals) ----
const SALES_LIST = ["Diego", "Brooke", "Sam", "Lena"] as const;
type SalesRep = typeof SALES_LIST[number];

const LEAD_COLORS: Record<LeadSource, string> = {
  "Angi": "#22c55e",
  "Nextdoor": "#60a5fa",
  "Google Ads": "#f59e0b",
  "Google LSA": "#a78bfa",
  "Postcards": "#34d399",
  "Website": "#93c5fd",
};

const CSR_COLORS: Record<CSR, string> = {
  Ava: "#f59e0b",
  Marco: "#22c55e",
  Tia: "#60a5fa",
  Jordan: "#a78bfa",
};

const SALES_COLORS: Record<SalesRep, string> = {
  Diego: "#22c55e",
  Brooke: "#60a5fa",
  Sam: "#f59e0b",
  Lena: "#a78bfa",
};

// ---- SAMPLE TIME‑SERIES (replace with live API data) ----
// 1) Leads by source per day
const tsLeads: {date:string; source:LeadSource; leads:number}[] = (()=>{
  const arr: {date:string; source:LeadSource; leads:number}[] = [];
  for(let i=60;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const date = fmtDate(d);
    LEAD_SOURCES.forEach((source, idx)=>{
      const base = 2 + (idx%3); // vary by source a bit
      const season = Math.max(0, Math.round(base + Math.sin((i+idx)/7)*1.5 + (Math.random()*2-1)));
      arr.push({ date, source, leads: season });
    });
  }
  return arr;
})();

// 2) Aggregate daily totals, bookings, closes
const tsDailyLeadTotals = (()=>{
  const map: Record<string, number> = {};
  tsLeads.forEach(r=>{ map[r.date] = (map[r.date]||0) + r.leads; });
  return Object.entries(map).map(([date, leads])=>({date, leads}));
})();

const tsBookings: {date:string; appts:number; leads:number}[] = tsDailyLeadTotals.map(r=>({
  date: r.date,
  leads: r.leads,
  appts: Math.round(r.leads * (0.32 + (Math.sin(new Date(r.date).getDate()/31*6.28)*0.03)))
}));

// CSR-level synthetic split for bookings and leads
const tsBookingsCSR: {date:string; csr:CSR; leads:number; appts:number}[] = (()=>{
  const series: {date:string; csr:CSR; leads:number; appts:number}[] = [];
  tsDailyLeadTotals.forEach(day=>{
    const weights = CSR_LIST.map(()=> 0.2 + Math.random());
    const totalW = weights.reduce((a,b)=>a+b,0);
    CSR_LIST.forEach((csr, idx)=>{
      const share = weights[idx]/totalW;
      const leads = Math.round(day.leads * share);
      const appts = Math.round(leads * (0.32 + (Math.sin((idx+day.leads)%10)*0.03)));
      series.push({ date: day.date, csr, leads, appts });
    });
  });
  return series;
})();

const tsCloses: {date:string; presented:number; signed:number}[] = tsDailyLeadTotals.map(r=>({
  date: r.date,
  presented: Math.round(r.leads * 0.55),
  signed: Math.round(r.leads * 0.20 + (Math.random()*2))
}));

// Sales-rep level synthetic split for closes
const tsClosesSales: {date:string; rep:SalesRep; presented:number; signed:number}[] = (()=>{
  const series: {date:string; rep:SalesRep; presented:number; signed:number}[] = [];
  tsDailyLeadTotals.forEach(day=>{
    const weights = SALES_LIST.map(()=> 0.2 + Math.random());
    const totalW = weights.reduce((a,b)=>a+b,0);
    const dayPresented = Math.round(day.leads * 0.55);
    const daySigned = Math.round(day.leads * 0.20 + (Math.random()*2));
    SALES_LIST.forEach((rep, idx)=>{
      const share = weights[idx]/totalW;
      const presented = Math.round(dayPresented * share);
      const signed = Math.round(daySigned * share * (0.95 + Math.random()*0.1));
      series.push({ date: day.date, rep, presented, signed });
    });
  });
  return series;
})();

// 3) Contracts by service
const tsContracts: {date:string; amount:number; service:string}[] = Array.from({length:90}, (_,i)=>{
  const d = new Date(); d.setDate(d.getDate()-i);
  const services = ["Hardscapes","Planting","Irrigation","Lighting","Pergolas","Water Features","Turf"];
  const service = services[Math.floor(Math.random()*services.length)];
  const amount = 12000 + Math.round(Math.random()*30000);
  return { date: fmtDate(d), amount, service };
}).reverse();

// 4) Pipeline snapshots
const tsPipeline: {date:string; stage:string; value:number}[] = ["Consult","Design","Bid","Signed"].flatMap(stage=>
  Array.from({length:8}, (_,i)=>{ const d=new Date(); d.setDate(d.getDate()-i*3); return {date: fmtDate(d), stage, value: Math.round(50000+Math.random()*300000)}; })
);

// 5) Finance monthly for GP/NP (month keys are first of month)
const tsFinance: {month:string; gross:number; net:number}[] = [
  {month:"2025-05-01", gross:0.42, net:0.16},
  {month:"2025-06-01", gross:0.45, net:0.18},
  {month:"2025-07-01", gross:0.43, net:0.17},
  {month:"2025-08-01", gross:0.44, net:0.19},
  {month:"2025-09-01", gross:0.46, net:0.20},
];

// 6) AR aging snapshots
const tsARAging: {asOf:string; buckets:{bucket:string; amount:number}[]}[] = Array.from({length:6}, (_,i)=>{
  const d = new Date(); d.setDate(d.getDate()-i*7);
  const base = 60000 + Math.random()*10000;
  return { asOf: fmtDate(d), buckets:[
    { bucket:"0-30", amount: Math.round(base) },
    { bucket:"31-60", amount: Math.round(base*0.45) },
    { bucket:"61-90", amount: Math.round(base*0.2) },
    { bucket:"90+", amount: Math.round(base*0.12) },
  ]};
});

// 7) Capacity (static demo)
const capacitySeries = [
  { week: "Wk1", booked: 380, avail: 360 },
  { week: "Wk2", booked: 340, avail: 360 },
  { week: "Wk3", booked: 420, avail: 360 },
  { week: "Wk4", booked: 300, avail: 360 }
];

// 8) Margin variance (sample finished jobs)
const tsMarginVariance: {date:string; job:string; bid:number; actual:number}[] = Array.from({length:14}, (_,i)=>{
  const d=new Date(); d.setDate(d.getDate()-i*6);
  return {date: fmtDate(d), job: `#${1840+i}`, bid: 0.44 + (Math.random()*0.06-0.03), actual: 0.44 + (Math.random()*0.14-0.07)};
});

// 9) Customer Concerns (CCIs) — mock list (TOTAL is not tied to date range)
const tsCCIs: {id:number; openedAt:string; status:'open'|'closed'}[] = Array.from({length: 28}, (_, i)=>({
  id: 1000 + i,
  openedAt: fmtDate(new Date(Date.now() - i*86400000)),
  status: Math.random() > 0.35 ? 'closed' : 'open'
}));

const COLORS = ["#22c55e", "#60a5fa", "#f59e0b", "#ef4444", "#a78bfa", "#34d399", "#93c5fd"]; // safe defaults
const colorForService = (name:string)=>{ let h=0; for(let i=0;i<name.length;i++){ h=(h*31 + name.charCodeAt(i))>>>0; } return COLORS[h % COLORS.length]; };

// ---- WIDGETS ----
function KpiTile({ icon:Icon, label, value, sub, rightSlot, bottomSlot }: { icon:any, label:string, value:string, sub?:string, rightSlot?:React.ReactNode, bottomSlot?:React.ReactNode }) {
  return (
    <div className={`rounded-2xl ${brand.panel} p-4 shadow-lg border border-neutral-800`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-800"><Icon size={24} /></div>
          <div className="text-sm text-neutral-400">{label}</div>
        </div>
        {rightSlot}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-neutral-400 mt-1">{sub}</div>}
      {bottomSlot && <div className="mt-2">{bottomSlot}</div>}
    </div>
  );
}

function Thermometer({ value, label }:{ value:number, label:string }){
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div className={`rounded-2xl ${brand.panel} p-4 border border-neutral-800`}> 
      <div className="text-sm text-neutral-400 mb-2">{label}</div>
      <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden">
        <div className="h-full" style={{ width: pct(clamped), background: brand.accent }} />
      </div>
      <div className="mt-2 text-2xl font-semibold">{pct(clamped,0)}</div>
    </div>
  );
}

function ProfitWidget({ label, value, mom }:{ label:string, value:number, mom:number }){
  const momText = `${mom>=0?'+':''}${(mom*100).toFixed(1)} pp`;
  const momClass = mom>=0 ? 'text-emerald-400' : 'text-red-400';
  return (
    <div className={`rounded-2xl ${brand.panel} p-4 border border-neutral-800`}> 
      <div className="text-sm text-neutral-400 mb-1">{label}</div>
      <div className="text-3xl font-semibold">{pct(value,0)}</div>
      <div className="text-xs text-neutral-400 mt-1">MoM: <span className={momClass}>{momText}</span></div>
    </div>
  );
}

function DateRangeSelector({ range, setRange }:{ range:{start:string; end:string; preset:'7d'|'30d'|'90d'|'custom'}; setRange:(r:any)=>void }){
  const [open, setOpen] = useState(false);
  const applyPreset = (days: 7|30|90) => {
    setRange({ ...initRange(days), preset: (days+"d") as any });
    setOpen(false);
  };
  const onCustomChange = (key:'start'|'end') => (e:React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setRange((r:any)=> ({ ...r, [key]: v, preset: 'custom' }));
  };
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="text-xs border border-neutral-700 px-3 py-1.5 rounded-lg bg-neutral-900/70 hover:border-neutral-500">
        {range.preset !== 'custom' ? `${range.preset.toUpperCase()}` : `${range.start} → ${range.end}`}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-900/95 p-3 shadow-xl z-10">
          <div className="text-xs text-neutral-400 mb-2">Date range</div>
          <div className="flex gap-2 mb-3">
            <button onClick={()=>applyPreset(7)} className={`px-2 py-1 rounded-md border ${range.preset==='7d'?'border-emerald-400 text-emerald-400':'border-neutral-700 text-neutral-300'}`}>7d</button>
            <button onClick={()=>applyPreset(30)} className={`px-2 py-1 rounded-md border ${range.preset==='30d'?'border-emerald-400 text-emerald-400':'border-neutral-700 text-neutral-300'}`}>30d</button>
            <button onClick={()=>applyPreset(90)} className={`px-2 py-1 rounded-md border ${range.preset==='90d'?'border-emerald-400 text-emerald-400':'border-neutral-700 text-neutral-300'}`}>90d</button>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="text-[10px] text-neutral-400">Start</label>
            <input type="date" value={range.start} onChange={onCustomChange('start')} className="bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-xs"/>
            <label className="text-[10px] text-neutral-400">End</label>
            <input type="date" value={range.end} onChange={onCustomChange('end')} className="bg-neutral-800 border border-neutral-700 rounded-md px-2 py-1 text-xs"/>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadSourceSelector({ selected, setSelected }:{ selected:LeadSource[]; setSelected:(s:LeadSource[])=>void }){
  const [open, setOpen] = useState(false);
  const toggle = (src:LeadSource) => {
    const has = selected.includes(src);
    const next = has ? selected.filter(s=>s!==src) : [...selected, src];
    setSelected(next);
  };
  const all = selected.length===LEAD_SOURCES.length;
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-1 text-[10px] border border-neutral-700 px-2 py-1 rounded-md bg-neutral-900/70 hover:border-neutral-500">
        {all? 'All Sources' : `${selected.length} selected`} <ChevronDown size={12}/>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-xl z-10">
          <div className="text-[10px] text-neutral-400 mb-1">Lead sources</div>
          <button onClick={()=>setSelected([...LEAD_SOURCES])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Select all</button>
          <button onClick={()=>setSelected([])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Clear</button>
          <div className="mt-1 max-h-44 overflow-auto pr-1">
            {LEAD_SOURCES.map(src=>{
              const checked = selected.includes(src);
              return (
                <label key={src} className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-neutral-800 cursor-pointer">
                  <span onClick={()=>toggle(src)} className={`inline-flex items-center justify-center w-4 h-4 rounded border ${checked? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600'}`}>{checked && <Check size={12}/>}</span>
                  <span onClick={()=>toggle(src)}>{src}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBreakdownBar({ data }:{ data:{source:LeadSource; value:number}[] }){
  const total = sum(data.map(d=>d.value)) || 1;
  return (
    <div>
      <div className="h-1.5 w-full rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
        <div className="flex h-full w-full">
          {data.map(d=> (
            <span key={d.source} style={{ width: `${(d.value/total)*100}%`, background: LEAD_COLORS[d.source] }} />
          ))}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        {data.slice(0,4).map(d=> (
          <span key={d.source} className="text-[10px] text-neutral-400 inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: LEAD_COLORS[d.source] }} />
            {d.source}
          </span>
        ))}
      </div>
    </div>
  );
}

function CSRSelector({ selected, setSelected }:{ selected:CSR[]; setSelected:(s:CSR[])=>void }){
  const [open, setOpen] = useState(false);
  const toggle = (name:CSR) => {
    const has = selected.includes(name);
    const next = has ? selected.filter(s=>s!==name) : [...selected, name];
    setSelected(next);
  };
  const all = selected.length===CSR_LIST.length;
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-1 text-[10px] border border-neutral-700 px-2 py-1 rounded-md bg-neutral-900/70 hover:border-neutral-500">
        {all? 'All CSRs' : `${selected.length} selected`} <ChevronDown size={12}/>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-xl z-10">
          <div className="text-[10px] text-neutral-400 mb-1">CSRs</div>
          <button onClick={()=>setSelected([...CSR_LIST])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Select all</button>
          <button onClick={()=>setSelected([])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Clear</button>
          <div className="mt-1 max-h-44 overflow-auto pr-1">
            {CSR_LIST.map(name=>{
              const checked = selected.includes(name);
              return (
                <label key={name} className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-neutral-800 cursor-pointer">
                  <span onClick={()=>toggle(name)} className={`inline-flex items-center justify-center w-4 h-4 rounded border ${checked? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600'}`}>{checked && <Check size={12}/>}</span>
                  <span onClick={()=>toggle(name)}>{name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBreakdownBarCSR({ data }:{ data:{csr:CSR; value:number}[] }){
  const total = sum(data.map(d=>d.value)) || 1;
  return (
    <div>
      <div className="h-1.5 w-full rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
        <div className="flex h-full w-full">
          {data.map(d=> (
            <span key={d.csr} style={{ width: `${(d.value/total)*100}%`, background: CSR_COLORS[d.csr] }} />
          ))}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        {data.slice(0,4).map(d=> (
          <span key={d.csr} className="text-[10px] text-neutral-400 inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: CSR_COLORS[d.csr] }} />
            {d.csr}
          </span>
        ))}
      </div>
    </div>
  );
}

function SalesSelector({ selected, setSelected }:{ selected:SalesRep[]; setSelected:(s:SalesRep[])=>void }){
  const [open, setOpen] = useState(false);
  const toggle = (name:SalesRep) => {
    const has = selected.includes(name);
    const next = has ? selected.filter(s=>s!==name) : [...selected, name];
    setSelected(next);
  };
  const all = selected.length===SALES_LIST.length;
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-1 text-[10px] border border-neutral-700 px-2 py-1 rounded-md bg-neutral-900/70 hover:border-neutral-500">
        {all? 'All Sales' : `${selected.length} selected`} <ChevronDown size={12}/>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-xl z-10">
          <div className="text-[10px] text-neutral-400 mb-1">Sales reps</div>
          <button onClick={()=>setSelected([...SALES_LIST])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Select all</button>
          <button onClick={()=>setSelected([])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Clear</button>
          <div className="mt-1 max-h-44 overflow-auto pr-1">
            {SALES_LIST.map(name=>{
              const checked = selected.includes(name);
              return (
                <label key={name} className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-neutral-800 cursor-pointer">
                  <span onClick={()=>toggle(name)} className={`inline-flex items-center justify-center w-4 h-4 rounded border ${checked? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600'}`}>{checked && <Check size={12}/>}</span>
                  <span onClick={()=>toggle(name)}>{name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBreakdownBarSales({ data }:{ data:{rep:SalesRep; value:number}[] }){
  const total = sum(data.map(d=>d.value)) || 1;
  return (
    <div>
      <div className="h-1.5 w-full rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
        <div className="flex h-full w-full">
          {data.map(d=> (
            <span key={d.rep} style={{ width: `${(d.value/total)*100}%`, background: SALES_COLORS[d.rep] }} />
          ))}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        {data.slice(0,4).map(d=> (
          <span key={d.rep} className="text-[10px] text-neutral-400 inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: SALES_COLORS[d.rep] }} />
            {d.rep}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServiceSelector({ options, selected, setSelected }:{ options:string[]; selected:string[]; setSelected:(s:string[])=>void }){
  const [open, setOpen] = useState(false);
  const toggle = (name:string) => {
    const has = selected.includes(name);
    const next = has ? selected.filter(s=>s!==name) : [...selected, name];
    setSelected(next);
  };
  const all = selected.length===options.length;
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-1 text-[10px] border border-neutral-700 px-2 py-1 rounded-md bg-neutral-900/70 hover:border-neutral-500">
        {all? 'All Services' : `${selected.length} selected`} <ChevronDown size={12}/>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-xl z-10">
          <div className="text-[10px] text-neutral-400 mb-1">Service categories</div>
          <button onClick={()=>setSelected([...options])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Select all</button>
          <button onClick={()=>setSelected([])} className="w-full text-left text-xs px-2 py-1 rounded hover:bg-neutral-800">Clear</button>
          <div className="mt-1 max-h-44 overflow-auto pr-1">
            {options.map(name=>{
              const checked = selected.includes(name);
              return (
                <label key={name} className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-neutral-800 cursor-pointer">
                  <span onClick={()=>toggle(name)} className={`inline-flex items-center justify-center w-4 h-4 rounded border ${checked? 'bg-emerald-500 border-emerald-500' : 'border-neutral-600'}`}>{checked && <Check size={12}/>}</span>
                  <span onClick={()=>toggle(name)}>{name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniBreakdownBarService({ data }:{ data:{name:string; amount:number}[] }){
  const total = sum(data.map(d=>d.amount)) || 1;
  return (
    <div>
      <div className="h-1.5 w-full rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
        <div className="flex h-full w-full">
          {data.map(d=> (
            <span key={d.name} style={{ width: `${(d.amount/total)*100}%`, background: colorForService(d.name) }} />
          ))}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        {data.slice(0,4).map(d=> (
          <span key={d.name} className="text-[10px] text-neutral-400 inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: colorForService(d.name) }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- ROTATOR ----
const panels = ["AR Aging", "Margin Variance", "Service Mix"] as const;
type PanelKey = typeof panels[number];

// ---- MAIN VIEW ----
export default function DiamondCutDashboard(){
  const [range, setRange] = useState<{start:string; end:string; preset:'7d'|'30d'|'90d'|'custom'}>(initRange(30));
  const [active, setActive] = useState<PanelKey>("AR Aging");
  const [leadSources, setLeadSources] = useState<LeadSource[]>([...LEAD_SOURCES]); // default: all
  const [csrs, setCsrs] = useState<CSR[]>([...CSR_LIST]); // default: all CSRs
  const [sales, setSales] = useState<SalesRep[]>([...SALES_LIST]); // default: all sales
  const [services, setServices] = useState<string[]>([]); // ACV filter (empty = all services)

  // Persist lead source selection
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('dcl_lead_sources');
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr) && arr.length>0){ setLeadSources(arr as LeadSource[]); }
      }
    }catch{}
  },[]);
  useEffect(()=>{ try{ localStorage.setItem('dcl_lead_sources', JSON.stringify(leadSources)); }catch{} },[leadSources]);

  // Persist CSR selection
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('dcl_csrs');
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr) && arr.length>0){ setCsrs(arr as CSR[]); }
      }
    }catch{}
  },[]);
  useEffect(()=>{ try{ localStorage.setItem('dcl_csrs', JSON.stringify(csrs)); }catch{} }, [csrs]);

  // Persist Sales selection
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('dcl_sales');
      if(raw){
        const arr = JSON.parse(raw);
        if(Array.isArray(arr) && arr.length>0){ setSales(arr as SalesRep[]); }
      }
    }catch{}
  },[]);
  useEffect(()=>{ try{ localStorage.setItem('dcl_sales', JSON.stringify(sales)); }catch{} }, [sales]);

  useEffect(()=>{
    const id = setInterval(()=>{
      setActive(p => {
        const i = panels.indexOf(p);
        return panels[(i+1)%panels.length];
      });
    }, 12000);
    return ()=>clearInterval(id);
  },[]);

  // Derived view from selected filters
  const view = useMemo(()=>{
    // leads filtered by date & source
    const leads = tsLeads.filter(r=>inRange(r.date, range) && leadSources.includes(r.source));
    const leadsSum = sum(leads.map(r=>r.leads));

    // bookings filtered by date & CSR
    const bkCsr = tsBookingsCSR.filter(r=>inRange(r.date, range) && csrs.includes(r.csr));
    const bookingRate = sum(bkCsr.map(r=>r.appts)) / Math.max(1, sum(bkCsr.map(r=>r.leads)));

    // closes filtered by date & Sales reps
    const clSales = tsClosesSales.filter(r=>inRange(r.date, range) && sales.includes(r.rep));
    const closeRate = sum(clSales.map(r=>r.signed)) / Math.max(1, sum(clSales.map(r=>r.presented)));
    const clAll = tsCloses.filter(r=>inRange(r.date, range));

    // contracts & revenue
    const contracts = tsContracts.filter(r=>inRange(r.date, range));
    const revenueTopline = sum(contracts.map(r=>r.amount));

    // service mix counts
    const mixMap: Record<string, number> = {};
    contracts.forEach(c=>{ mixMap[c.service] = (mixMap[c.service]||0) + 1; });
    const serviceMix = Object.entries(mixMap).map(([name,value])=>({name, value}));

    // services for selectors + revenue breakdown
    const serviceNames = Array.from(new Set(contracts.map(r=>r.service)));
    const revenueMap: Record<string, number> = {};
    contracts.forEach(c=>{ revenueMap[c.service] = (revenueMap[c.service]||0) + c.amount; });
    const serviceBreakdown = Object.entries(revenueMap).map(([name, amount])=>({name, amount})).sort((a,b)=>b.amount-a.amount);

    // ACV filtered by selected services (or all if none selected)
    const selectedSet = new Set(services.length? services : serviceNames);
    const acvFiltered = avg(contracts.filter(r=>selectedSet.has(r.service)).map(r=>r.amount));

    // pipeline snapshot: latest within range (otherwise latest overall)
    const snaps = tsPipeline.filter(p=>inRange(p.date, range));
    const latestDate = snaps.length? snaps.map(s=>s.date).sort().slice(-1)[0] : tsPipeline.map(s=>s.date).sort().slice(-1)[0];
    const pipelineByStage = tsPipeline.filter(p=>p.date===latestDate).map(p=>({stage:p.stage, value:p.value}));

    // AR aging snapshot closest to end
    const ar = tsARAging.slice().sort((a,b)=> (a.asOf>b.asOf?1:-1));
    const arPick = ar.reduce((prev,cur)=> (cur.asOf<=range.end?cur:prev), ar[0]);

    // margin variance in range
    const mv = tsMarginVariance.filter(r=>inRange(r.date, range));

    // finance month
    const monthEnd = new Date(range.end); monthEnd.setDate(1); const monthKey = fmtDate(monthEnd);
    const idx = tsFinance.findIndex(f=>f.month===monthKey);
    const grossPct = idx>=0 ? tsFinance[idx].gross : tsFinance[tsFinance.length-1].gross;
    const netPct   = idx>=0 ? tsFinance[idx].net   : tsFinance[tsFinance.length-1].net;
    const grossPrev = idx>0 ? tsFinance[idx-1].gross : null;
    const netPrev   = idx>0 ? tsFinance[idx-1].net   : null;

    // progress billing on-time (demo placeholder)
    const billingOnTime = 0.78;

    // Sales goals vs actuals (per rep)
    const d = daysInRange(range.start, range.end);
    const DAILY_GOAL = 5500; // configurable per-rep daily goal
    const goalPerRep = d * DAILY_GOAL;
    const clAllReps = tsClosesSales.filter(r=>inRange(r.date, range));
    const byRepCounts: Record<SalesRep, number> = SALES_LIST.reduce((acc,r)=> (acc[r]=0, acc), {} as Record<SalesRep, number>);
    clAllReps.forEach(r=>{ byRepCounts[r.rep] = (byRepCounts[r.rep]||0) + r.signed; });
    const totalSigned = Object.values(byRepCounts).reduce((a,b)=>a+b,0);
    const salesGoals = SALES_LIST.map(rep=>({
      rep,
      goal: goalPerRep,
      actual: totalSigned>0 ? Math.round(revenueTopline * (byRepCounts[rep]/totalSigned)) : 0
    }));

    return {
      kpis: {
        leads: leadsSum,
        booking: bookingRate,
        close: closeRate,
        acv: acvFiltered,
        grossPct,
        netPct,
        grossMoM: grossPrev==null? 0 : (grossPct - grossPrev),
        netMoM: netPrev==null? 0 : (netPct - netPrev),
        billingOnTime
      },
      funnelData: [
        { stage: 'Leads', value: leadsSum },
        { stage: 'Consults', value: sum(tsBookings.filter(r=>inRange(r.date, range)).map(r=>r.appts)) },
        { stage: 'Signed', value: sum(clAll.map(r=>r.signed)) }
      ],
      pipelineByStage,
      revenueTopline,
      breakdown: (()=>{
        const by: Record<LeadSource, number> = LEAD_SOURCES.reduce((acc, s)=> (acc[s]=0, acc), {} as Record<LeadSource, number>);
        leads.forEach(l=>{ by[l.source as LeadSource] = (by[l.source as LeadSource]||0) + l.leads; });
        return Object.entries(by).filter(([,v])=>v>0).map(([source, value])=>({source: source as LeadSource, value})).sort((a,b)=>b.value-a.value);
      })(),
      bookingBreakdown: (()=>{
        const by: Record<CSR, number> = CSR_LIST.reduce((acc, n)=> (acc[n]=0, acc), {} as Record<CSR, number>);
        bkCsr.forEach(b=>{ by[b.csr] = (by[b.csr]||0) + b.appts; });
        return Object.entries(by).filter(([,v])=>v>0).map(([csr, value])=>({csr: csr as CSR, value})).sort((a,b)=>b.value-a.value);
      })(),
      closeBreakdown: (()=>{
        const by: Record<SalesRep, number> = SALES_LIST.reduce((acc, n)=> (acc[n]=0, acc), {} as Record<SalesRep, number>);
        clSales.forEach(c=>{ by[c.rep] = (by[c.rep]||0) + c.signed; });
        return Object.entries(by).filter(([,v])=>v>0).map(([rep, value])=>({rep: rep as SalesRep, value})).sort((a,b)=>b.value-a.value);
      })(),
      serviceMix: serviceMix.length? serviceMix : [{name:'Hardscapes', value:1}],
      serviceNames,
      serviceBreakdown,
      salesGoals,
      arAging: arPick.buckets,
      marginVariance: mv.length? mv.map(({job,bid,actual})=>({job,bid,actual})) : tsMarginVariance.slice(0,6).map(({job,bid,actual})=>({job,bid,actual}))
    };
  },[range, leadSources, csrs, sales, services]);

  // Initialize services to all available for current view on first render or when options change
  useEffect(()=>{
    if(view.serviceNames.length && (services.length===0 || services.some(s=>!view.serviceNames.includes(s)))){
      setServices(view.serviceNames);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.serviceNames.join(',')]);

  const capacityGapHrs = useMemo(()=> sum(capacitySeries.map(r=>r.avail - r.booked)), []);
  const totalCCI = useMemo(()=> tsCCIs.length, []);

  const warningCards = useMemo(()=>{
    const alerts:string[] = [];
    if(view.kpis.booking < 0.35) alerts.push("Booking rate below 35% (range)");
    if(view.kpis.close < 0.35) alerts.push("Close rate below 35% (range)");
    if(view.kpis.billingOnTime < 0.8) alerts.push("Progress billing on‑time under 80% (range)");
    return alerts;
  },[view]);

  return (
    <div className={`${brand.bg} ${brand.text} min-h-screen w-full p-6 font-sans`}> 
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500" />
          <div>
            <div className="text-xl font-semibold">Diamond Cut Landscape</div>
            <div className="text-xs text-neutral-400">Phoenix • Scottsdale • Tempe</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector range={range} setRange={setRange} />
          <div className="text-sm text-neutral-400">Updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* KPI ROWS */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        {/* Row 1 */}
        <div className="col-span-3">
          <KpiTile
            icon={PhoneCall}
            label="Qualified Leads"
            value={big(view.kpis.leads)}
            sub={`${range.start} → ${range.end}`}
            rightSlot={<LeadSourceSelector selected={leadSources} setSelected={setLeadSources} />}
            bottomSlot={<MiniBreakdownBar data={view.breakdown} />}
          />
        </div>
        <div className="col-span-3">
          <KpiTile
            icon={CalendarCheck2}
            label="Booking Rate"
            value={pct(view.kpis.booking,0)}
            sub="Lead → Consult"
            rightSlot={<CSRSelector selected={csrs} setSelected={setCsrs} />}
            bottomSlot={<MiniBreakdownBarCSR data={view.bookingBreakdown} />}
          />
        </div>
        <div className="col-span-3">
          <KpiTile
            icon={ClipboardCheck}
            label="Close Rate"
            value={pct(view.kpis.close,0)}
            sub="Signed ÷ Presented"
            rightSlot={<SalesSelector selected={sales} setSelected={setSales} />}
            bottomSlot={<MiniBreakdownBarSales data={view.closeBreakdown} />}
          />
        </div>
        <div className="col-span-3">
          <KpiTile
            icon={DollarSign}
            label="Avg Contract Value"
            value={`$${big(Math.round(view.kpis.acv))}`}
            sub={`${range.start} → ${range.end}`}
            rightSlot={<ServiceSelector options={view.serviceNames} selected={services} setSelected={setServices} />}
            bottomSlot={<MiniBreakdownBarService data={view.serviceBreakdown} />}
          />
        </div>

        {/* Sales Goals vs Actual (new) */}
        <div className={`col-span-9 rounded-2xl ${brand.panel} p-4 border border-neutral-800 h-full flex flex-col`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-neutral-400">Sales Goals vs Actual ($)</div>
            <div className="text-xs text-neutral-500">{range.start} → {range.end}</div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={view.salesGoals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="rep" />
                <YAxis tickFormatter={(v)=>"$"+ (v/1000)+"k"} />
                <Tooltip formatter={(v)=>"$"+big(v as number)} contentStyle={{ background: "#111", border: "1px solid #333" }} />
                <Legend />
                <Bar dataKey="goal" name="Goal" radius={[8,8,0,0]} fill="#60a5fa" />
                <Bar dataKey="actual" name="Actual" radius={[8,8,0,0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column KPIs (GP/NP half-width; CCI added) */}
        <div className="col-span-3 grid grid-cols-2 grid-rows-2 gap-4 auto-rows-fr">
          <ProfitWidget label="Gross Profit" value={view.kpis.grossPct} mom={view.kpis.grossMoM} />
          <ProfitWidget label="Net Profit" value={view.kpis.netPct} mom={view.kpis.netMoM} />
          <KpiTile icon={AlertTriangle} label="Customer Concerns (CCIs)" value={String(totalCCI)} />
          <Thermometer value={view.kpis.billingOnTime} label="Progress Billing On-Time" />
        </div>

        {/* Row 3: rotating panel + capacity */}
        <div className={`col-span-7 rounded-2xl ${brand.panel} p-4 border border-neutral-800 h-full flex flex-col`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-neutral-400">{active}</div>
            <div className="flex gap-2 text-xs">
              {panels.map(p => (
                <button key={p} onClick={()=>setActive(p)} className={`px-2 py-1 rounded-full border ${active===p?"border-emerald-400 text-emerald-400":"border-neutral-700 text-neutral-400"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            {active === "AR Aging" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={view.arAging}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="bucket" />
                  <YAxis tickFormatter={(v)=>"$"+ (v/1000)+"k"} />
                  <Tooltip formatter={(v)=>"$"+big(v as number)} contentStyle={{ background: "#111", border: "1px solid #333" }} />
                  <Bar dataKey="amount" radius={[8,8,0,0]}>
                    {view.arAging.map((_:any,i:number)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {active === "Margin Variance" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={view.marginVariance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="job" />
                  <YAxis tickFormatter={(v)=>pct(v)} domain={[0,0.6]} />
                  <Tooltip formatter={(v)=>pct(v as number)} contentStyle={{ background: "#111", border: "1px solid #333" }} />
                  <Line type="monotone" dataKey="bid" stroke="#60a5fa" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} dot />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            )}

            {active === "Service Mix" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={view.serviceMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {view.serviceMix.map((_:any, i:number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={`col-span-5 rounded-2xl ${brand.panel} p-4 border border-neutral-800 h-full flex flex-col`}>
          <div className="text-sm text-neutral-400 mb-2">4‑Week Capacity (hrs)</div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capacitySeries}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
                <Area type="monotone" dataKey="avail" stroke="#60a5fa" fillOpacity={1} fill="url(#g1)" />
                <Area type="monotone" dataKey="booked" stroke="#22c55e" fillOpacity={1} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-neutral-400">Gap: <span className={`${capacityGapHrs<0?"text-red-400":"text-emerald-400"}`}>{capacityGapHrs} hrs</span></div>
        </div>

        {/* Alert rail */}
        <div className={`col-span-12 rounded-2xl ${brand.panel} p-4 border border-neutral-800`}>
          <div className="flex items-center gap-2 text-amber-400 mb-2"><AlertTriangle size={18}/> Alerts</div>
          {warningCards.length === 0 ? (
            <div className="text-neutral-400 text-sm">No active alerts. All systems nominal.</div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {warningCards.map((t, i) => (
                <div key={i} className="rounded-xl bg-neutral-800/80 border border-neutral-700 p-3 text-sm">{t}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-neutral-500 flex items-center justify-between">
        <div>© {new Date().getFullYear()} Diamond Cut Landscape • (602) 920‑4145 • diamondcutaz.com</div>
        <div>Auto‑rotating detail panel • Refresh 15m • TZ: America/Phoenix</div>
      </div>
    </div>
  );
}
