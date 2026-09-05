-- Dr. Alvin — initial schema
-- Run in the Supabase SQL editor, or with `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums
create type public.regimen_step as enum ('cleanse', 'tone', 'treat', 'protect');
create type public.order_status as enum ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled');
create type public.payment_method as enum ('cod', 'gcash', 'bank-transfer');
create type public.application_status as enum ('received', 'reviewing', 'approved', 'declined');

-- ------------------------------------------------------------ catalogue
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  blurb       text not null default '',
  step        public.regimen_step not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table public.products (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  name                  text not null,
  summary               text not null default '',
  description           text not null default '',
  actives               text[] not null default '{}',
  category_id           uuid not null references public.categories(id) on delete restrict,
  step                  public.regimen_step not null,
  price_centavos        integer not null check (price_centavos >= 0),
  compare_at_centavos   integer check (compare_at_centavos is null or compare_at_centavos > price_centavos),
  size_label            text not null default '',
  how_to_use            text[] not null default '{}',
  skin_concerns         text[] not null default '{}',
  is_fda_registered     boolean not null default true,
  is_best_seller        boolean not null default false,
  in_stock              boolean not null default true,
  rating_average        numeric(2,1) not null default 0 check (rating_average between 0 and 5),
  rating_count          integer not null default 0,
  image_tone            text not null default 'chalk',
  created_at            timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_step_idx on public.products(step);

-- -------------------------------------------------------------- profiles
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text not null default '',
  phone           text,
  is_distributor  boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Mirror new auth users into profiles, carrying the metadata the sign-up form sends.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------- orders
create table public.orders (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete set null,
  reference           text not null unique,
  status              public.order_status not null default 'pending',
  subtotal_centavos   integer not null check (subtotal_centavos >= 0),
  shipping_centavos   integer not null check (shipping_centavos >= 0),
  total_centavos      integer not null check (total_centavos >= 0),
  payment_method      public.payment_method not null,
  ship_to             jsonb not null,
  placed_at           timestamptz not null default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_reference_idx on public.orders(reference);

create table public.order_items (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid not null references public.orders(id) on delete cascade,
  product_id            uuid references public.products(id) on delete set null,
  name                  text not null,
  size_label            text not null default '',
  unit_price_centavos   integer not null check (unit_price_centavos >= 0),
  quantity              integer not null check (quantity > 0)
);

create index order_items_order_id_idx on public.order_items(order_id);

-- ------------------------------------------------------------- inboxes
create table public.distributor_applications (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete set null,
  full_name           text not null,
  email               text not null,
  phone               text not null,
  address             text not null,
  city                text not null,
  province            text not null,
  selling_experience  text not null,
  message             text not null default '',
  status              public.application_status not null default 'received',
  submitted_at        timestamptz not null default now()
);

create table public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  topic         text not null,
  message       text not null,
  submitted_at  timestamptz not null default now()
);

-- ------------------------------------------------------ row level security
alter table public.categories               enable row level security;
alter table public.products                 enable row level security;
alter table public.profiles                 enable row level security;
alter table public.orders                   enable row level security;
alter table public.order_items              enable row level security;
alter table public.distributor_applications enable row level security;
alter table public.contact_messages         enable row level security;

-- The catalogue is public.
create policy "categories are readable by everyone"
  on public.categories for select using (true);
create policy "products are readable by everyone"
  on public.products for select using (true);

-- Profiles: you can see and edit only your own.
create policy "read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Orders: guests may place them; signed-in users see their own.
create policy "anyone can place an order"
  on public.orders for insert
  with check (user_id is null or user_id = auth.uid());
create policy "read own orders"
  on public.orders for select using (user_id = auth.uid());

create policy "insert items for own or guest order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is null or o.user_id = auth.uid())
    )
  );
create policy "read items of own orders"
  on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Inboxes: anyone may submit; only service role reads (via the dashboard).
create policy "anyone can apply to distribute"
  on public.distributor_applications for insert with check (true);
create policy "anyone can send a message"
  on public.contact_messages for insert with check (true);
