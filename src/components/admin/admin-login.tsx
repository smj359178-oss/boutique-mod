"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useNav } from "@/lib/store";
import { toFaDigits } from "@/lib/utils";

export function AdminLogin() {
  const { setAdmin, go } = useNav();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("رمز عبور را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAdmin(true);
        toast.success("خوش آمدید! ورود با موفقیت انجام شد.");
      } else {
        toast.error("رمز عبور اشتباه است");
      }
    } catch {
      toast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-bg flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass shadow-soft-lg border-border/60 overflow-hidden">
          <CardContent className="p-0">
            {/* Header band */}
            <div className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 px-8 py-10 text-center">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30"
              >
                <Lock className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="relative text-2xl font-bold text-primary-foreground">
                ورود به پنل مدیریت
              </h1>
              <p className="relative mt-1 text-sm text-primary-foreground/80">
                بوتیک مُد — سیستم مدیریت فروشگاه
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-8">
              <div className="space-y-2">
                <Label htmlFor="pw" className="text-sm font-medium">
                  رمز عبور مدیریت
                </Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                    className="pl-10 h-11 text-base"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
                    tabIndex={-1}
                    aria-label={show ? "مخفی کردن رمز" : "نمایش رمز"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-semibold shadow-soft"
              >
                {loading ? (
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShieldCheck className="ml-2 h-5 w-5" />
                )}
                {loading ? "در حال ورود..." : "ورود به پنل"}
              </Button>

              <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
                رمز پیش‌فرض: <span className="font-mono font-semibold text-foreground">admin123</span>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => go({ name: "home" })}
                disabled={loading}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به فروشگاه
              </Button>
            </form>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          کلیه حقوق این پنل محفوظ است © {toFaDigits(new Date().getFullYear())}
        </motion.p>
      </motion.div>
    </div>
  );
}
