"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShoppingBag,
  MessageCircle,
  Phone,
  Heart,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  ChevronLeft,
  Star,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/star-rating";
import { ProductCard } from "@/components/product-card";
import { useNav } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { useProducts, useSettings } from "@/lib/hooks";
import { formatPrice, toFaDigits, colorToHex, cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductView({ slug }: { slug: string }) {
  const go = useNav((s) => s.go);
  const add = useCart((s) => s.add);
  const setCartOpen = useNav((s) => s.setCartOpen);
  const { data } = useProducts({});
  const { data: settingsData } = useSettings();
  const settings = settingsData?.settings;

  const product = data?.products?.find((p) => p.slug === slug);
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [qty, setQty] = React.useState(1);
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || "");
      setSelectedSize(product.sizes[0] || "");
      setQty(1);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">در حال بارگذاری محصول...</p>
      </div>
    );
  }

  const img = product.images[0] || "/products/placeholder.png";
  const related = (data?.products || [])
    .filter((p) => p.category?.slug === product.category?.slug && p.id !== product.id)
    .slice(0, 4);

  function addToCart() {
    if (product!.colors.length > 0 && !selectedColor) {
      toast.warning("یک رنگ انتخاب کنید");
      return;
    }
    if (product!.sizes.length > 0 && !selectedSize) {
      toast.warning("یک سایز انتخاب کنید");
      return;
    }
    add(
      {
        productId: product!.id,
        slug: product!.slug,
        name: product!.name,
        price: product!.finalPrice,
        image: img,
        color: selectedColor,
        size: selectedSize,
      },
      qty
    );
    toast.success("به سبد افزوده شد");
    setCartOpen(true);
  }

  function orderWhatsApp() {
    const phone = settings?.whatsapp || "989123456789";
    let msg = `سلام ${settings?.storeName || "بوتیک مُد"} 👋%0A%0A`;
    msg += `می‌خوام این محصول رو سفارش بدم:%0A%0A`;
    msg += `🛍 ${product!.name}%0A`;
    if (selectedColor) msg += `🎨 رنگ: ${selectedColor}%0A`;
    if (selectedSize) msg += `📏 سایز: ${selectedSize}%0A`;
    msg += `🔢 تعداد: ${toFaDigits(qty)}%0A`;
    msg += `💰 قیمت: ${formatPrice(product!.finalPrice * qty)} تومان%0A%0A`;
    msg += `لطفاً تایید کنید. 🙏`;
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "مشتری واتساپ",
        phone: "-",
        total: product!.finalPrice * qty,
        channel: "whatsapp",
        items: [
          {
            productId: product!.id,
            name: product!.name,
            price: product!.finalPrice,
            qty,
            color: selectedColor,
            size: selectedSize,
            image: img,
          },
        ],
      }),
    }).catch(() => {});
    toast.success("سفارش در واتساپ آماده شد");
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 flex-wrap">
        <button onClick={() => go({ name: "home" })} className="hover:text-primary">خانه</button>
        <ChevronLeft className="h-3.5 w-3.5" />
        <button onClick={() => go({ name: "shop" })} className="hover:text-primary">فروشگاه</button>
        {product.category && (
          <>
            <ChevronLeft className="h-3.5 w-3.5" />
            <button
              onClick={() => go({ name: "shop", category: product.category!.slug })}
              className="hover:text-primary"
            >
              {product.category.name}
            </button>
          </>
        )}
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border bg-muted shadow-soft">
            <Image
              src={img}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {product.discountPercent > 0 && (
                <Badge className="bg-primary text-primary-foreground shadow rounded-full px-3 py-1">
                  {toFaDigits(product.discountPercent)}٪ تخفیف
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-accent text-accent-foreground shadow rounded-full px-3 py-1">
                  ویژه
                </Badge>
              )}
            </div>
          </div>
          {/* Thumbnails (same image repeated for demo) */}
          <div className="flex gap-2 mt-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "relative h-20 w-16 rounded-xl overflow-hidden border-2 bg-muted cursor-pointer transition",
                  i === 0 ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {product.brand && (
              <Badge variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {product.brand}
              </Badge>
            )}
            {product.category && (
              <Badge variant="outline">{product.category.name}</Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-5">
            <StarRating value={product.rating} showValue count={product.reviewCount} size={16} />
            <span className="text-xs text-muted-foreground nums-fa">
              {toFaDigits(product.reviewCount)} نظر
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6 pb-6 border-b">
            <span className="text-3xl font-extrabold text-primary nums-fa">
              {formatPrice(product.finalPrice)}
              <span className="text-sm font-normal text-muted-foreground mr-1">تومان</span>
            </span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through nums-fa mb-1">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Color selection */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold text-sm">انتخاب رنگ</span>
                <span className="text-xs text-muted-foreground">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => {
                  const hex = colorToHex(c);
                  const isGradient = String(hex).includes("gradient");
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={cn(
                        "relative h-10 w-10 rounded-full border-2 transition",
                        selectedColor === c ? "border-primary scale-110 shadow-soft" : "border-border hover:border-primary/50"
                      )}
                      style={isGradient ? { background: undefined } : { background: hex }}
                    >
                      {isGradient && <span className="block h-full w-full rounded-full" style={{ background: hex }} />}
                      {selectedColor === c && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold text-sm">انتخاب سایز</span>
                <button className="text-xs text-primary hover:underline">راهنمای سایز</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "min-w-11 h-11 px-3 rounded-xl border-2 text-sm font-medium transition",
                      selectedSize === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 border rounded-full h-11 px-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid place-items-center h-9 w-9 hover:text-primary"
                aria-label="کم"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold nums-fa">{toFaDigits(qty)}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid place-items-center h-9 w-9 hover:text-primary"
                aria-label="زیاد"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full"
              onClick={() => setLiked((v) => !v)}
              aria-label="علاقه‌مندی"
            >
              <Heart className={cn("h-5 w-5", liked && "fill-primary text-primary")} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("لینک کپی شد");
                }
              }}
              aria-label="اشتراک"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={addToCart} className="h-12 rounded-full gap-2" size="lg">
              <ShoppingBag className="h-5 w-5" />
              افزودن به سبد
            </Button>
            <Button
              onClick={orderWhatsApp}
              className="h-12 rounded-full gap-2 bg-[#25D366] hover:bg-[#1da851] text-white"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              سفارش واتساپ
            </Button>
          </div>
          <Button
            onClick={() => {
              window.location.href = `tel:${settings?.phone || "02112345678"}`;
            }}
            variant="outline"
            className="w-full h-11 rounded-full gap-2 mb-6"
          >
            <Phone className="h-4 w-4" />
            سفارش تلفنی: {settings?.phone || "02112345678"}
          </Button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, title: "ارسال سریع", desc: "۲-۴ روز" },
              { icon: ShieldCheck, title: "ضمانت", desc: "اصالت کالا" },
              { icon: RefreshCw, title: "بازگشت", desc: "۷ روز" },
            ].map((t) => (
              <div key={t.title} className="rounded-xl border bg-card p-3 text-center">
                <t.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <div className="text-xs font-bold">{t.title}</div>
                <div className="text-[10px] text-muted-foreground">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="desc" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="desc">توضیحات</TabsTrigger>
              <TabsTrigger value="specs">مشخصات</TabsTrigger>
              <TabsTrigger value="reviews">نظرات</TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="mt-4 text-sm leading-7 text-muted-foreground">
              {product.description}
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              <ul className="space-y-2 text-sm">
                {product.material && (
                  <SpecRow label="جنس" value={product.material} />
                )}
                {product.brand && <SpecRow label="برند" value={product.brand} />}
                {product.sku && <SpecRow label="کد محصول" value={product.sku} />}
                <SpecRow label="موجودی" value={`${toFaDigits(product.stock)} عدد`} />
                {product.colors.length > 0 && (
                  <SpecRow label="رنگ‌ها" value={product.colors.join("، ")} />
                )}
                {product.sizes.length > 0 && (
                  <SpecRow label="سایزها" value={product.sizes.join("، ")} />
                )}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-primary nums-fa">{toFaDigits(product.rating.toFixed(1))}</div>
                  <StarRating value={product.rating} size={14} className="justify-center mt-1" />
                  <div className="text-xs text-muted-foreground mt-1 nums-fa">{toFaDigits(product.reviewCount)} نظر</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : star === 2 ? 1 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 nums-fa">{toFaDigits(star)}</span>
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-muted-foreground nums-fa">{toFaDigits(pct)}٪</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: "مریم ا.", text: "کیفیت عالی، دقیقاً مطابق عکس. سایزبندی درست بود.", star: 5 },
                  { name: "علی ر.", text: "خیلی راحت و خوش‌دوخت. پیشنهاد می‌کنم.", star: 5 },
                  { name: "سارا م.", text: "قیمتش منصفانه بود ولی رنگش کمی متفاوت از عکس بود.", star: 4 },
                ].map((r, i) => (
                  <div key={i} className="rounded-xl border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="grid place-items-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {r.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-sm">{r.name}</span>
                      </div>
                      <StarRating value={r.star} size={12} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-6">{r.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Separator className="flex-1" />
            <h2 className="text-xl md:text-2xl font-extrabold">محصولات مشابه</h2>
            <Separator className="flex-1" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium nums-fa">{value}</span>
    </li>
  );
}
