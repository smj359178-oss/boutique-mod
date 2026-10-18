"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryProvider } from "@/components/query-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AdminContainer } from "@/components/admin/admin-container";
import { HomeView } from "@/components/views/home-view";
import { ShopView } from "@/components/views/shop-view";
import { ProductView } from "@/components/views/product-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";
import { useNav } from "@/lib/store";

function AppContent() {
  const route = useNav((s) => s.route);

  // Admin has its own full-screen layout
  if (route.name === "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AdminContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey(route)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderRoute(route)}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function routeKey(route: ReturnType<typeof useNav.getState>["route"]): string {
  if (route.name === "product") return `product-${route.slug}`;
  if (route.name === "shop") return `shop-${route.category || "all"}-${route.search || ""}`;
  return route.name;
}

function renderRoute(route: ReturnType<typeof useNav.getState>["route"]) {
  switch (route.name) {
    case "home":
      return <HomeView />;
    case "shop":
      return <ShopView initialCategory={route.category} initialSearch={route.search} />;
    case "product":
      return <ProductView slug={route.slug} />;
    case "about":
      return <AboutView />;
    case "contact":
      return <ContactView />;
    default:
      return <HomeView />;
  }
}

export default function Home() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}
