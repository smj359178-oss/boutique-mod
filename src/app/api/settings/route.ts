import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) return NextResponse.json({ settings: null });
  return NextResponse.json({
    settings: {
      ...settings,
      // Never expose password on GET
      adminPassword: undefined,
    },
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const data: Record<string, unknown> = {
    storeName: body.storeName,
    storeSlogan: body.storeSlogan,
    whatsapp: body.whatsapp,
    phone: body.phone,
    email: body.email,
    address: body.address,
    instagram: body.instagram,
    telegram: body.telegram,
    heroTitle: body.heroTitle,
    heroSubtitle: body.heroSubtitle,
    freeShipText: body.freeShipText,
  };
  if (body.adminPassword) data.adminPassword = body.adminPassword;
  const settings = await db.settings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data } as never,
  });
  return NextResponse.json({ ok: true, settings: { ...settings, adminPassword: undefined } });
}
