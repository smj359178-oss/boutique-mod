import { db } from "../src/lib/db";

const PRODUCTS = [
  // ===== WOMEN =====
  {
    name: "پیراهن مجلسی سرخ",
    slug: "red-evening-dress",
    description:
      "پیراهن مجلسی بلند با رنگ سرخ جذاب، دوخت حرفه‌ای و پارچه ابریشمی نرم. مناسب مراسم و شب‌های خاص. طراحی شیک و فاخر که استایل شما را متمایز می‌کند.",
    price: 2890000,
    discountPrice: 2350000,
    image: "red-dress",
    colors: ["سرخ", "مشکی", "زرد"],
    sizes: ["S", "M", "L", "XL"],
    material: "ابریشم",
    brand: "مُد هاوس",
    category: "women",
    featured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: "بلوز کرپ کرم",
    slug: "cream-crepe-blouse",
    description:
      "بلوز زنانه از پارچه کرپ مرغوب با رنگ کرم نرم. آستین بلند و یقه گرد، طراحی مینیمال و شیک برای استایل روزمره و کژوال.",
    price: 890000,
    discountPrice: null,
    image: "cream-blouse",
    colors: ["کرم", "سفید", "مشکی"],
    sizes: ["S", "M", "L"],
    material: "کرپ",
    brand: "الیته",
    category: "women",
    featured: true,
    rating: 4.6,
    reviewCount: 87,
  },
  {
    name: "کاپشن زمستانی مشکی",
    slug: "black-winter-coat",
    description:
      "کاپشن زمستانی بلند با پارچه پشمی گرم و ضدآب. رنگ مشکی کلاسیک، طراحی شیک و گرم برای روزهای سرد سال. جیب‌های کاربردی و دوخت محکم.",
    price: 3450000,
    discountPrice: 2990000,
    image: "black-coat",
    colors: ["مشکی", "سرمه‌ای", "کاهی"],
    sizes: ["M", "L", "XL", "XXL"],
    material: "پشم",
    brand: "مُد هاوس",
    category: "women",
    featured: true,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    name: "دامن پلیسه میدی",
    slug: "pleated-midi-skirt",
    description:
      "دامن پلیسه میدی با طراحی کلاسیک و رنگ بژ نرم. طول مناسب و کمر کش‌دار، قابل ترکیب با انواع بلوز و پیراهن برای استایل شیک روزمره.",
    price: 1190000,
    discountPrice: null,
    image: "midi-skirt",
    colors: ["بژ", "مشکی", "زرد"],
    sizes: ["S", "M", "L"],
    material: "پلی‌استر",
    brand: "الیته",
    category: "women",
    featured: false,
    rating: 4.5,
    reviewCount: 56,
  },
  // ===== MEN =====
  {
    name: "پیراهن آستین بلند مردانه",
    slug: "men-long-sleeve-shirt",
    description:
      "پیراهن مردانه آستین بلند از پارچه نخی مرغوب با رنگ سفید کلاسیک. مناسب فرمال و نیمه‌رسمی، دوخت تمیز و یقه استاندارد.",
    price: 1290000,
    discountPrice: 990000,
    image: "men-shirt",
    colors: ["سفید", "آبی", "طوسی"],
    sizes: ["M", "L", "XL", "XXL"],
    material: "نخی",
    brand: "جنتلمن",
    category: "men",
    featured: true,
    rating: 4.7,
    reviewCount: 143,
  },
  {
    name: "تیشرت نخی مردانه",
    slug: "men-cotton-tshirt",
    description:
      "تیشرت مردانه از پارچه نخی صد در صد با رنگ سبز زیتونی. طراحی ساده و کلاسیک، آستین کوتاه و یقه گرد، مناسب استایل کژوال روزانه.",
    price: 590000,
    discountPrice: null,
    image: "men-tshirt",
    colors: ["سبز", "مشکی", "سفید", "طوسی"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "نخی",
    brand: "جنتلمن",
    category: "men",
    featured: false,
    rating: 4.4,
    reviewCount: 98,
  },
  {
    name: "کت چرم مردانه",
    slug: "men-leather-jacket",
    description:
      "کت چرم طبیعی مردانه با رنگ قهوه‌ای فاخر. طراحی کلاسیک و دوخت حرفه‌ای، آستر داخلی گرم و جیب‌های متعدد. یک قطعه جاودانه در کمد لباس شما.",
    price: 4990000,
    discountPrice: 4290000,
    image: "men-jacket",
    colors: ["قهوه‌ای", "مشکی"],
    sizes: ["M", "L", "XL", "XXL"],
    material: "چرم طبیعی",
    brand: "لرد",
    category: "men",
    featured: true,
    rating: 4.9,
    reviewCount: 178,
  },
  {
    name: "شلوار جین مردانه",
    slug: "men-denim-jeans",
    description:
      "شلوار جین مردانه با رنگ سرمه‌ای تیره و دوخت محکم. پارچه کش‌دار نرم و راحت، برش اسلیم‌فت، مناسب استایل روزمره و کژوال.",
    price: 1490000,
    discountPrice: 1190000,
    image: "men-jeans",
    colors: ["سرمه‌ای", "مشکی", "طوسی"],
    sizes: ["30", "32", "34", "36"],
    material: "دنیم",
    brand: "جنتلمن",
    category: "men",
    featured: false,
    rating: 4.6,
    reviewCount: 211,
  },
  // ===== KIDS =====
  {
    name: "پیراهن دخترانه گل‌دار",
    slug: "girls-floral-dress",
    description:
      "پیراهن دخترانه با طرح گل‌دار شاد و رنگ صورتی. پارچه نخی نرم و راحت برای پوست کودک، مناسب مهمانی و روزهای بهاری.",
    price: 690000,
    discountPrice: null,
    image: "kids-dress",
    colors: ["صورتی", "زرد", "سبز"],
    sizes: ["4", "6", "8", "10"],
    material: "نخی",
    brand: "کیدز",
    category: "kids",
    featured: true,
    rating: 4.8,
    reviewCount: 64,
  },
  {
    name: "تیشرت پسربچه",
    slug: "boys-tshirt",
    description:
      "تیشرت پسربچه از پارچه نخی نرم با رنگ زرد شاد. طراحی ساده و راحت، مناسب بازی و استایل روزمره کودکان.",
    price: 390000,
    discountPrice: 290000,
    image: "kids-tshirt",
    colors: ["زرد", "آبی", "قرمز"],
    sizes: ["4", "6", "8", "10", "12"],
    material: "نخی",
    brand: "کیدز",
    category: "kids",
    featured: false,
    rating: 4.5,
    reviewCount: 42,
  },
  // ===== ACCESSORIES =====
  {
    name: "کیف چرم دستی",
    slug: "leather-handbag",
    description:
      "کیف دستی چرم طبیعی با رنگ قهوه‌ای روشن. طراحی شیک و کاربردی، فضای داخلی جادار و بند کتفی قابل تنظیم. مکمل استایل شما.",
    price: 1990000,
    discountPrice: 1690000,
    image: "handbag",
    colors: ["قهوه‌ای", "مشکی", "کرم"],
    sizes: ["تک سایز"],
    material: "چرم طبیعی",
    brand: "لرد",
    category: "accessories",
    featured: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    name: "شال نخی رنگی",
    slug: "colorful-silk-scarf",
    description:
      "شال ابریشمی با طرح و رنگ‌های متنوع و شاد. پارچه نرم و خنک، قابل استفاده در فصول مختلف. هدیه‌ای عالی برای عزیزانتان.",
    price: 490000,
    discountPrice: null,
    image: "scarf",
    colors: ["مولتی", "قرمز", "سبز"],
    sizes: ["تک سایز"],
    material: "ابریشم",
    brand: "الیته",
    category: "accessories",
    featured: false,
    rating: 4.6,
    reviewCount: 73,
  },
  {
    name: "عینک آفتابی شیک",
    slug: "stylish-sunglasses",
    description:
      "عینک آفتابی با فریم مشکی و عدسی UV400. طراحی مدرن و محافظت کامل در برابر اشعه خورشید. اکسسوری ضروری استایل شما.",
    price: 790000,
    discountPrice: 590000,
    image: "sunglasses",
    colors: ["مشکی", "قهوه‌ای"],
    sizes: ["تک سایز"],
    material: "پلاستیک",
    brand: "لرد",
    category: "accessories",
    featured: false,
    rating: 4.5,
    reviewCount: 91,
  },
  {
    name: "ساعت مچی مینیمال",
    slug: "minimal-wristwatch",
    description:
      "ساعت مچی با طراحی مینیمال و بند چرمی قهوه‌ای. صفحه سفید ساده و عقربه‌های ظریف، مناسب استایل رسمی و کژوال. ضدآب تا ۳۰ متر.",
    price: 1590000,
    discountPrice: 1290000,
    image: "watch",
    colors: ["قهوه‌ای", "مشکی"],
    sizes: ["تک سایز"],
    material: "چرم",
    brand: "لرد",
    category: "accessories",
    featured: true,
    rating: 4.8,
    reviewCount: 187,
  },
];

const CATEGORIES = [
  { name: "زنانه", slug: "women", description: "جدیدترین کالکشن لباس زنانه", image: "women", icon: "WomenIcon" },
  { name: "مردانه", slug: "men", description: "استایل مدرن و کلاسیک مردانه", image: "men", icon: "MenIcon" },
  { name: "بچگانه", slug: "kids", description: "لباس شاد و راحت برای کودکان", image: "kids", icon: "KidsIcon" },
  { name: "اکسسوری", slug: "accessories", description: "تکمیل‌کننده استایل شما", image: "accessories", icon: "AccessoryIcon" },
];

async function main() {
  console.log("Seeding database...");

  await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      storeName: "بوتیک مُد",
      storeSlogan: "مد و استایل مدرن",
      whatsapp: "989123456789",
      phone: "02112345678",
      email: "info@boutique-mod.ir",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
      instagram: "boutique.mod",
      telegram: "boutique.mod",
      heroTitle: "استایل تو، امضای تو",
      heroSubtitle: "جدیدترین کالکشن لباس با بهترین کیفیت و قیمت — ارسال به سراسر ایران",
      freeShipText: "ارسال رایگان سفارش‌های بالای ۵۰۰٬۰۰۰ تومان",
      adminPassword: "admin123",
    },
  });

  const catMap: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image, icon: c.icon },
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  for (const p of PRODUCTS) {
    const images = JSON.stringify([`/products/${p.image}.png`]);
    const colors = JSON.stringify(p.colors);
    const sizes = JSON.stringify(p.sizes);
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        images,
        colors,
        sizes,
        material: p.material,
        brand: p.brand,
        categoryId: catMap[p.category],
        featured: p.featured,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: 50,
        sku: `SKU-${p.slug.slice(0, 6).toUpperCase()}`,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        images,
        colors,
        sizes,
        material: p.material,
        brand: p.brand,
        categoryId: catMap[p.category],
        featured: p.featured,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: 50,
        sku: `SKU-${p.slug.slice(0, 6).toUpperCase()}`,
      },
    });
  }

  const existingOrders = await db.order.count();
  if (existingOrders === 0) {
    const allProds = await db.product.findMany();
    const samples = [
      { name: "مریم احمدی", phone: "09121112233", status: "delivered", daysAgo: 1, items: [0, 4] },
      { name: "علی رضایی", phone: "09123334455", status: "delivered", daysAgo: 2, items: [6] },
      { name: "زهرا کریمی", phone: "09125556677", status: "pending", daysAgo: 0, items: [0, 10] },
      { name: "محمد حسینی", phone: "09127778899", status: "shipped", daysAgo: 1, items: [4, 7] },
      { name: "فاطمه نوری", phone: "09129990011", status: "delivered", daysAgo: 3, items: [2] },
      { name: "حسین موسوی", phone: "09120001122", status: "pending", daysAgo: 0, items: [13] },
      { name: "سارا اکبری", phone: "09121113344", status: "delivered", daysAgo: 4, items: [3, 1] },
      { name: "رضا قاسمی", phone: "09125559900", status: "shipped", daysAgo: 2, items: [6, 5] },
      { name: "نگار صادقی", phone: "09126664433", status: "delivered", daysAgo: 5, items: [10, 12] },
      { name: "امیر تهرانی", phone: "09124440099", status: "delivered", daysAgo: 6, items: [7] },
    ];
    for (const s of samples) {
      const items = s.items.map((i) => allProds[i]).filter(Boolean);
      if (items.length === 0) continue;
      const total = items.reduce((sum, it) => sum + (it.discountPrice ?? it.price), 0);
      const created = new Date(Date.now() - s.daysAgo * 86400000 - Math.random() * 86400000);
      await db.order.create({
        data: {
          customerName: s.name,
          phone: s.phone,
          address: "تهران",
          total,
          status: s.status,
          channel: Math.random() > 0.5 ? "whatsapp" : "call",
          createdAt: created,
          items: {
            create: items.map((it) => ({
              productId: it.id,
              name: it.name,
              price: it.discountPrice ?? it.price,
              qty: 1,
              color: JSON.parse(it.colors)[0],
              size: JSON.parse(it.sizes)[0],
              image: JSON.parse(it.images)[0],
            })),
          },
        },
      });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
