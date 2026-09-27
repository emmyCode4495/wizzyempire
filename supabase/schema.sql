-- ============================================================
-- LUME marketplace — Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  image_url text
);

alter table public.categories enable row level security;

create policy "Categories are public"
  on public.categories for select
  using (true);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text not null default '',
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  category_id uuid references public.categories (id) on delete set null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are public"
  on public.products for select
  using (true);

create index if not exists products_category_idx on public.products (category_id);

-- ---------- cart_items ----------
create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null default '',
  color text not null default '',
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id, size, color)
);

alter table public.cart_items enable row level security;

create policy "Users manage their own cart"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total numeric(10, 2) not null,
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users see their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- ---------- order_items ----------
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  price numeric(10, 2) not null,
  size text not null default '',
  color text not null default '',
  quantity integer not null check (quantity > 0),
  image text
);

alter table public.order_items enable row level security;

create policy "Users see their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Users create their own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- ---------- wishlists ----------
create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.wishlists enable row level security;

create policy "Users manage their own wishlist"
  on public.wishlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Seed data — safe to re-run
-- ============================================================

insert into public.categories (name, slug, image_url) values
  ('Outerwear', 'outerwear', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'),
  ('Knitwear', 'knitwear', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800'),
  ('Denim', 'denim', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'),
  ('Footwear', 'footwear', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'),
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=800')
on conflict (slug) do nothing;

insert into public.products
  (name, slug, description, price, compare_at_price, category_id, images, sizes, colors, stock, featured)
select
  p.name, p.slug, p.description, p.price, p.compare_at_price,
  c.id, p.images, p.sizes, p.colors, p.stock, p.featured
from (
  values
    ('Wool Overcoat', 'wool-overcoat',
     'A tailored double-breasted overcoat cut from heavyweight Italian wool. Built for cold mornings and long walks.',
     289.00, 340.00, 'outerwear',
     array['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900','https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900'],
     array['XS','S','M','L','XL'], array['Charcoal','Camel'], 24, true),
    ('Waxed Field Jacket', 'waxed-field-jacket',
     'Weatherproof waxed cotton jacket with a corduroy collar and four bellow pockets.',
     198.00, null, 'outerwear',
     array['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900'],
     array['S','M','L','XL'], array['Olive','Black'], 40, true),
    ('Merino Crewneck', 'merino-crewneck',
     'Fine-gauge merino wool crewneck knitted for a soft, breathable next-to-skin feel.',
     98.00, null, 'knitwear',
     array['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900'],
     array['XS','S','M','L','XL'], array['Cream','Navy','Rust'], 60, true),
    ('Cable Knit Sweater', 'cable-knit-sweater',
     'Chunky cable-knit sweater in a relaxed fit, spun from a cotton-wool blend.',
     128.00, 150.00, 'knitwear',
     array['https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=900'],
     array['S','M','L','XL'], array['Oatmeal','Forest'], 35, false),
    ('Straight Fit Selvedge Jeans', 'straight-fit-selvedge-jeans',
     'Rigid 14oz Japanese selvedge denim, straight through the leg with a classic five-pocket cut.',
     168.00, null, 'denim',
     array['https://images.unsplash.com/photo-1542272604-787c3835535d?w=900'],
     array['28','30','32','34','36'], array['Indigo','Black'], 50, true),
    ('Relaxed Taper Jeans', 'relaxed-taper-jeans',
     'Washed stretch denim with a roomy seat that tapers gently to the ankle.',
     118.00, null, 'denim',
     array['https://images.unsplash.com/photo-1475178626620-a4d074967452?w=900'],
     array['28','30','32','34','36'], array['Mid Wash','Washed Black'], 45, false),
    ('Suede Desert Boots', 'suede-desert-boots',
     'Crepe-soled desert boots handcrafted from soft suede uppers.',
     178.00, null, 'footwear',
     array['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=900'],
     array['40','41','42','43','44','45'], array['Sand','Chestnut'], 30, true),
    ('Leather Court Sneakers', 'leather-court-sneakers',
     'Minimal court sneakers in full-grain leather with a cupsole for all-day comfort.',
     148.00, 175.00, 'footwear',
     array['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900'],
     array['40','41','42','43','44','45'], array['White','Black'], 55, true),
    ('Cashmere Scarf', 'cashmere-scarf',
     'Featherweight pure cashmere scarf, woven in a subtle herringbone.',
     89.00, null, 'accessories',
     array['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900'],
     array['One Size'], array['Grey','Camel','Black'], 70, false),
    ('Leather Belt', 'leather-belt',
     'Full-grain vegetable-tanned leather belt with a solid brass buckle.',
     58.00, null, 'accessories',
     array['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900'],
     array['S','M','L'], array['Black','Brown'], 80, false)
) as p(name, slug, description, price, compare_at_price, category_slug, images, sizes, colors, stock, featured)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;
