import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(n: number): string {
  return n.toLocaleString("fa-IR")
}

export function formatPriceWithToman(n: number): string {
  return `${formatPrice(n)} تومان`
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFaDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

// Map Persian color names to hex swatches
const COLOR_MAP: Record<string, string> = {
  "سرخ": "#c0392b",
  "قرمز": "#e74c3c",
  "صورتی": "#f48fb1",
  "مشکی": "#1a1a1a",
  "سفید": "#f5f5f5",
  "کرم": "#e8d9c0",
  "بژ": "#d8c4a0",
  "کاهی": "#c4b896",
  "زرد": "#f1c40f",
  "زرد شاد": "#f4d03f",
  "سبز": "#27ae60",
  "آبی": "#3498db",
  "طوسی": "#7f8c8d",
  "سرمه‌ای": "#1f3a5f",
  "قهوه‌ای": "#7b4f2a",
  "مولتی": "linear-gradient(45deg,#e74c3c,#f1c40f,#27ae60,#3498db)",
};

export function colorToHex(name: string): string {
  return COLOR_MAP[name] || "#cccccc";
}

export function relativeTimeFa(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "هم‌اکنون";
  if (mins < 60) return `${toFaDigits(mins)} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${toFaDigits(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toFaDigits(days)} روز پیش`;
  const months = Math.floor(days / 30);
  return `${toFaDigits(months)} ماه پیش`;
}
