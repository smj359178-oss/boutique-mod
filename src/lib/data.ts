import { db } from "@/lib/db";

export type RawProduct = Awaited<ReturnType<typeof db.product.findFirst>> & {
  category?: { id: string; name: string; slug: string } | null;
};

export function parseProduct(p: RawProduct) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    discountPrice: p.discountPrice,
    images: safeParseArray(p.images),
    colors: safeParseArray(p.colors),
    sizes: safeParseArray(p.sizes),
    material: p.material,
    brand: p.brand,
    sku: p.sku,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
    isActive: p.isActive,
    categoryId: p.categoryId,
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
      : null,
    createdAt: p.createdAt,
    finalPrice: p.discountPrice ?? p.price,
    discountPercent: p.discountPrice
      ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
      : 0,
  };
}

export function safeParseArray(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function getSettings() {
  const s = await db.settings.findUnique({ where: { id: "singleton" } });
  return s;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("fa-IR");
}
