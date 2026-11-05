"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";

// Colours come from CSS variables, so charts follow light/dark mode automatically.
const C = {
  c1: "hsl(var(--chart-1))",
  c2: "hsl(var(--chart-2))",
  c3: "hsl(var(--chart-3))",
  c4: "hsl(var(--chart-4))",
  text: "hsl(var(--muted-foreground))",
  grid: "hsl(var(--border))",
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--foreground))",
  fontSize: 12,
};

const axisProps = { tick: { fill: C.text, fontSize: 12 }, stroke: C.grid, tickLine: false } as const;

export function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Revenue over time, area chart">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.c1} stopOpacity={0.35} />
              <stop offset="100%" stopColor={C.c1} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" minTickGap={24} />
          <YAxis {...axisProps} width={56} tickFormatter={(v: number) => formatCurrency(v)} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke={C.c1} strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SignupsChart({ data }: { data: { label: string; signups: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="New signups over time, bar chart">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" minTickGap={24} />
          <YAxis {...axisProps} width={32} allowDecimals={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(v) => [formatNumber(Number(v)), "Signups"]}
          />
          <Bar dataKey="signups" fill={C.c2} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface DonutDatum {
  name: string;
  value: number;
}
const DONUT_COLORS = [C.c1, C.c2, C.c3, C.c4];

export function DonutChart({ data, label }: { data: DonutDatum[]; label: string }) {
  return (
    <div className="h-72 w-full" role="img" aria-label={label}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="none">
            {data.map((d, i) => (
              <Cell key={d.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [formatNumber(Number(v)), String(n)]} />
          <Legend
            iconType="circle"
            formatter={(value: string) => <span className="capitalize text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MrrChart({ data }: { data: { plan: string; mrr: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Monthly recurring revenue by plan, bar chart">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="plan" {...axisProps} />
          <YAxis {...axisProps} width={60} tickFormatter={(v: number) => formatCurrency(v)} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(v) => [formatCurrency(Number(v)), "MRR"]}
          />
          <Bar dataKey="mrr" fill={C.c1} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CountriesChart({ data }: { data: { country: string; count: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Customers by country, horizontal bar chart">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" {...axisProps} allowDecimals={false} />
          <YAxis type="category" dataKey="country" {...axisProps} width={96} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(v) => [formatNumber(Number(v)), "Customers"]}
          />
          <Bar dataKey="count" fill={C.c3} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrderHistoryChart({ data }: { data: { label: string; amount: number }[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Order history, bar chart">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" minTickGap={24} />
          <YAxis {...axisProps} width={56} tickFormatter={(v: number) => formatCurrency(v)} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(v) => [formatCurrency(Number(v)), "Paid"]}
          />
          <Bar dataKey="amount" fill={C.c2} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
