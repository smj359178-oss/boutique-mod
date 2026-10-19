"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { useNav } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { formatPrice, toFaDigits, colorToHex, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const go = useNav((s) => s.go);
  const add = useCart((s) => s.add);
  const setCartOpen = useNav((s) => s.setCartOpen);
  const [liked, setLiked] = React.useState(false);

  const img = product.images[0] || "/products/placeholder.png";
  const hoverImg = product.images[1];

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.finalPrice,
      image: img,
      color: product.colors[0] || "",
      size: product.sizes[0] || "",
    });
    toast.success("به سبد افزوده شد");
    setCartOpen(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="group"
    >
      <Card
        role="button"
        tabIndex={0}
        onClick={() => go({ name: "product", slug: product.slug })}
        onKeyDown={(e) => {
          if (e.key === "Enter") go({ name: "product", slug: product.slug });
        }}
        className="relative overflow-hidden rounded-2xl border bg-card p-0 cursor-pointer transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 group-hover:scale-105",
              hoverImg && "group-hover:opacity-0"
            )}
          />
          {hoverImg && (
            <Image
              src={hoverImg}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
              className="object-cover absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
            />
          )}
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.discountPercent > 0 && (
              <Badge className="bg-primary text-primary-foreground shadow rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                {toFaDigits(product.discountPercent)}٪ تخفیف
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-accent text-accent-foreground shadow rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                ویژه
              </Badge>
            )}
          </div>
          {/* Like */}
          <button
            aria-label="افزودن به علاقه‌مندی"
            onClick={(e) => {
              e.stopPropagation();
              setLiked((v) => !v);
            }}
            className="absolute top-3 left-3 grid place-items-center h-8 w-8 rounded-full glass border border-border/40 transition hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition ${liked ? "fill-primary text-primary" : "text-foreground/70"}`}
            />
          </button>
          {/* Hover actions */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 rounded-full h-9 gap-1.5"
                onClick={quickAdd}
              >
                <ShoppingBag className="h-4 w-4" />
                افزودن
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-9 w-9 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  go({ name: "product", slug: product.slug });
                }}
                aria-label="مشاهده جزئیات"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">{product.brand || "مُد"}</span>
            <StarRating value={product.rating} count={product.reviewCount} showValue size={11} />
          </div>
          <h3 className="font-semibold text-sm leading-6 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((c) => (
                <span
                  key={c}
                  title={c}
                  className="h-3.5 w-3.5 rounded-full border border-border/60 shadow-sm"
                  style={{ background: colorToHex(c).includes("gradient") ? undefined : colorToHex(c) }}
                >
                  {colorToHex(c).includes("gradient") && (
                    <span
                      className="block h-full w-full rounded-full"
                      style={{ background: colorToHex(c) }}
                    />
                  )}
                </span>
              ))}
            </div>
          )}
          {/* Price */}
          <div className="flex items-end justify-between pt-1">
            <div className="flex flex-col">
              {product.discountPrice && (
                <span className="text-[11px] text-muted-foreground line-through nums-fa">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="font-extrabold text-primary nums-fa text-base leading-5">
                {formatPrice(product.finalPrice)}
                <span className="text-[10px] font-normal text-muted-foreground mr-1">تومان</span>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
