import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { useGetQuery } from "../../api/apiSlice";
import { endpoints } from "../../api/config";

const COLORS = ["#c5a059", "#121212", "#737373", "#a3a3a3", "#525252"];

export default function Dashboard() {
  const { data, isLoading, isError } = useGetQuery(endpoints.dashboardRoutes.overview, { refetchOnMountOrArgChange: true });

  if (isLoading || isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className={`text-xs font-bold uppercase tracking-wider ${isError ? "text-red-500" : "text-[var(--color-muted)]"}`}>
          {isError ? "Failed to load dashboard data." : "Loading dashboard metrics..."}
        </p>
      </div>
    );
  }

  const { topCards = {}, charts = {}, bestSellers = [] } = data;
  const stats = [
    { title: "Total Revenue", val: `PKR ${(topCards.totalRevenue || 0).toLocaleString()}`, icon: DollarSign },
    { title: "Total Orders", val: (topCards.totalOrders || 0).toLocaleString(), icon: ShoppingBag },
    { title: "Active Customers", val: (topCards.totalCustomers || 0).toLocaleString(), icon: Users },
    { title: "Products Live", val: (topCards.productsLive || 0).toLocaleString(), icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map(({ title, val, icon: Icon }) => (
          <div key={title} className="p-3 bg-white rounded-2xl border border-[var(--color-border)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">{title}</span>
              <div className="p-2.5 rounded-xl bg-[var(--color-card-bg)] text-[var(--color-primary)]"><Icon className="w-5 h-5" /></div>
            </div>
            <p className="mt-1.5 text-2xl font-bold text-[var(--color-text-dark)]">{val}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">Monthly Revenue</h2>
            <span className="text-[10px] font-bold text-[var(--color-accent)] bg-[var(--color-card-bg)] px-2.5 py-1 rounded-md">{new Date().getFullYear()}</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.salesOverTime || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent, #c5a059)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-accent, #c5a059)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `k${v / 1000}`} />
                <Tooltip formatter={(v: any) => [`PKR ${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ backgroundColor: "#0a0a0a", borderRadius: "12px", border: "1px solid rgba(197,160,89,0.3)", color: "#fff", fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-accent, #c5a059)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">Sales By Category</h2>
            <span className="text-[10px] text-[var(--color-muted)] font-semibold uppercase">Units Sold</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.salesByCategory || []} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" stroke="#121212" fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip cursor={{ fill: "rgba(197, 160, 89, 0.08)" }} formatter={(v: any) => [`${v} Units`, "Sales"]} contentStyle={{ backgroundColor: "#0a0a0a", borderRadius: "10px", border: "1px solid rgba(197,160,89,0.3)", color: "#fff", fontSize: "11px" }} itemStyle={{ color: "#c5a059" }} />
                <Bar dataKey="sales" radius={[0, 8, 8, 0]} barSize={18}>
                  {(charts.salesByCategory || []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-[var(--color-border)] pt-3 space-y-2 max-h-28 overflow-y-auto">
            {(charts.salesByCategory || []).map((item: any, idx: number) => (
              <div key={item.category || idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-semibold text-[var(--color-text-dark)]">{item.category}</span>
                </div>
                <span className="font-bold text-[var(--color-muted)]">{item.sales} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-dark)]">Top Selling Products</h2>
          <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {bestSellers.map((prod: any) => (
            <div key={prod.rank} className="p-3.5 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)]/50 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-black text-[var(--color-accent)] uppercase">Rank #{prod.rank}</span>
                <h3 className="text-xs font-bold line-clamp-1 text-[var(--color-text-dark)] mt-0.5">{prod.name}</h3>
              </div>
              <div className="pt-2 border-t border-[var(--color-border)]/40 flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-muted)] font-medium">{prod.unitsSold} Sold</span>
                <span className="font-bold text-[var(--color-text-dark)]">PKR {(prod.totalEarnings || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}