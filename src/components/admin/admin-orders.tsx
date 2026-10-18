"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  MoreVertical,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Package,
  User,
  MapPin,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  useOrders,
  useUpdateOrder,
  useDeleteOrder,
} from "@/lib/hooks";
import {
  formatPrice,
  toFaDigits,
  relativeTimeFa,
  colorToHex,
  cn,
} from "@/lib/utils";
import type { Order } from "@/lib/types";

type FilterTab = "all" | "pending" | "shipped" | "delivered" | "cancelled";

const STATUS_META: Record<string, { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: {
    label: "در انتظار",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    icon: Clock,
  },
  shipped: {
    label: "ارسال‌شده",
    badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border-teal-200 dark:border-teal-500/30",
    icon: Truck,
  },
  delivered: {
    label: "تحویل‌شده",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو‌شده",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
    icon: XCircle,
  },
};

const CHANNEL_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  whatsapp: { label: "واتساپ", icon: MessageCircle },
  call: { label: "تماس", icon: Phone },
};

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "pending", label: "در انتظار" },
  { id: "shipped", label: "ارسال‌شده" },
  { id: "delivered", label: "تحویل‌شده" },
  { id: "cancelled", label: "لغو‌شده" },
];

export function AdminOrders() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // When filter is "all", we pass undefined which returns all orders
  const statusParam = filter === "all" ? undefined : filter;
  const { data, isLoading } = useOrders(statusParam);
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const orders = data?.orders || [];

  // Counts for the tabs (calculated from "all" view if available, else fallback)
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0, pending: 0, shipped: 0, delivered: 0, cancelled: 0 };
    for (const o of orders) {
      c.all++;
      if (c[o.status] !== undefined) c[o.status]++;
    }
    return c;
  }, [orders]);

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateOrder.mutateAsync({ id, status });
      toast.success(`وضعیت سفارش به «${STATUS_META[status]?.label || status}» تغییر یافت`);
      if (viewOrder?.id === id) {
        setViewOrder({ ...viewOrder, status });
      }
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteOrder.mutateAsync(deleteId);
      toast.success("سفارش حذف شد");
      setDeleteId(null);
    } catch {
      toast.error("خطا در حذف سفارش");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">مدیریت سفارش‌ها</h1>
        <p className="text-sm text-muted-foreground">
          {toFaDigits(orders.length)} سفارش نمایش داده شده
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card text-foreground hover:bg-accent"
            )}
          >
            {f.label}
            <span className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              filter === f.id
                ? "bg-white/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {toFaDigits(f.id === filter ? orders.length : counts[f.id] || 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold">سفارشی یافت نشد</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filter === "all" ? "هنوز سفارشی ثبت نشده است" : `سفارشی با وضعیت «${STATUS_META[filter]?.label}» وجود ندارد`}
              </p>
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead className="min-w-[180px]">مشتری</TableHead>
                    <TableHead className="hidden md:table-cell text-center">اقلام</TableHead>
                    <TableHead className="text-left">مبلغ</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">کانال</TableHead>
                    <TableHead className="text-center">وضعیت</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">زمان</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {orders.map((o, i) => {
                      const meta = STATUS_META[o.status] || STATUS_META.pending;
                      const channel = CHANNEL_META[o.channel] || CHANNEL_META.call;
                      const ChannelIcon = channel.icon;
                      const StatusIcon = meta.icon;
                      return (
                        <motion.tr
                          key={o.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: Math.min(i * 0.02, 0.3) }}
                          className="group hover:bg-accent/30"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                {o.customerName.slice(0, 1)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{o.customerName}</p>
                                <p className="text-[11px] text-muted-foreground" dir="ltr">
                                  {toFaDigits(o.phone)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-center">
                            <Badge variant="outline" className="font-normal">
                              <Package className="ml-1 h-3 w-3" />
                              {toFaDigits(o.items.length)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left">
                            <span className="text-sm font-semibold">
                              {formatPrice(o.total)}
                              <span className="text-[10px] text-muted-foreground mr-1">ت</span>
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex justify-center">
                              <Badge variant="outline" className="font-normal gap-1">
                                <ChannelIcon className="h-3 w-3" />
                                {channel.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={cn("font-normal gap-1", meta.badgeClass)}>
                              <StatusIcon className="h-3 w-3" />
                              {meta.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-center text-xs text-muted-foreground">
                            {relativeTimeFa(new Date(o.createdAt))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setViewOrder(o)}
                                aria-label="مشاهده"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="تغییر وضعیت"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    تغییر وضعیت
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {(["pending", "shipped", "delivered", "cancelled"] as const).map((s) => {
                                    const m = STATUS_META[s];
                                    const MIcon = m.icon;
                                    return (
                                      <DropdownMenuItem
                                        key={s}
                                        onClick={() => handleStatusChange(o.id, s)}
                                        disabled={o.status === s || updateOrder.isPending}
                                        className={cn(o.status === s && "opacity-50")}
                                      >
                                        <MIcon className="ml-2 h-4 w-4" />
                                        {m.label}
                                        {o.status === s && <span className="mr-auto text-[10px] text-muted-foreground">فعلی</span>}
                                      </DropdownMenuItem>
                                    );
                                  })}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setViewOrder(o)}
                                  >
                                    <Eye className="ml-2 h-4 w-4" />
                                    مشاهده جزئیات
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(o.id)}
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                  >
                                    <Trash2 className="ml-2 h-4 w-4" />
                                    حذف سفارش
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order details dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          {viewOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  جزئیات سفارش
                </DialogTitle>
                <DialogDescription>
                  کد سفارش: <span className="font-mono" dir="ltr">{viewOrder.id.slice(0, 8)}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Customer info */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow icon={User} label="نام مشتری" value={viewOrder.customerName} />
                <InfoRow icon={Phone} label="شماره تماس" value={toFaDigits(viewOrder.phone)} ltr />
                {viewOrder.address && (
                  <div className="sm:col-span-2">
                    <InfoRow icon={MapPin} label="آدرس" value={viewOrder.address} />
                  </div>
                )}
                {viewOrder.note && (
                  <div className="sm:col-span-2">
                    <InfoRow icon={StickyNote} label="یادداشت" value={viewOrder.note} />
                  </div>
                )}
              </div>

              {/* Status changer */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">تغییر وضعیت سفارش:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["pending", "shipped", "delivered", "cancelled"] as const).map((s) => {
                    const m = STATUS_META[s];
                    const MIcon = m.icon;
                    const active = viewOrder.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(viewOrder.id, s)}
                        disabled={active || updateOrder.isPending}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-60",
                          active
                            ? cn(m.badgeClass, "border-current")
                            : "border-border bg-card hover:bg-accent"
                        )}
                      >
                        <MIcon className="h-3 w-3" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="mb-2 text-sm font-medium">اقلام سفارش ({toFaDigits(viewOrder.items.length)} مورد)</p>
                <div className="space-y-2">
                  {viewOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-2.5"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
                        {it.image ? (
                          <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-muted-foreground">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{it.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          {it.color && (
                            <span className="inline-flex items-center gap-1">
                              <span className="h-3 w-3 rounded-full ring-1 ring-border" style={{ background: colorToHex(it.color) }} />
                              {it.color}
                            </span>
                          )}
                          {it.size && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{it.size}</Badge>}
                          <span>× {toFaDigits(it.qty)}</span>
                        </div>
                      </div>
                      <div className="text-left text-sm font-semibold">
                        {formatPrice(it.price * it.qty)}
                        <span className="text-[10px] text-muted-foreground mr-1">ت</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                <span className="text-sm font-medium">مبلغ کل سفارش:</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(viewOrder.total)} <span className="text-xs font-normal">تومان</span>
                </span>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">بستن</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </span>
              حذف سفارش
            </AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این سفارش مطمئن هستید؟ این اقدام قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteOrder.isPending ? (
                <Loader2 className="ml-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="ml-1.5 h-4 w-4" />
              )}
              بله، حذف شود
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border/40 bg-card/30 px-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium" dir={ltr ? "ltr" : "rtl"}>
          {value}
        </p>
      </div>
    </div>
  );
}
