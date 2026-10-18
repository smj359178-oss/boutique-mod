"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Search, Check, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/product-card";
import { useNav } from "@/lib/store";
import { useProducts, useCategories } from "@/lib/hooks";
import { colorToHex, formatPrice, toFaDigits, cn } from "@/lib/utils";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL", "30", "32", "34", "36", "4", "6", "8", "10", "12", "تک سایز"];
const ALL_COLORS = [
  "سرخ", "قرمز", "صورتی", "مشکی", "سفید", "کرم", "بژ", "کاهی",
  "زرد", "سبز", "آبی", "طوسی", "سرمه‌ای", "قهوه‌ای", "مولتی",
];

const SORTS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rating", label: "محبوب‌ترین" },
];

export function ShopView({ initialCategory, initialSearch }: { initialCategory?: string; initialSearch?: string }) {
  const go = useNav((s) => s.go);
  const { data: catData } = useCategories();
  const categories = catData?.categories || [];

  const [category, setCategory] = React.useState(initialCategory || "all");
  const [search, setSearch] = React.useState(initialSearch || "");
  const [size, setSize] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("");
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 6000000]);
  const [sort, setSort] = React.useState("newest");
  const [mobileFilters, setMobileFilters] = React.useState(false);

  React.useEffect(() => {
    setCategory(initialCategory || "all");
  }, [initialCategory]);
  React.useEffect(() => {
    setSearch(initialSearch || "");
  }, [initialSearch]);

  const { data, isLoading } = useProducts({
    category,
    search,
    size: size || undefined,
    color: color || undefined,
    minPrice: String(priceRange[0]),
    maxPrice: String(priceRange[1]),
    sort,
  });

  const products = data?.products || [];

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (category !== "all") activeFilters.push({ label: categories.find((c) => c.slug === category)?.name || category, clear: () => setCategory("all") });
  if (size) activeFilters.push({ label: `سایز: ${size}`, clear: () => setSize("") });
  if (color) activeFilters.push({ label: `رنگ: ${color}`, clear: () => setColor("") });
  if (search) activeFilters.push({ label: `جستجو: ${search}`, clear: () => setSearch("") });

  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-bold text-sm mb-3">دسته‌بندی</h4>
        <div className="space-y-1">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "w-full text-right px-3 py-2 rounded-lg text-sm transition flex items-center justify-between",
              category === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent/60"
            )}
          >
            <span>همه</span>
            {category === "all" && <Check className="h-4 w-4" />}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "w-full text-right px-3 py-2 rounded-lg text-sm transition flex items-center justify-between",
                category === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-accent/60"
              )}
            >
              <span>{c.name}</span>
              <span className={cn("text-xs", category === c.slug ? "opacity-90" : "text-muted-foreground")}>
                {toFaDigits(c.productCount)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-bold text-sm mb-3">محدوده قیمت</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={6000000}
          step={100000}
          className="my-4"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground nums-fa">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])} تومان</span>
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="font-bold text-sm mb-3">سایز</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(size === s ? "" : s)}
              className={cn(
                "min-w-9 h-9 px-2.5 rounded-lg border text-xs font-medium transition",
                size === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-primary/50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="font-bold text-sm mb-3">رنگ</h4>
        <div className="grid grid-cols-5 gap-2.5">
          {ALL_COLORS.map((c) => {
            const hex = colorToHex(c);
            const isGradient = String(hex).includes("gradient");
            return (
              <button
                key={c}
                onClick={() => setColor(color === c ? "" : c)}
                title={c}
                className={cn(
                  "relative h-9 w-9 rounded-full border-2 transition mx-auto",
                  color === c ? "border-primary scale-110" : "border-border"
                )}
                style={isGradient ? { background: undefined } : { background: hex }}
              >
                {isGradient && <span className="block h-full w-full rounded-full" style={{ background: hex }} />}
                {color === c && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <button onClick={() => go({ name: "home" })} className="hover:text-primary">خانه</button>
          <span>/</span>
          <span className="text-foreground">فروشگاه</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {category !== "all"
                ? categories.find((c) => c.slug === category)?.name || "فروشگاه"
                : search
                ? `نتایج: ${search}`
                : "همه محصولات"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 nums-fa">
              {toFaDigits(products.length)} محصول یافت شد
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-1.5"
              onClick={() => setMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              فیلترها
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative mb-5"
      >
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی محصول، برند..."
          className="pr-9 h-10 rounded-full bg-muted/60 max-w-md"
        />
      </form>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {activeFilters.map((f, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pl-1">
              {f.label}
              <button onClick={f.clear} className="grid place-items-center h-4 w-4 rounded-full hover:bg-background">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <button
            onClick={() => {
              setCategory("all");
              setSize("");
              setColor("");
              setSearch("");
              setPriceRange([0, 6000000]);
            }}
            className="text-xs text-primary hover:underline"
          >
            حذف همه
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-5">
            {filterContent}
          </div>
        </aside>

        {/* Products grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                  <div className="aspect-[3/4] bg-muted shimmer" />
                  <div className="p-3.5 space-y-2">
                    <div className="h-3 w-1/2 bg-muted rounded shimmer" />
                    <div className="h-3 w-2/3 bg-muted rounded shimmer" />
                    <div className="h-4 w-1/3 bg-muted rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="grid place-items-center h-20 w-20 rounded-full bg-muted mb-4">
                <Frown className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1">محصولی یافت نشد</h3>
              <p className="text-sm text-muted-foreground mb-5">
                با فیلترهای انتخاب‌شده محصولی پیدا نکردیم. فیلترها را تغییر دهید.
              </p>
              <Button
                onClick={() => {
                  setCategory("all");
                  setSize("");
                  setColor("");
                  setSearch("");
                  setPriceRange([0, 6000000]);
                }}
              >
                حذف فیلترها
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters sheet */}
      <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
        <SheetContent side="right" className="w-[300px] sm:w-[340px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-right">فیلترها</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {filterContent}
            <Button className="w-full mt-6" onClick={() => setMobileFilters(false)}>
              مشاهده {toFaDigits(products.length)} محصول
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
