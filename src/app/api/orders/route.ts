import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  const orders = await db.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const order = await db.order.create({
    data: {
      customerName: body.customerName,
      phone: body.phone,
      address: body.address || null,
      note: body.note || null,
      total: Number(body.total),
      status: "pending",
      channel: body.channel || "whatsapp",
      items: {
        create: (body.items as Array<Record<string, unknown>>).map((it) => ({
          productId: String(it.productId),
          name: String(it.name),
          price: Number(it.price),
          qty: Number(it.qty),
          color: (it.color as string) || null,
          size: (it.size as string) || null,
          image: (it.image as string) || null,
        })),
      },
    },
    include: { items: true },
  });
  return NextResponse.json({ order });
}
