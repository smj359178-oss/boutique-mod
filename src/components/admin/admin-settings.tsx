"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Phone,
  MessageCircle,
  Instagram,
  Send,
  Mail,
  MapPin,
  Shield,
  Image as ImageIcon,
  Truck,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useSettings, useUpdateSettings } from "@/lib/hooks";
import { cn, toFaDigits } from "@/lib/utils";
import type { Settings } from "@/lib/types";

type FormState = Partial<Settings> & { adminPassword?: string };

const EMPTY: FormState = {
  storeName: "",
  storeSlogan: "",
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  instagram: "",
  telegram: "",
  heroTitle: "",
  heroSubtitle: "",
  freeShipText: "",
  adminPassword: "",
};

export function AdminSettings() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      const s = data.settings;
      setForm({
        storeName: s.storeName || "",
        storeSlogan: s.storeSlogan || "",
        whatsapp: s.whatsapp || "",
        phone: s.phone || "",
        email: s.email || "",
        address: s.address || "",
        instagram: s.instagram || "",
        telegram: s.telegram || "",
        heroTitle: s.heroTitle || "",
        heroSubtitle: s.heroSubtitle || "",
        freeShipText: s.freeShipText || "",
        adminPassword: "",
      });
    }
  }, [data]);

  async function handleSave() {
    if (!form.storeName?.trim()) {
      toast.error("نام فروشگاه را وارد کنید");
      return;
    }
    const payload: Record<string, unknown> = { ...form };
    // Only send password if user filled it
    if (!form.adminPassword) delete payload.adminPassword;
    setSaving(true);
    try {
      await updateSettings.mutateAsync(payload);
      toast.success("تنظیمات با موفقیت ذخیره شد");
      setForm((f) => ({ ...f, adminPassword: "" }));
    } catch {
      toast.error("خطا در ذخیره تنظیمات");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">تنظیمات فروشگاه</h1>
          <p className="text-sm text-muted-foreground">پیکربندی اطلاعات و ارتباطات بوتیک مُد</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="shadow-soft">
          {saving ? <Loader2 className="ml-1.5 h-4 w-4 animate-spin" /> : <Save className="ml-1.5 h-4 w-4" />}
          ذخیره تغییرات
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Store info */}
        <Section
          icon={Store}
          title="اطلاعات فروشگاه"
          description="هویت و مشخصات اصلی فروشگاه"
          delay={0}
        >
          <Field
            id="store-name"
            label="نام فروشگاه"
            value={form.storeName || ""}
            onChange={(v) => setForm({ ...form, storeName: v })}
            placeholder="بوتیک مُد"
          />
          <Field
            id="store-slogan"
            label="شعار فروشگاه"
            value={form.storeSlogan || ""}
            onChange={(v) => setForm({ ...form, storeSlogan: v })}
            placeholder="مد و استایل مدرن"
          />
          <Field
            id="store-email"
            label="ایمیل"
            type="email"
            value={form.email || ""}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="info@boutique-mod.ir"
            icon={Mail}
            ltr
          />
          <Field
            id="store-phone"
            label="تلفن تماس"
            value={form.phone || ""}
            onChange={(v) => setForm({ ...form, phone: v })}
            placeholder="02112345678"
            icon={Phone}
            ltr
          />
          <Field
            id="store-address"
            label="آدرس"
            value={form.address || ""}
            onChange={(v) => setForm({ ...form, address: v })}
            placeholder="تهران، خیابان ولیعصر، پلاک ۱۲۳"
            icon={MapPin}
            textarea
          />
          <Field
            id="free-ship"
            label="متن ارسال رایگان"
            value={form.freeShipText || ""}
            onChange={(v) => setForm({ ...form, freeShipText: v })}
            placeholder="ارسال رایگان سفارش‌های بالای ۵۰۰٬۰۰۰ تومان"
            icon={Truck}
          />
        </Section>

        {/* Social */}
        <Section
          icon={MessageCircle}
          title="شبکه‌های اجتماعی و ارتباط"
          description="اطلاعات تماس و شبکه‌های اجتماعی"
          delay={0.06}
        >
          <Field
            id="whatsapp"
            label="شماره واتساپ (با کد کشور، بدون +)"
            value={form.whatsapp || ""}
            onChange={(v) => setForm({ ...form, whatsapp: v })}
            placeholder="989123456789"
            icon={MessageCircle}
            ltr
            hint="فرمت بین‌المللی بدون علامت +"
          />
          <Field
            id="instagram"
            label="اینستاگرام"
            value={form.instagram || ""}
            onChange={(v) => setForm({ ...form, instagram: v })}
            placeholder="boutique.mod"
            icon={Instagram}
            ltr
            hint="فقط نام کاربری، بدون @ و بدون URL"
          />
          <Field
            id="telegram"
            label="تلگرام"
            value={form.telegram || ""}
            onChange={(v) => setForm({ ...form, telegram: v })}
            placeholder="boutique.mod"
            icon={Send}
            ltr
            hint="فقط نام کاربری، بدون @ و بدون URL"
          />
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">پیش‌نمایش لینک‌ها:</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {form.whatsapp && (
                <a
                  href={`https://wa.me/${form.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  <MessageCircle className="h-3 w-3" />
                  wa.me/{toFaDigits(form.whatsapp)}
                </a>
              )}
              {form.instagram && (
                <a
                  href={`https://instagram.com/${form.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition"
                >
                  <Instagram className="h-3 w-3" />
                  @{form.instagram}
                </a>
              )}
              {form.telegram && (
                <a
                  href={`https://t.me/${form.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-1 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition"
                >
                  <Send className="h-3 w-3" />
                  @{form.telegram}
                </a>
              )}
            </div>
          </div>
        </Section>

        {/* Hero content */}
        <Section
          icon={ImageIcon}
          title="محتوای صفحه اصلی"
          description="عنوان و توضیحات بخش هرو"
          delay={0.12}
        >
          <Field
            id="hero-title"
            label="عنوان هرو"
            value={form.heroTitle || ""}
            onChange={(v) => setForm({ ...form, heroTitle: v })}
            placeholder="استایل تو، امضای تو"
          />
          <Field
            id="hero-subtitle"
            label="زیرعنوان هرو"
            value={form.heroSubtitle || ""}
            onChange={(v) => setForm({ ...form, heroSubtitle: v })}
            placeholder="جدیدترین کالکشن لباس با بهترین کیفیت و قیمت"
            textarea
          />
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-accent/10 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">پیش‌نمایش عنوان:</p>
            <p className="text-xl font-bold text-gradient">{form.heroTitle || "عنوان فروشگاه"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {form.heroSubtitle || "زیرعنوان فروشگاه در اینجا نمایش داده می‌شود"}
            </p>
          </div>
        </Section>

        {/* Security */}
        <Section
          icon={Shield}
          title="امنیت"
          description="تغییر رمز عبور پنل مدیریت"
          delay={0.18}
          accent="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        >
          <div className="space-y-1.5">
            <Label htmlFor="admin-pw">رمز عبور جدید</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-pw"
                type={showPw ? "text" : "password"}
                value={form.adminPassword || ""}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="••••••••"
                className="pr-9 pl-9"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
                tabIndex={-1}
                aria-label={showPw ? "مخفی کردن" : "نمایش"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              در صورت خالی گذاشتن، رمز قبلی حفظ می‌شود. رمز فعلی پیش‌فرض: <code className="font-mono">{toFaDigits("admin123")}</code>
            </p>
          </div>
          <Separator className="my-2" />
          <div className="rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3">
            <div className="flex gap-2">
              <Shield className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-xs">
                <p className="font-medium text-amber-800 dark:text-amber-300">توصیه امنیتی</p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-400/80">
                  از رمز عبور قوی با حداقل ۸ کاراکتر شامل حروف و اعداد استفاده کنید.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Sticky save bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-4 z-20"
      >
        <Card className="border-border/60 glass shadow-soft-lg">
          <CardContent className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">تغییرات را بررسی کرده و ذخیره کنید</span>
              <span className="sm:hidden">ذخیره تنظیمات</span>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="ml-1.5 h-4 w-4 animate-spin" /> : <Save className="ml-1.5 h-4 w-4" />}
              ذخیره
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  delay = 0,
  accent = "bg-primary/10 text-primary",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="h-full border-border/60 shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  ltr,
  textarea,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
  ltr?: boolean;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      {textarea ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          dir={ltr ? "ltr" : "rtl"}
        />
      ) : (
        <div className="relative">
          {Icon && (
            <Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(Icon && "pr-9")}
            dir={ltr ? "ltr" : "rtl"}
          />
        </div>
      )}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
