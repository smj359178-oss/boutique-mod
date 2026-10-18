import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوتیک مُد | فروشگاه لباس و استایل",
  description: "فروشگاه آنلاین لباس مُد - جدیدترین کالکشن لباس زنانه، مردانه، بچگانه و اکسسوری با بهترین کیفیت و قیمت. سفارش آسان از طریق واتساپ.",
  keywords: ["فروشگاه لباس", "بوتیک", "مد", "استایل", "لباس زنانه", "لباس مردانه", "خرید لباس"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "بوتیک مُد | فروشگاه لباس و استایل",
    description: "جدیدترین کالکشن لباس با بهترین کیفیت و قیمت",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
