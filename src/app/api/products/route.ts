import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseProduct } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const size = searchParams.get("size");
  const color = searchParams.get("color");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "newest";
  const limit = searchParams.get("limit");

  const where: Record<string, unknown> = { isActive: true };
  if (category && category !== "all") {
    where.category = { slug: category };
  }
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
    ];
  }
  if (size) {
    where.sizes = { contains: `"${size}"` };
  }
  if (color) {
    where.colors = { contains: `"${color}"` };
  }
  if (minPrice || maxPrice) {
    where.AND = [];
    if (minPrice) (where.AND as unknown[]).push({ price: { gte: Number(minPrice) } });
    if (maxPrice) (where.AND as unknown[]).push({ price: { lte: Number(maxPrice) } });
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  const products = await db.product.findMany({
    where,
    include: { category: true },
    orderBy,
    take: limit ? Number(limit) : undefined,
  });

  return NextResponse.json({ products: products.map(parseProduct) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await db.product.create({
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || "",
      price: Number(body.price),
      discountPrice: body.discountPrice ? Number(body.discountPrice) : null,
      images: JSON.stringify(body.images || []),
      colors: JSON.stringify(body.colors || []),
      sizes: JSON.stringify(body.sizes || []),
      material: body.material || null,
      brand: body.brand || null,
      sku: body.sku || null,
      stock: Number(body.stock) || 0,
      rating: 5,
      reviewCount: 0,
      featured: !!body.featured,
      isActive: body.isActive !== false,
      categoryId: body.categoryId,
    },
    include: { category: true },
  });
  return NextResponse.json({ product: parseProduct(product) });
}

function slugify(s: string) {
  return s.trim().replace(/\s+/g, "-").toLowerCase() + "-" + Date.now().toString(36);
}
