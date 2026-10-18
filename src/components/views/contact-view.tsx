"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Send,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/lib/hooks";
import { toast } from "sonner";

export function ContactView() {
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;
  const [form, setForm] = React.useState({ name: "", phone: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const phone = settings?.whatsapp || "989123456789";
    const msg = `سلام ${settings?.storeName || "بوتیک مُد"} 👋%0A%0A`;
    const body = msg + `نام: ${form.name}%0Aتلفن: ${form.phone}%0A%0A${form.message}`;
    window.open(`https://wa.me/${phone}?text=${body}`, "_blank");
    toast.success("پیام در واتساپ آماده شد");
    setForm({ name: "", phone: "", message: "" });
  }

  const cards = [
    {
      icon: Phone,
      title: "تماس تلفنی",
      value: settings?.phone || "02112345678",
      action: () => (window.location.href = `tel:${settings?.phone || "02112345678"}`),
      actionLabel: "تماس",
    },
    {
      icon: MessageCircle,
      title: "واتساپ",
      value: settings?.whatsapp ? `+${settings.whatsapp}` : "+989123456789",
      action: () => window.open(`https://wa.me/${settings?.whatsapp || "989123456789"}`, "_blank"),
      actionLabel: "چت",
    },
    {
      icon: Mail,
      title: "ایمیل",
      value: settings?.email || "info@boutique-mod.ir",
      action: () => (window.location.href = `mailto:${settings?.email || "info@boutique-mod.ir"}`),
      actionLabel: "ارسال",
    },
    {
      icon: MapPin,
      title: "آدرس",
      value: settings?.address || "تهران، خیابان ولیعصر",
      action: () => {},
      actionLabel: "نقشه",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <div className="text-primary text-sm font-medium mb-1.5">تماس با ما</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">همیشه در کنار شما هستیم</h1>
        <p className="text-muted-foreground leading-7">
          هر سوال یا پیشنهادی دارید، خوشحال می‌شویم بشنویم. از طریق راه‌های زیر با ما در ارتباط باشید.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border bg-card p-5 text-center"
          >
            <div className="grid place-items-center h-12 w-12 rounded-xl bg-primary/10 text-primary mx-auto mb-3">
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm mb-1">{c.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 break-all" dir="ltr">{c.value}</p>
            <Button variant="outline" size="sm" className="w-full rounded-full" onClick={c.action}>
              {c.actionLabel}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border bg-card p-6 md:p-8"
        >
          <h2 className="text-xl font-extrabold mb-1">پیام خود را بفرستید</h2>
          <p className="text-sm text-muted-foreground mb-6">پیام شما از طریق واتساپ ارسال می‌شود</p>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="نام شما"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="09123456789"
                  dir="ltr"
                  className="text-right"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">پیام شما</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                placeholder="متن پیام..."
              />
            </div>
            <Button type="submit" className="w-full rounded-full h-11 gap-2">
              <MessageCircle className="h-4 w-4" />
              ارسال پیام
            </Button>
          </form>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-bold">ساعات کاری</h3>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { d: "شنبه تا چهارشنبه", h: "۹:۰۰ - ۲۱:۰۰" },
                { d: "پنجشنبه", h: "۹:۰۰ - ۱۸:۰۰" },
                { d: "جمعه", h: "تعطیل" },
              ].map((r) => (
                <div key={r.d} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <span className="text-muted-foreground">{r.d}</span>
                  <span className="font-medium nums-fa">{r.h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-bold mb-4">ما را در شبکه‌های اجتماعی دنبال کنید</h3>
            <div className="flex gap-3">
              <a
                href={`https://instagram.com/${settings?.instagram || ""}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 hover:bg-accent transition"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm font-medium">اینستاگرام</span>
              </a>
              <a
                href={`https://t.me/${settings?.telegram || ""}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border py-3 hover:bg-accent transition"
              >
                <Send className="h-5 w-5" />
                <span className="text-sm font-medium">تلگرام</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-primary text-primary-foreground p-6">
            <MessageCircle className="h-8 w-8 mb-3" />
            <h3 className="font-bold text-lg mb-1">پاسخ سریع در واتساپ</h3>
            <p className="text-sm opacity-90 mb-4">
              سریع‌ترین راه برای پاسخ به سوالات شما، چت در واتساپ است. کمتر از ۱۰ دقیقه پاسخ می‌دهیم.
            </p>
            <Button
              variant="secondary"
              className="rounded-full gap-2"
              onClick={() => window.open(`https://wa.me/${settings?.whatsapp || "989123456789"}`, "_blank")}
            >
              <MessageCircle className="h-4 w-4" />
              شروع چت
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
