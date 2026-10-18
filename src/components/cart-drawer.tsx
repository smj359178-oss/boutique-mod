"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNav } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { useSettings } from "@/lib/hooks";
import { formatPrice, toFaDigits } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export function CartDrawer() {
  const { cartOpen, setCartOpen, go } = useNav();
  const { items, remove, updateQty, total, clear } = useCart();
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;

  const totalAmount = total();

  function buildWhatsAppMessage() {
    let msg = `سلام ${settings?.storeName || "بوتیک مُد"} 👋%0A`;
    msg += `می‌خوام سفارش زیر رو ثبت کنم:%0A%0A`;
    items.forEach((it, i) => {
      msg += `${toFaDigits(i + 1)}. ${it.name}%0A`;
      msg += `   رنگ: ${it.color || "-"} | سایز: ${it.size || "-"} | تعداد: ${toFaDigits(it.qty)}%0A`;
      msg += `   قیمت: ${formatPrice(it.price * it.qty)} تومان%0A%0A`;
    });
    msg += `💰 جمع کل: ${formatPrice(totalAmount)} تومان%0A%0A`;
    msg += `لطفاً تایید و راهنمایی بفرمایید. 🙏`;
    return msg;
  }

  function sendWhatsApp() {
    if (items.length === 0) {
      toast.warning("سبد خرید خالی است");
      return;
    }
    const phone = settings?.whatsapp || "989123456789";
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    // Also register order
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "مشتری واتساپ",
        phone: "-",
        total: totalAmount,
        channel: "whatsapp",
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          color: i.color,
          size: i.size,
          image: i.image,
        })),
      }),
    }).catch(() => {});
    toast.success("سفارش در واتساپ آماده شد");
  }

  function callPhone() {
    if (items.length === 0) {
      toast.warning("سبد خرید خالی است");
      return;
    }
    window.location.href = `tel:${settings?.phone || "02112345678"}`;
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <SheetTitle className="flex items-center justify-between text-right">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              سبد خرید
              {items.length > 0 && (
                <span className="text-xs text-muted-foreground nums-fa">
                  ({toFaDigits(items.length)} کالا)
                </span>
              )}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCartOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid place-items-center h-20 w-20 rounded-full bg-muted">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold mb-1">سبد خرید خالی است</p>
              <p className="text-sm text-muted-foreground">
                هنوز محصولی به سبد اضافه نکرده‌اید
              </p>
            </div>
            <Button
              onClick={() => {
                setCartOpen(false);
                go({ name: "shop" });
              }}
              className="rounded-full"
            >
              مشاهده محصولات
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.div
                    key={`${it.productId}-${it.color}-${it.size}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 rounded-xl border bg-card p-2.5"
                  >
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image src={it.image} alt={it.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-5 line-clamp-2">{it.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {it.color && <span>رنگ: {it.color}</span>}
                        {it.size && <span>سایز: {it.size}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border rounded-full">
                          <button
                            onClick={() => updateQty(it.productId, it.color, it.size, it.qty - 1)}
                            className="grid place-items-center h-7 w-7 hover:text-primary"
                            aria-label="کم"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm nums-fa">{toFaDigits(it.qty)}</span>
                          <button
                            onClick={() => updateQty(it.productId, it.color, it.size, it.qty + 1)}
                            className="grid place-items-center h-7 w-7 hover:text-primary"
                            aria-label="زیاد"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-primary nums-fa">
                          {formatPrice(it.price * it.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(it.productId, it.color, it.size)}
                      className="grid place-items-center h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-destructive transition flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                خالی کردن سبد
              </button>
            </div>

            <div className="border-t p-4 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">جمع کل</span>
                <span className="font-extrabold text-lg text-primary nums-fa">
                  {formatPrice(totalAmount)}
                  <span className="text-xs font-normal text-muted-foreground mr-1">تومان</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={sendWhatsApp} className="rounded-full gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white">
                  <MessageCircle className="h-4 w-4" />
                  سفارش واتساپ
                </Button>
                <Button onClick={callPhone} variant="outline" className="rounded-full gap-1.5">
                  <Phone className="h-4 w-4" />
                  تماس
                </Button>
              </div>
              <p className="text-[11px] text-center text-muted-foreground leading-5">
                پرداخت آنلاین فعال نیست — سفارش از طریق واتساپ یا تماس تلفنی نهایی می‌شود
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
