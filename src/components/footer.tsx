"use client";

import * as React from "react";
import {
  Sparkles,
  Instagram,
  Send,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { useCategories, useSettings } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const go = useNav((s) => s.go);
  const { data: catData } = useCategories();
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;
  const categories = catData?.categories || [];

  const features = [
    { icon: Truck, title: "ارسال سریع", desc: "تحویل ۲-۴ روزه در سراسر ایران" },
    { icon: ShieldCheck, title: "ضمانت اصالت", desc: "تضمین کیفیت و اصالت کالا" },
    { icon: Headphones, title: "پشتیبانی", desc: "پاسخگویی ۷ روز هفته" },
    { icon: CreditCard, title: "پرداخت امن", desc: "پرداخت در محل / آنلاین" },
  ];

  return (
    <footer className="mt-auto border-t bg-card/50">
      {/* Features strip */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="font-extrabold text-lg text-gradient">
                {settings?.storeName || "بوتیک مُد"}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-6 mb-4">
              {settings?.storeSlogan || "مد و استایل مدرن"} — فروشگاه آنلاین لباس با
              جدیدترین کالکشن‌ها و بهترین قیمت. سفارش آسان از طریق واتساپ.
            </p>
            <div className="flex items-center gap-2">
              <a
                href={`https://instagram.com/${settings?.instagram || ""}`}
                target="_blank"
                rel="noreferrer"
                aria-label="اینستاگرام"
                className="grid place-items-center h-9 w-9 rounded-full border hover:bg-accent hover:text-accent-foreground transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://t.me/${settings?.telegram || ""}`}
                target="_blank"
                rel="noreferrer"
                aria-label="تلگرام"
                className="grid place-items-center h-9 w-9 rounded-full border hover:bg-accent hover:text-accent-foreground transition"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm mb-4">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <button onClick={() => go({ name: "home" })} className="hover:text-primary transition">
                  خانه
                </button>
              </li>
              <li>
                <button onClick={() => go({ name: "shop" })} className="hover:text-primary transition">
                  فروشگاه
                </button>
              </li>
              <li>
                <button onClick={() => go({ name: "about" })} className="hover:text-primary transition">
                  درباره ما
                </button>
              </li>
              <li>
                <button onClick={() => go({ name: "contact" })} className="hover:text-primary transition">
                  تماس با ما
                </button>
              </li>
              <li>
                <button onClick={() => go({ name: "admin" })} className="hover:text-primary transition">
                  پنل مدیریت
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => go({ name: "shop", category: c.slug })}
                    className="hover:text-primary transition"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-sm mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${settings.phone}`} className="hover:text-primary transition" dir="ltr">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${settings.email}`} className="hover:text-primary transition" dir="ltr">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input placeholder="ایمیل برای خبرنامه" className="h-9 text-sm" />
              <Button type="submit" size="sm" className="h-9 px-3">
                عضویت
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {settings?.storeName || "بوتیک مُد"} — تمامی حقوق محفوظ است.
          </p>
          <p className="flex items-center gap-1">
            طراحی شده با <span className="text-primary">♥</span> برای تجربه‌ای متفاوت
          </p>
        </div>
      </div>
    </footer>
  );
}
