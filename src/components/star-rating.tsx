"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toFaDigits } from "@/lib/utils";

export function StarRating({
  value,
  size = 14,
  showValue = false,
  count,
  className,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  className?: string;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center" style={{ gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const isHalf = i === full && half;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star
                className="absolute inset-0 text-muted-foreground/30"
                style={{ width: size, height: size }}
                fill="currentColor"
              />
              {(filled || isHalf) && (
                <Star
                  className="absolute inset-0 text-amber-400"
                  style={{
                    width: size,
                    height: size,
                    clipPath: isHalf ? "inset(0 50% 0 0)" : "none",
                  }}
                  fill="currentColor"
                />
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-muted-foreground nums-fa">
          {toFaDigits(value.toFixed(1))}
          {count !== undefined && ` (${toFaDigits(count)})`}
        </span>
      )}
    </div>
  );
}
