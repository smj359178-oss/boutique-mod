import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const category = await db.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug || undefined,
      description: body.description || null,
      image: body.image || null,
      icon: body.icon || null,
    },
  });
  return NextResponse.json({ category });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
