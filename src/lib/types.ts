export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  finalPrice: number;
  discountPercent: number;
  images: string[];
  colors: string[];
  sizes: string[];
  material: string | null;
  brand: string | null;
  sku: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  productCount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  color: string | null;
  size: string | null;
  image: string | null;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string | null;
  note: string | null;
  total: number;
  status: string;
  channel: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Settings {
  storeName: string;
  storeSlogan: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  telegram: string;
  heroTitle: string;
  heroSubtitle: string;
  freeShipText: string;
}
