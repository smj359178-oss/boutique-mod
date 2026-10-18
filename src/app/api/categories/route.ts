import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      icon: c.icon,
      productCount: c._count.products,
    })),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const category = await db.category.create({
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
      image: body.image || null,
      icon: body.icon || null,
    },
  });
  return NextResponse.json({ category });
}

function slugify(s: string) {
  return s.trim().replace(/\s+/g, "-").toLowerCase();
}
