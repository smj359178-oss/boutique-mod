import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const order = await db.order.update({
    where: { id },
    data: { status: body.status },
    include: { items: true },
  });
  return NextResponse.json({ order });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
