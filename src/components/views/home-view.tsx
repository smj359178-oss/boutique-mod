"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Headphones,
  Tag,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { useNav } from "@/lib/store";
import { useProducts, useCategories, useSettings } from "@/lib/hooks";
import { toFaDigits } from "@/lib/utils";

export function HomeView() {
  const go = useNav((s) => s.go);
  const { data: featuredData } = useProducts({ featured: true, limit: 8 });
  const { data: newData } = useProducts({ sort: "newest", limit: 8 });
  const { data: catData } = useCategories();
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;
  const categories = catData?.categories || [];

  const testimonials = [
    { name: "نگار محمدی", text: "کیفیت پارچه فوق‌العاده بود و سایز کاملاً درست بود. ارسال هم سریع رسید.", rating: 5 },
    { name: "سینا رحیمی", text: "طراحی‌هاش خیلی شیک و مدرنه. حتماً دوباره خرید می‌کنم.", rating: 5 },
    { name: "مهسا کریمی", text: "پشتیبانی عالی و راهنمایی دقیق برای انتخاب سایز. ممنونم.", rating: 4 },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 text-center lg:text-right"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium mb-5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                کالکشن جدید پاییز و زمستان رسید
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                <span className="text-gradient">{settings?.heroTitle || "استایل تو، امضای تو"}</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-8 mb-7 max-w-xl mx-auto lg:mx-0">
                {settings?.heroSubtitle || "جدیدترین کالکشن لباس با بهترین کیفیت و قیمت"}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button
                  size="lg"
                  className="rounded-full h-12 px-7 text-base gap-2 shadow-soft"
                  onClick={() => go({ name: "shop" })}
                >
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-7 text-base"
                  onClick={() => go({ name: "shop", category: "women" })}
                >
                  کالکشن زنانه
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-9">
                {[
                  { n: "+۵۰۰", l: "محصول متنوع" },
                  { n: "+۱۰هزار", l: "مشتری راضی" },
                  { n: "۴.۸", l: "امتیاز مشتریان" },
                ].map((s) => (
                  <div key={s.l} className="text-center lg:text-right">
                    <div className="text-2xl font-extrabold text-primary nums-fa">{s.n}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative aspect-[5/4] md:aspect-[4/3] rounded-3xl overflow-hidden shadow-soft-lg">
                <Image
                  src="/hero.png"
                  alt="بوتیک مُد"
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 right-4 md:right-8 glass border rounded-2xl p-3 shadow-soft-lg flex items-center gap-2.5"
              >
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#25D366] text-white">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">ارسال سریع</div>
                  <div className="text-[10px] text-muted-foreground">۲-۴ روز کاری</div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 md:left-8 glass border rounded-2xl p-3 shadow-soft-lg flex items-center gap-2.5"
              >
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-amber-500 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">ضمانت کیفیت</div>
                  <div className="text-[10px] text-muted-foreground">۷ روز ضمانت بازگشت</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE strip */}
      <section className="border-y bg-primary text-primary-foreground py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-8 px-4 text-sm font-medium">
              {[
                "✦ ارسال رایگان بالای ۵۰۰ هزار تومان",
                "✦ ۷ روز ضمانت بازگشت کالا",
                "✦ پرداخت در محل",
                "✦ جدیدترین کالکشن پاییز و زمستان",
                "✦ سفارش آسان از واتساپ",
                "✦ پشتیبانی ۲۴ ساعته",
              ].map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-8">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <SectionHeader
          eyebrow="دسته‌بندی‌ها"
          title="به دلخواه خودت خرید کن"
          desc="مجموعه‌ای کامل از لباس و اکسسوری برای هر سلیقه"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {categories.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => go({ name: "shop", category: c.slug })}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border bg-muted"
            >
              <Image
                src={`/categories/${c.image}.png`}
                alt={c.name}
                fill
                sizes="(max-width:1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white">
                <h3 className="font-extrabold text-lg mb-0.5">{c.name}</h3>
                <p className="text-xs opacity-80 mb-2">{toFaDigits(c.productCount)} محصول</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  مشاهده <ArrowLeft className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredData?.products && featuredData.products.length > 0 && (
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                <Tag className="h-4 w-4" />
                منتخب ویژه
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold">محصولات پیشنهادی</h2>
            </div>
            <Button variant="ghost" onClick={() => go({ name: "shop" })} className="gap-1">
              همه محصولات
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredData.products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* PROMO BANNER */}
      <section className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-14"
        >
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -right-6 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-3">فرصت محدود</Badge>
              <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                تا ۴۰٪ تخفیف
                <br />
                کالکشن پاییزه
              </h3>
              <p className="opacity-90 mb-6 max-w-md leading-7">
                بهترین فرصت برای به‌روزرسانی کمد لباست. تخفیف‌های ویژه روی منتخب محصولات پاییزه.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full h-12 px-7"
                onClick={() => go({ name: "shop" })}
              >
                خرید کنید
              </Button>
            </div>
            <div className="hidden md:flex justify-center gap-4">
              {["red-dress", "men-jacket", "handbag"].map((img, i) => (
                <motion.div
                  key={img}
                  animate={{ y: [0, i % 2 === 0 ? -12 : 12, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-32 h-44 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl"
                  style={{ marginTop: i === 1 ? 20 : 0 }}
                >
                  <Image src={`/products/${img}.png`} alt="" fill className="object-cover" sizes="128px" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* NEW ARRIVALS */}
      {newData?.products && newData.products.length > 0 && (
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                <Sparkles className="h-4 w-4" />
                تازه‌ها
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold">جدیدترین محصولات</h2>
            </div>
            <Button variant="ghost" onClick={() => go({ name: "shop" })} className="gap-1">
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newData.products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "ارسال سریع", desc: "تحویل ۲-۴ روزه در سراسر ایران" },
            { icon: ShieldCheck, title: "ضمانت اصالت", desc: "تضمین کیفیت و اصالت کالا" },
            { icon: Headphones, title: "پشتیبانی ۲۴/۷", desc: "پاسخگویی در تمام ساعات" },
            { icon: Tag, title: "قیمت منصفانه", desc: "بهترین قیمت بازار" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border bg-card p-5 flex items-start gap-3"
            >
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground leading-5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-card/50 border-y py-14 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="نظرات مشتریان"
            title="مشتریان ما چه می‌گویند"
            desc="رضایت شما، اعتبار ماست"
          />
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border bg-background p-6 relative"
              >
                <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/15" />
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star
                      key={k}
                      className={`h-4 w-4 ${k < t.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="text-sm leading-7 text-muted-foreground mb-4">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div className="font-semibold text-sm">{t.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            آماده‌ای استایلت رو متفاوت کنی؟
          </h2>
          <p className="text-muted-foreground mb-7 max-w-lg mx-auto">
            همین حالا از کالکشن ما دیدن کن و با چند کلیک سفارش بده
          </p>
          <Button size="lg" className="rounded-full h-12 px-8" onClick={() => go({ name: "shop" })}>
            شروع خرید
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="text-primary text-sm font-medium mb-1.5">{eyebrow}</div>
      <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{title}</h2>
      {desc && <p className="text-muted-foreground text-sm">{desc}</p>}
    </motion.div>
  );
}
