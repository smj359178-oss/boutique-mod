import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [products, orders, categories] = await Promise.all([
    db.product.findMany({ where: { isActive: true } }),
    db.order.findMany({ include: { items: true } }),
    db.category.findMany(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;

  // Revenue per day for last 7 days
  const days: { label: string; revenue: number; orders: number }[] = [];
  const weekdayFa = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    const dayOrders = orders.filter(
      (o) => o.createdAt >= start && o.createdAt <= end && o.status === "delivered"
    );
    days.push({
      label: weekdayFa[d.getDay()],
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Sales per category
  const perCategory = categories.map((c) => {
    const catOrders = orders.filter((o) =>
      o.items.some((it) => {
        const p = products.find((pp) => pp.id === it.productId);
        return p?.categoryId === c.id;
      })
    );
    const revenue = catOrders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + o.total, 0);
    return {
      name: c.name,
      slug: c.slug,
      revenue,
      count: catOrders.length,
      productCount: products.filter((p) => p.categoryId === c.id).length,
    };
  });

  // Top selling products
  const sales = new Map<string, { name: string; count: number; revenue: number; image: string }>();
  for (const o of orders) {
    for (const it of o.items) {
      const cur = sales.get(it.productId) || { name: it.name, count: 0, revenue: 0, image: it.image || "" };
      cur.count += it.qty;
      cur.revenue += it.price * it.qty;
      sales.set(it.productId, cur);
    }
  }
  const topProducts = Array.from(sales.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCategories: categories.length,
    pendingOrders,
    deliveredOrders,
    shippedOrders,
    avgOrderValue: orders.length ? Math.round(totalRevenue / (deliveredOrders || 1)) : 0,
    days,
    perCategory,
    topProducts,
  });
}
