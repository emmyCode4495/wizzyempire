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

// Supabase Database types — keeps insert/update typed (index signatures alone
// resolve to `never` with current @supabase/supabase-js).
// For full generated types later: `supabase gen types typescript`.

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          price: number;
          compare_at_price?: number | null;
          category_id?: string | null;
          images?: string[];
          sizes?: string[];
          colors?: string[];
          stock?: number;
          featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          category_id?: string | null;
          images?: string[];
          sizes?: string[];
          colors?: string[];
          stock?: number;
          featured?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          size: string;
          color: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          size?: string;
          color?: string;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          size?: string;
          color?: string;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          total: number;
          shipping_address: ShippingAddress;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          total: number;
          shipping_address: ShippingAddress;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: OrderStatus;
          total?: number;
          shipping_address?: ShippingAddress;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          price: number;
          size: string;
          color: string;
          quantity: number;
          image: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name: string;
          price: number;
          size?: string;
          color?: string;
          quantity: number;
          image?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          name?: string;
          price?: number;
          size?: string;
          color?: string;
          quantity?: number;
          image?: string | null;
        };
        Relationships: [];
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};