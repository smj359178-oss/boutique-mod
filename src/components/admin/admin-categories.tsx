"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Package,
  Loader2,
  AlertTriangle,
  Sparkles,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useCategories, useCategoryMutations } from "@/lib/hooks";
import { toFaDigits, cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface FormState {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  icon: "",
};

function slugifyFa(s: string): string {
  return s.trim().replace(/\s+/g, "-").toLowerCase();
}

export function AdminCategories() {
  const { data, isLoading } = useCategories();
  const { create, update, remove } = useCategoryMutations();
  const categories = data?.categories || [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setDialogOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
      icon: c.icon || "",
    });
    setSlugTouched(true);
    setDialogOpen(true);
  }

  function onNameChange(v: string) {
    setForm((f) => ({
      ...f,
      name: v,
      slug: slugTouched ? f.slug : slugifyFa(v),
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("نام دسته را وارد کنید");
      return;
    }
    const slug = form.slug.trim() || slugifyFa(form.name);
    if (!slug) {
      toast.error("نامک (slug) دسته را وارد کنید");
      return;
    }
    const payload = {
      name: form.name.trim(),
      slug,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      icon: form.icon.trim() || null,
    };

    setSaving(true);
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("دسته با موفقیت به‌روزرسانی شد");
      } else {
        await create.mutateAsync(payload);
        toast.success("دسته جدید با موفقیت افزوده شد");
      }
      setDialogOpen(false);
    } catch {
      toast.error("خطا در ذخیره دسته");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success("دسته حذف شد");
      setDeleteId(null);
    } catch {
      toast.error("خطا در حذف دسته");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Header count={0} onAdd={openCreate} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Header count={categories.length} onAdd={openCreate} />

      {categories.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <FolderTree className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold">دسته‌ای یافت نشد</h3>
            <p className="mt-1 text-sm text-muted-foreground">اولین دسته‌بندی را اضافه کنید</p>
            <Button onClick={openCreate} className="mt-4" size="sm">
              <Plus className="ml-1.5 h-4 w-4" />
              افزودن دسته
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {categories.map((c, i) => (
              <CategoryCard
                key={c.id}
                category={c}
                index={i}
                onEdit={() => openEdit(c)}
                onDelete={() => setDeleteId(c.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FolderTree className="h-5 w-5 text-primary" />
              {editing ? "ویرایش دسته" : "افزودن دسته جدید"}
            </DialogTitle>
            <DialogDescription>
              {editing ? `ویرایش ${editing.name}` : "اطلاعات دسته‌بندی را تکمیل کنید"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">نام دسته *</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="مثال: زنانه"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-slug">نامک (slug) *</Label>
              <Input
                id="c-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                placeholder="women"
                dir="ltr"
              />
              <p className="text-[11px] text-muted-foreground">به انگلیسی، بدون فاصله</p>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-desc">توضیحات</Label>
              <Textarea
                id="c-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="توضیحات کوتاه دسته..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-image">تصویر (نام فایل)</Label>
              <Input
                id="c-image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="women"
                dir="ltr"
              />
              <p className="text-[11px] text-muted-foreground">
                مسیر نهایی: <code className="font-mono">/categories/{form.image || "..."}.png</code>
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-icon">آیکون (اختیاری)</Label>
              <Input
                id="c-icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="WomenIcon"
              />
            </div>
          </div>

          {/* Preview */}
          {(form.image || form.name) && (
            <div className="rounded-xl border border-border/60 bg-card/40 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">پیش‌نمایش:</p>
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/60">
                  {form.image ? (
                    <Image
                      src={`/categories/${form.image}.png`}
                      alt={form.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <FolderTree className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{form.name || "—"}</p>
                  <p className="text-[11px] text-muted-foreground">/{form.slug || "..."}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={saving}>انصراف</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="ml-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="ml-1.5 h-4 w-4" />}
              {editing ? "ذخیره تغییرات" : "افزودن دسته"}
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
              حذف دسته
            </AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این دسته مطمئن هستید؟ محصولات این دسته بدون دسته خواهند ماند. این اقدام قابل بازگشت نیست.
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

function Header({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">دسته‌بندی محصولات</h1>
        <p className="text-sm text-muted-foreground">
          {toFaDigits(count)} دسته‌بندی فعال
        </p>
      </div>
      <Button onClick={onAdd} className="shadow-soft">
        <Plus className="ml-1.5 h-4 w-4" />
        افزودن دسته
      </Button>
    </div>
  );
}

function CategoryCard({
  category,
  index,
  onEdit,
  onDelete,
}: {
  category: Category;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const imgUrl = category.image ? `/categories/${category.image}.png` : null;
  const accentColors = useMemo(() => {
    const palette = [
      "from-rose-500/20 to-rose-500/5",
      "from-amber-500/20 to-amber-500/5",
      "from-emerald-500/20 to-emerald-500/5",
      "from-teal-500/20 to-teal-500/5",
      "from-purple-500/20 to-purple-500/5",
      "from-orange-500/20 to-orange-500/5",
    ];
    return palette[index % palette.length];
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -2 }}
    >
      <Card className="group relative overflow-hidden border-border/60 shadow-soft hover:shadow-soft-lg transition-all">
        {/* Image */}
        <div className={cn("relative h-40 overflow-hidden bg-gradient-to-br", accentColors)}>
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground/40">
              <FolderTree className="h-12 w-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-3">
            <h3 className="text-lg font-bold text-white drop-shadow">{category.name}</h3>
            <p className="text-[11px] text-white/80 font-mono" dir="ltr">/{category.slug}</p>
          </div>
          <div className="absolute top-2 left-2">
            <Badge className="bg-white/90 text-foreground backdrop-blur shadow-sm">
              <Package className="ml-1 h-3 w-3" />
              {toFaDigits(category.productCount)} محصول
            </Badge>
          </div>
        </div>

        {/* Body */}
        <CardContent className="p-4">
          {category.description && (
            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onEdit}
            >
              <Pencil className="ml-1.5 h-3.5 w-3.5" />
              ویرایش
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onDelete}
              aria-label="حذف"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>

        {/* Decorative tag */}
        {category.icon && (
          <div className="absolute top-2 right-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-soft">
              <Tag className="h-3.5 w-3.5" />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
