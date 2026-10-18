import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseProduct } from "@/lib/data";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ product: parseProduct(product) });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const product = await db.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug || undefined,
      description: body.description,
      price: Number(body.price),
      discountPrice: body.discountPrice ? Number(body.discountPrice) : null,
      images: JSON.stringify(body.images || []),
      colors: JSON.stringify(body.colors || []),
      sizes: JSON.stringify(body.sizes || []),
      material: body.material || null,
      brand: body.brand || null,
      sku: body.sku || null,
      stock: Number(body.stock) || 0,
      featured: !!body.featured,
      isActive: body.isActive !== false,
      categoryId: body.categoryId,
    },
    include: { category: true },
  });
  return NextResponse.json({ product: parseProduct(product) });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
