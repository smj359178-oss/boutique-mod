"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings as SettingsIcon,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { cn, toFaDigits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";
import { AdminProducts } from "./admin-products";
import { AdminCategories } from "./admin-categories";
import { AdminOrders } from "./admin-orders";
import { AdminSettings } from "./admin-settings";

export type AdminTab =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "settings";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard, hint: "نمای کلی" },
  { id: "products", label: "محصولات", icon: Package, hint: "مدیریت کالاها" },
  { id: "categories", label: "دسته‌بندی‌ها", icon: FolderTree, hint: "گروه‌بندی" },
  { id: "orders", label: "سفارش‌ها", icon: ShoppingCart, hint: "سفارش‌های مشتریان" },
  { id: "settings", label: "تنظیمات", icon: SettingsIcon, hint: "پیکربندی" },
];

export function AdminContainer() {
  const { isAdmin, setAdmin, go } = useNav();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isAdmin) return <AdminLogin />;

  const handleLogout = () => {
    setAdmin(false);
    go({ name: "home" });
  };

  const handleSelect = (id: AdminTab) => {
    setActiveTab(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 h-16 border-b border-border/60 glass">
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-soft">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-tight">بوتیک مُد</p>
                <p className="text-[11px] text-muted-foreground leading-tight">پنل مدیریت</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => go({ name: "home" })}
              className="hidden sm:inline-flex"
            >
              <Store className="ml-1.5 h-4 w-4" />
              بازگشت به فروشگاه
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="خروج از پنل"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-border/60 bg-sidebar/40">
          <SidebarContent
            activeTab={activeTab}
            onSelect={handleSelect}
            onLogout={handleLogout}
          />
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="px-5 pt-5 pb-3">
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                پنل مدیریت
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-3 pb-2">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setMobileNavOpen(false);
                  go({ name: "home" });
                }}
              >
                <Store className="ml-2 h-4 w-4" />
                بازگشت به فروشگاه
              </Button>
            </div>
            <SidebarContent
              activeTab={activeTab}
              onSelect={handleSelect}
              onLogout={handleLogout}
              inSheet
            />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="p-4 lg:p-6"
            >
              {activeTab === "dashboard" && <AdminDashboard onNavigate={setActiveTab} />}
              {activeTab === "products" && <AdminProducts />}
              {activeTab === "categories" && <AdminCategories />}
              {activeTab === "orders" && <AdminOrders />}
              {activeTab === "settings" && <AdminSettings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  activeTab,
  onSelect,
  onLogout,
  inSheet = false,
}: {
  activeTab: AdminTab;
  onSelect: (id: AdminTab) => void;
  onLogout: () => void;
  inSheet?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-3 pb-2 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          منوی اصلی
        </p>
        {NAV_ITEMS.map((item, idx) => {
          const active = activeTab === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-transform", active && "scale-110")} />
              <span className="flex-1 text-right">{item.label}</span>
              {item.hint && (
                <span
                  className={cn(
                    "text-[10px] opacity-70 transition-opacity",
                    active ? "text-primary-foreground/80" : "text-muted-foreground",
                    "hidden xl:inline"
                  )}
                >
                  {item.hint}
                </span>
              )}
              {active && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary-foreground"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-auto p-3">
        <div className="rounded-xl border border-border/60 bg-card/60 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">بوتیک مُد</p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {toFaDigits(new Date().toLocaleDateString("fa-IR"))}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            onClick={onLogout}
          >
            <LogOut className="ml-1.5 h-4 w-4" />
            خروج از پنل
          </Button>
        </div>
        {inSheet && (
          <button
            onClick={() => {}}
            className="absolute left-4 top-4 hidden"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
