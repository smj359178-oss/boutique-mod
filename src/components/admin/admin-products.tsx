"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Star,
  Loader2,
  Image as ImageIcon,
  AlertTriangle,
  Filter,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProducts,
  useProductMutations,
  useCategories,
} from "@/lib/hooks";
import { formatPrice, toFaDigits, colorToHex, cn } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";

interface FormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  categoryId: string;
  brand: string;
  material: string;
  stock: string;
  imageInput: string;
  colorsInput: string;
  sizesInput: string;
  featured: boolean;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  categoryId: "",
  brand: "",
  material: "",
  stock: "0",
  imageInput: "",
  colorsInput: "",
  sizesInput: "",
  featured: false,
  isActive: true,
};

export function AdminProducts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: productsData, isLoading } = useProducts({});
  const { data: categoriesData } = useCategories();
  const { create, update, remove } = useProductMutations();

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  // Local search + category filter (in addition to any server-side filter)
  const filtered = useMemo(() => {
    let list = products;
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category?.slug === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, categoryFilter, search]);

  function openCreate() {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      categoryId: categories[0]?.id || "",
    });
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      categoryId: p.categoryId,
      brand: p.brand || "",
      material: p.material || "",
      stock: String(p.stock),
      imageInput: p.images.join("\n"),
      colorsInput: p.colors.join("، "),
      sizesInput: p.sizes.join("، "),
      featured: p.featured,
      isActive: p.isActive,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("نام محصول را وارد کنید");
      return;
    }
    if (!form.categoryId) {
      toast.error("دسته‌بندی را انتخاب کنید");
      return;
    }
    const priceNum = Number(form.price);
    if (!priceNum || priceNum <= 0) {
      toast.error("قیمت معتبر وارد کنید");
      return;
    }
    const images = form.imageInput
      .split(/[\n,،]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = form.colorsInput
      .split(/[،,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const sizes = form.sizesInput
      .split(/[،,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (images.length === 0) {
      toast.error("حداقل یک تصویر وارد کنید");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceNum,
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      categoryId: form.categoryId,
      brand: form.brand.trim() || null,
      material: form.material.trim() || null,
      stock: Number(form.stock) || 0,
      images,
      colors,
      sizes,
      featured: form.featured,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("محصول با موفقیت به‌روزرسانی شد");
      } else {
        await create.mutateAsync(payload);
        toast.success("محصول جدید با موفقیت افزوده شد");
      }
      setDialogOpen(false);
    } catch {
      toast.error("خطا در ذخیره محصول");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success("محصول حذف شد");
      setDeleteId(null);
    } catch {
      toast.error("خطا در حذف محصول");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مدیریت محصولات</h1>
          <p className="text-sm text-muted-foreground">
            {toFaDigits(filtered.length)} محصول از {toFaDigits(products.length)} محصول
          </p>
        </div>
        <Button onClick={openCreate} className="shadow-soft">
          <Plus className="ml-1.5 h-4 w-4" />
          افزودن محصول
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="border-border/60">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="جستجوی محصول، برند یا کد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="همه دسته‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                {categories.map((c: Category) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Package}
              title="محصولی یافت نشد"
              description={search || categoryFilter !== "all" ? "فیلترهای جستجو را تغییر دهید" : "اولین محصول خود را اضافه کنید"}
              actionLabel="افزودن محصول"
              onAction={openCreate}
            />
          ) : (
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead className="min-w-[260px]">محصول</TableHead>
                    <TableHead className="hidden md:table-cell">دسته</TableHead>
                    <TableHead className="text-left">قیمت</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">موجودی</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">ویژگی‌ها</TableHead>
                    <TableHead className="text-center">وضعیت</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filtered.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                        className="group hover:bg-accent/30"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
                              {p.images[0] ? (
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="grid h-full w-full place-items-center text-muted-foreground">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{p.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                {p.brand && <span>{p.brand}</span>}
                                {p.brand && p.sku && <span>•</span>}
                                {p.sku && <span className="font-mono">{p.sku}</span>}
                              </div>
                              {/* Mobile: show category here */}
                              <span className="text-[11px] text-muted-foreground md:hidden">
                                {p.category?.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="font-normal">
                            {p.category?.name || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold">
                              {formatPrice(p.finalPrice)}
                              <span className="text-[10px] text-muted-foreground mr-1">ت</span>
                            </span>
                            {p.discountPrice && (
                              <span className="text-[11px] text-muted-foreground line-through">
                                {formatPrice(p.price)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center">
                          <span className={cn(
                            "text-sm font-medium",
                            p.stock <= 5 && "text-rose-600 dark:text-rose-400",
                            p.stock === 0 && "text-rose-600 dark:text-rose-400"
                          )}>
                            {toFaDigits(p.stock)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center justify-center gap-1.5">
                            {p.featured && (
                              <Badge className="gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30" variant="outline">
                                <Star className="h-3 w-3 fill-current" />
                                ویژه
                              </Badge>
                            )}
                            <div className="flex -space-x-1 space-x-reverse">
                              {p.colors.slice(0, 4).map((c, idx) => (
                                <span
                                  key={idx}
                                  className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                                  style={{ background: colorToHex(c) }}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {p.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30" variant="outline">
                              فعال
                            </Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground" variant="outline">
                              غیرفعال
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(p)}
                              aria-label="ویرایش"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteId(p.id)}
                              aria-label="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              {editing ? "ویرایش محصول" : "افزودن محصول جدید"}
            </DialogTitle>
            <DialogDescription>
              {editing ? `ویرایش ${editing.name}` : "اطلاعات محصول را تکمیل کنید"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-name">نام محصول *</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: پیراهن مجلسی سرخ"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-desc">توضیحات</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="توضیحات کامل محصول..."
                rows={3}
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="p-price">قیمت (تومان) *</Label>
              <Input
                id="p-price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="2890000"
              />
            </div>

            {/* Discount price */}
            <div className="space-y-1.5">
              <Label htmlFor="p-disc">قیمت با تخفیف (تومان)</Label>
              <Input
                id="p-disc"
                type="number"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                placeholder="اختیاری"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>دسته‌بندی *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: Category) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <Label htmlFor="p-brand">برند</Label>
              <Input
                id="p-brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="مثال: مُد هاوس"
              />
            </div>

            {/* Material */}
            <div className="space-y-1.5">
              <Label htmlFor="p-material">جنس پارچه</Label>
              <Input
                id="p-material"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="مثال: ابریشم"
              />
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <Label htmlFor="p-stock">موجودی</Label>
              <Input
                id="p-stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            {/* Images */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-images">آدرس تصاویر (هر خط یک تصویر)</Label>
              <Textarea
                id="p-images"
                value={form.imageInput}
                onChange={(e) => setForm({ ...form, imageInput: e.target.value })}
                placeholder={"/products/red-dress.png"}
                rows={2}
                dir="ltr"
              />
              <p className="text-[11px] text-muted-foreground">
                مسیر تصویر را وارد کنید، مثال: <code className="font-mono">/products/red-dress.png</code>
              </p>
            </div>

            {/* Colors */}
            <div className="space-y-1.5">
              <Label htmlFor="p-colors">رنگ‌ها (با ویرگول جدا کنید)</Label>
              <Input
                id="p-colors"
                value={form.colorsInput}
                onChange={(e) => setForm({ ...form, colorsInput: e.target.value })}
                placeholder="سرخ، مشکی، سفید"
              />
            </div>

            {/* Sizes */}
            <div className="space-y-1.5">
              <Label htmlFor="p-sizes">سایزها (با ویرگول جدا کنید)</Label>
              <Input
                id="p-sizes"
                value={form.sizesInput}
                onChange={(e) => setForm({ ...form, sizesInput: e.target.value })}
                placeholder="S, M, L, XL"
                dir="ltr"
              />
            </div>

            {/* Switches */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <Label htmlFor="p-featured" className="cursor-pointer">محصول ویژه</Label>
                <p className="text-[11px] text-muted-foreground">در صفحه اصلی نمایش داده شود</p>
              </div>
              <Switch
                id="p-featured"
                checked={form.featured}
                onCheckedChange={(v) => setForm({ ...form, featured: v })}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <Label htmlFor="p-active" className="cursor-pointer">فعال</Label>
                <p className="text-[11px] text-muted-foreground">قابل مشاهده در فروشگاه</p>
              </div>
              <Switch
                id="p-active"
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              />
            </div>
          </div>

          {/* Preview */}
          {form.imageInput && (
            <div className="rounded-xl border border-border/60 bg-card/40 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">پیش‌نمایش تصاویر:</p>
              <div className="flex flex-wrap gap-2">
                {form.imageInput
                  .split(/[\n,،]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 6)
                  .map((src, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={saving}>انصراف</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="ml-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="ml-1.5 h-4 w-4" />}
              {editing ? "ذخیره تغییرات" : "افزودن محصول"}
            </Button>
          </DialogFooter>
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
              حذف محصول
            </AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این محصول مطمئن هستید؟ این اقدام قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              بله، حذف شود
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4" size="sm">
          <Plus className="ml-1.5 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
