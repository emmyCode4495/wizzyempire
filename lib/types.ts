export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  created_at: string;
  category?: Category | null;
};

export type CartLine = {
  id: string; // local composite id: productId-size-color
  product_id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
};

export type ShippingAddress = {
  full_name: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
};

// Minimal Database type so the Supabase SSR client can be generically typed.
// Replace with `supabase gen types typescript` output for full type safety.
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};
