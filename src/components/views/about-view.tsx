"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  Award,
  Users,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/lib/store";
import { useSettings } from "@/lib/hooks";
import { toFaDigits } from "@/lib/utils";

export function AboutView() {
  const go = useNav((s) => s.go);
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;

  const stats = [
    { icon: ShoppingBag, value: "+۵۰۰", label: "محصول متنوع" },
    { icon: Users, value: "+۱۰هزار", label: "مشتری وفادار" },
    { icon: Truck, value: "+۵۰هزار", label: "سفارش ارسال‌شده" },
    { icon: Award, value: "۴.۸", label: "امتیاز رضایت" },
  ];

  const values = [
    { icon: Target, title: "مأموریت ما", desc: "ارائه لباس باکیفیت و شیک با قیمت منصفانه به همه ایرانیان، همراه با تجربه خریدی آسان و لذت‌بخش." },
    { icon: Eye, title: "چشم‌انداز", desc: "تبدیل‌شدن به برترین فروشگاه آنلاین لباس ایران با جدیدترین کالکشن‌های روز دنیا." },
    { icon: Heart, title: "ارزش‌ها", desc: "صداقت در توصیف محصول، احترام به مشتری، کیفیت بی‌چون‌وچرا و پاسخگویی کامل." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 backdrop-blur px-4 py-1.5 text-xs font-medium mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              درباره {settings?.storeName || "بوتیک مُد"}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="text-gradient">داستان ما، استایل تو</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-8 text-base md:text-lg">
              ما با عشق به مد و استایل شروع کردیم تا بهترین تجربه خرید آنلاین لباس را برای شما رقم بزنیم.
              هر محصول با دقت انتخاب می‌شود تا کیفیت، طراحی و قیمت در کنار هم معنای پیدا کنند.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border bg-card p-5 text-center shadow-soft"
            >
              <s.icon className="h-7 w-7 text-primary mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-primary nums-fa">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-soft-lg"
          >
            <Image src="/hero.png" alt="داستان ما" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-primary text-sm font-medium mb-2">داستان ما</div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">از یک ایده کوچک تا برند محبوب</h2>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                {settings?.storeName || "بوتیک مُد"} با هدف ارائه لباس‌های شیک و باکیفیت با قیمتی منصفانه متولد شد.
                ما باور داریم که استایل خوب نباید لوکس باشد، بلکه باید در دسترس همه باشد.
              </p>
              <p>
                تیم ما روزانه جدیدترین ترندهای مد جهان را رصد می‌کند و کالکشن‌هایی را گردآوری می‌کند که
                هم مدرن باشند و هم با فرهنگ و سلیقه ایرانیان هماهنگ. هر قطعه پیش از عرضه، توسط کارشناسان ما بررسی می‌شود.
              </p>
              <p>
                مهم‌ترین سرمایه ما اعتماد شماست؛ به همین دلیل شفافیت در توصیف محصول، ارسال سریع
                و پشتیبانی پاسخگو را سرلوحه کار خود قرار داده‌ایم.
              </p>
            </div>
            <Button className="mt-6 rounded-full" onClick={() => go({ name: "shop" })}>
              مشاهده محصولات
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card/50 border-y py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-primary text-sm font-medium mb-1">ارزش‌های ما</div>
            <h2 className="text-2xl md:text-3xl font-extrabold">آنچه ما را تعریف می‌کند</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border bg-background p-6"
              >
                <div className="grid place-items-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">به خانواده {settings?.storeName || "ما"} بپیوند</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          همین حالا اولین خریدت رو انجام بده و تجربه‌ای متفاوت داشته باش
        </p>
        <Button size="lg" className="rounded-full h-12 px-8" onClick={() => go({ name: "shop" })}>
          شروع خرید
        </Button>
      </section>
    </div>
  );
}
