import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const settings = await db.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    return NextResponse.json({ error: "تنظیمات یافت نشد" }, { status: 500 });
  }
  if (body.password === settings.adminPassword) {
    return NextResponse.json({ ok: true, token: "admin-session" });
  }
  return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
}
