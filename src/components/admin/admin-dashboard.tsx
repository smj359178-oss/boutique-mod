"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Package,
  Clock,
  Wallet,
  ArrowLeft,
  Trophy,
  Receipt,
  Truck,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats, useOrders } from "@/lib/hooks";
import {
  formatPrice,
  toFaDigits,
  relativeTimeFa,
  cn,
} from "@/lib/utils";
import type { AdminTab } from "./admin-container";

const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const STATUS_LABEL: Record<string, string> = {
  pending: "در انتظار",
  shipped: "ارسال‌شده",
  delivered: "تحویل‌شده",
  cancelled: "لغو‌شده",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  shipped: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border-teal-200 dark:border-teal-500/30",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
};

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
  delay?: number;
  accent?: string;
}

function StatCard({ title, value, sub, icon: Icon, trend, trendValue, delay = 0, accent }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden border-border/60 shadow-soft hover:shadow-soft-lg transition-shadow">
        <div
          className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
          style={{ background: accent || "var(--primary)" }}
        />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">{title}</p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight truncate">{value}</p>
              {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
            </div>
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-soft"
              style={{ background: accent || "var(--primary)" }}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {trend && trendValue && (
            <div className="mt-3 flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span className={trend === "up" ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-rose-600 dark:text-rose-400 font-medium"}>
                {trendValue}
              </span>
              <span className="text-muted-foreground">نسبت به دوره قبل</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs shadow-soft">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          {p.name}: <span className="font-medium text-foreground">{formatPrice(p.value)} تومان</span>
        </p>
      ))}
    </div>
  );
}

export function AdminDashboard({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: ordersData } = useOrders();

  const stats = statsData as {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCategories: number;
    pendingOrders: number;
    deliveredOrders: number;
    shippedOrders: number;
    avgOrderValue: number;
    days: { label: string; revenue: number; orders: number }[];
    perCategory: { name: string; slug: string; revenue: number; count: number; productCount: number }[];
    topProducts: { id: string; name: string; count: number; revenue: number; image: string }[];
  } | undefined;

  const recentOrders = (ordersData?.orders || []).slice(0, 6);

  if (statsLoading) return <DashboardSkeleton />;

  const maxRevenue = Math.max(...(stats?.days.map((d) => d.revenue) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">داشبورد مدیریت</h1>
          <p className="text-sm text-muted-foreground">
            نمای کلی عملکرد فروشگاه بوتیک مُد
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate("orders")}>
            <Receipt className="ml-1.5 h-4 w-4" />
            مشاهده سفارش‌ها
          </Button>
          <Button size="sm" onClick={() => onNavigate("products")}>
            <Package className="ml-1.5 h-4 w-4" />
            مدیریت محصولات
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="درآمد کل"
          value={`${formatPrice(stats?.totalRevenue || 0)} ت`}
          sub="مجموع سفارش‌های تحویل‌شده"
          icon={Wallet}
          trend="up"
          trendValue={toFaDigits(12) + "%"}
          delay={0}
        />
        <StatCard
          title="سفارش‌ها"
          value={toFaDigits(stats?.totalOrders || 0)}
          sub={`${toFaDigits(stats?.deliveredOrders || 0)} تحویل‌شده • ${toFaDigits(stats?.shippedOrders || 0)} ارسالی`}
          icon={ShoppingBag}
          delay={0.06}
          accent="oklch(0.6 0.13 160)"
        />
        <StatCard
          title="محصولات"
          value={toFaDigits(stats?.totalProducts || 0)}
          sub={`${toFaDigits(stats?.totalCategories || 0)} دسته‌بندی فعال`}
          icon={Package}
          delay={0.12}
          accent="oklch(0.7 0.15 45)"
        />
        <StatCard
          title="سفارش‌های در انتظار"
          value={toFaDigits(stats?.pendingOrders || 0)}
          sub="نیازمند بررسی و پردازش"
          icon={Clock}
          delay={0.18}
          accent="oklch(0.75 0.16 70)"
        />
      </div>

      {/* Mini status cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat
          icon={Clock}
          label="در انتظار"
          value={stats?.pendingOrders || 0}
          color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <MiniStat
          icon={Truck}
          label="ارسال‌شده"
          value={stats?.shippedOrders || 0}
          color="bg-teal-500/10 text-teal-600 dark:text-teal-400"
        />
        <MiniStat
          icon={CheckCircle2}
          label="تحویل‌شده"
          value={stats?.deliveredOrders || 0}
          color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <MiniStat
          icon={BarChart3}
          label="میانگین سفارش"
          value={stats?.avgOrderValue || 0}
          color="bg-primary/10 text-primary"
          isPrice
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 border-border/60 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">درآمد ۷ روز اخیر</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">روند درآمد روزانه فروشگاه</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              روند صعودی
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.days || []} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}م` : v >= 1000 ? `${Math.round(v / 1000)}ک` : v)}
                    width={42}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="درآمد"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#revGrad)"
                    dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span>بیشترین درآمد روزانه: <span className="font-semibold text-foreground">{formatPrice(maxRevenue)} تومان</span></span>
              <span>مجموع هفته: <span className="font-semibold text-foreground">{formatPrice((stats?.days || []).reduce((s, d) => s + d.revenue, 0))} تومان</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Per-category bar chart */}
        <Card className="border-border/60 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">درآمد به تفکیک دسته</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">فروش هر دسته‌بندی</p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.perCategory || []} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}م` : v >= 1000 ? `${Math.round(v / 1000)}ک` : v)}
                    width={36}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                  <Bar dataKey="revenue" name="درآمد" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {(stats?.perCategory || []).map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top products + recent orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Top products */}
        <Card className="lg:col-span-2 border-border/60 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">پرفروش‌ترین محصولات</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">بر اساس تعداد فروش</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {(stats?.topProducts || []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                هنوز فروشی ثبت نشده است
              </div>
            ) : (
              (stats?.topProducts || []).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 p-2.5 transition-colors hover:bg-accent/40"
                >
                  <div className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                    i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" :
                    i === 1 ? "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300" :
                    i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {toFaDigits(i + 1)}
                  </div>
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {toFaDigits(p.count)} فروش • {formatPrice(p.revenue)} ت
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="lg:col-span-3 border-border/60 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">سفارش‌های اخیر</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">آخرین سفارش‌های ثبت‌شده</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("orders")}>
              همه
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {recentOrders.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  سفارشی ثبت نشده است
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentOrders.map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.04 * i }}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/30"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {o.customerName.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{o.customerName}</p>
                        <p className="text-[11px] text-muted-foreground" dir="ltr">
                          {toFaDigits(o.phone)}
                        </p>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold">{formatPrice(o.total)} <span className="text-[10px] text-muted-foreground">ت</span></p>
                        <p className="text-[10px] text-muted-foreground">{relativeTimeFa(new Date(o.createdAt))}</p>
                      </div>
                      <Badge variant="outline" className={cn("shrink-0 text-[10px]", STATUS_BADGE[o.status])}>
                        {STATUS_LABEL[o.status] || o.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  color,
  isPrice,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  isPrice?: boolean;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="text-sm font-bold truncate">
            {isPrice ? formatPrice(value) : toFaDigits(value)}
            {isPrice && <span className="text-[10px] text-muted-foreground"> ت</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-96 lg:col-span-2" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
