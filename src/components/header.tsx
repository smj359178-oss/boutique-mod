"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useNav, type Route } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { useCategories, useSettings } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const { route, go, mobileMenuOpen, setMobileMenuOpen, setCartOpen } = useNav();
  const count = useCart((s) => s.count());
  const { data: catData } = useCategories();
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;
  const [search, setSearch] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = catData?.categories || [];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) go({ name: "shop", search: search.trim() });
  }

  const navItems: { label: string; route: Route }[] = [
    { label: "خانه", route: { name: "home" } },
    { label: "فروشگاه", route: { name: "shop" } },
    { label: "درباره ما", route: { name: "about" } },
    { label: "تماس", route: { name: "contact" } },
  ];

  const isActive = (r: Route) =>
    r.name === route.name &&
    (r.name !== "shop" || (!r.category && !r.search));

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto flex items-center justify-between px-4 h-9">
          <div className="flex items-center gap-4">
            {settings?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {settings.phone}
              </span>
            )}
            {settings?.freeShipText && (
              <span className="flex items-center gap-1.5 opacity-90">
                <Sparkles className="h-3.5 w-3.5" />
                {settings.freeShipText}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => go({ name: "admin" })}
              className="flex items-center gap-1.5 hover:opacity-80 transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              پنل مدیریت
            </button>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b",
          scrolled
            ? "glass border-border/60 shadow-soft"
            : "bg-background/80 border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo */}
            <button
              onClick={() => go({ name: "home" })}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-soft">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-right leading-tight">
                <div className="font-extrabold text-lg text-gradient">
                  {settings?.storeName || "بوتیک مُد"}
                </div>
                <div className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
                  {settings?.storeSlogan || "مد و استایل"}
                </div>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((it) => (
                <button
                  key={it.label}
                  onClick={() => go(it.route)}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium rounded-lg transition",
                    isActive(it.route)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  {it.label}
                  {isActive(it.route) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}
              {/* Category dropdown */}
              <div className="group relative">
                <button className="px-3.5 py-2 text-sm font-medium rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/60 transition flex items-center gap-1">
                  دسته‌بندی
                </button>
                <div className="absolute top-full right-0 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                  <div className="w-52 rounded-xl border bg-popover p-1.5 shadow-soft-lg">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => go({ name: "shop", category: c.slug })}
                        className="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-accent/60 transition flex items-center justify-between"
                      >
                        <span>{c.name}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {c.productCount}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Search (desktop) */}
            <form
              onSubmit={submitSearch}
              className="hidden md:flex relative max-w-[200px] lg:max-w-xs flex-1"
            >
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصول..."
                className="pr-9 h-9 rounded-full bg-muted/60 border-transparent focus-visible:bg-background"
              />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full h-9 w-9"
                onClick={() => setCartOpen(true)}
                aria-label="سبد خرید"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-4 h-4 px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
                  >
                    {count}
                  </motion.span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full h-9 w-9"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="منو"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
          <SheetHeader className="px-5 pt-5 pb-3 border-b">
            <SheetTitle className="text-right flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {settings?.storeName || "بوتیک مُد"}
            </SheetTitle>
          </SheetHeader>
          <div className="p-5 space-y-5 overflow-y-auto">
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصول..."
                className="pr-9 h-10 rounded-full bg-muted/60"
              />
            </form>
            <nav className="space-y-1">
              {navItems.map((it) => (
                <button
                  key={it.label}
                  onClick={() => go(it.route)}
                  className={cn(
                    "w-full text-right px-3 py-2.5 rounded-lg text-sm font-medium transition",
                    isActive(it.route)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/60"
                  )}
                >
                  {it.label}
                </button>
              ))}
            </nav>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                دسته‌بندی‌ها
              </div>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => go({ name: "shop", category: c.slug })}
                    className="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-accent/60 transition flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {c.productCount}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">تم سایت</span>
              <ThemeToggle />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => go({ name: "admin" })}
            >
              <LayoutDashboard className="h-4 w-4" />
              پنل مدیریت
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
