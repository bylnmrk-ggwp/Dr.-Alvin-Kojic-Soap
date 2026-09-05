-- 0002: real catalogue columns, admin role, and server-side order placement.

-- ------------------------------------------------------------ catalogue
alter table public.products
  add column images         text[]  not null default '{}',
  add column is_featured    boolean not null default false,
  add column featured_order integer;

create index products_is_featured_idx on public.products(is_featured) where is_featured;

-- ------------------------------------------------------------ admin role
alter table public.profiles
  add column role text not null default 'customer'
  check (role in ('customer', 'admin'));

-- True when the current user's profile is an admin. Security definer so the
-- check does not depend on the caller being able to read profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public, extensions
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Admins manage the catalogue and read everything that customers submit.
create policy "admins update products"
  on public.products for update
  using (public.is_admin()) with check (public.is_admin());

create policy "admins read all orders"
  on public.orders for select using (public.is_admin());
create policy "admins update orders"
  on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

create policy "admins read all order items"
  on public.order_items for select using (public.is_admin());

create policy "admins read applications"
  on public.distributor_applications for select using (public.is_admin());
create policy "admins update applications"
  on public.distributor_applications for update
  using (public.is_admin()) with check (public.is_admin());

create policy "admins read messages"
  on public.contact_messages for select using (public.is_admin());

create policy "admins read all profiles"
  on public.profiles for select using (public.is_admin());

-- ------------------------------------------------------------ orders
-- Orders are created only through place_order, which verifies every price
-- against the catalogue. The direct insert policies go away.
drop policy if exists "anyone can place an order" on public.orders;
drop policy if exists "insert items for own or guest order" on public.order_items;

create or replace function public.order_to_json(p_order_id uuid)
returns jsonb
language sql
stable
security definer set search_path = public, extensions
as $$
  select jsonb_build_object(
    'id', o.id,
    'reference', o.reference,
    'status', o.status,
    'placed_at', o.placed_at,
    'subtotal_centavos', o.subtotal_centavos,
    'shipping_centavos', o.shipping_centavos,
    'total_centavos', o.total_centavos,
    'payment_method', o.payment_method,
    'ship_to', o.ship_to,
    'user_id', o.user_id,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_id', i.product_id,
        'name', i.name,
        'size_label', i.size_label,
        'unit_price_centavos', i.unit_price_centavos,
        'quantity', i.quantity
      ) order by i.name)
      from public.order_items i where i.order_id = o.id
    ), '[]'::jsonb)
  )
  from public.orders o
  where o.id = p_order_id;
$$;

-- Shipping rule mirrors src/config/site.ts: free at or above ₱1,500, else ₱99.
create or replace function public.shipping_for(p_subtotal_centavos integer)
returns integer
language sql
immutable
as $$
  select case
    when p_subtotal_centavos <= 0 then 0
    when p_subtotal_centavos >= 150000 then 0
    else 9900
  end;
$$;

create or replace function public.place_order(
  p_items          jsonb,
  p_ship_to        jsonb,
  p_payment_method public.payment_method
)
returns jsonb
language plpgsql
security definer set search_path = public, extensions
as $$
declare
  v_item      jsonb;
  v_product   public.products%rowtype;
  v_quantity  integer;
  v_subtotal  integer := 0;
  v_shipping  integer;
  v_order_id  uuid;
  v_reference text;
  v_attempts  integer := 0;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'The order has no items.' using errcode = '22023';
  end if;
  if p_ship_to is null or jsonb_typeof(p_ship_to) <> 'object' then
    raise exception 'A shipping address is required.' using errcode = '22023';
  end if;

  -- Validate every line and total it from catalogue prices, not client prices.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_quantity := coalesce((v_item ->> 'quantity')::integer, 0);
    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'Quantity must be between 1 and 99.' using errcode = '22023';
    end if;

    select * into v_product from public.products where id = (v_item ->> 'product_id')::uuid;
    if not found then
      raise exception 'A product in the cart no longer exists.' using errcode = '22023';
    end if;
    if not v_product.in_stock or v_product.price_centavos <= 0 then
      raise exception '% is not available to order right now.', v_product.name using errcode = '22023';
    end if;

    v_subtotal := v_subtotal + v_product.price_centavos * v_quantity;
  end loop;

  v_shipping := public.shipping_for(v_subtotal);

  -- Reference: DA- plus 8 characters from an unambiguous alphabet, retried on collision.
  loop
    v_attempts := v_attempts + 1;
    v_reference := 'DA-' || upper(
      translate(encode(gen_random_bytes(8), 'base64'), '+/=01OIl', 'ABCDEFGH')
    );
    v_reference := substr(v_reference, 1, 11);
    exit when not exists (select 1 from public.orders where reference = v_reference);
    if v_attempts > 10 then
      raise exception 'Could not generate an order reference.';
    end if;
  end loop;

  insert into public.orders
    (user_id, reference, status, subtotal_centavos, shipping_centavos, total_centavos, payment_method, ship_to)
  values
    (auth.uid(), v_reference, 'pending', v_subtotal, v_shipping, v_subtotal + v_shipping, p_payment_method, p_ship_to)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, name, size_label, unit_price_centavos, quantity)
  select
    v_order_id,
    p.id,
    p.name,
    p.size_label,
    p.price_centavos,
    (line ->> 'quantity')::integer
  from jsonb_array_elements(p_items) as line
  join public.products p on p.id = (line ->> 'product_id')::uuid;

  return public.order_to_json(v_order_id);
end;
$$;

create or replace function public.get_order_by_reference(p_reference text)
returns jsonb
language sql
stable
security definer set search_path = public, extensions
as $$
  select public.order_to_json(o.id)
  from public.orders o
  where o.reference = upper(trim(p_reference));
$$;

revoke all on function public.order_to_json(uuid) from public;
grant execute on function public.place_order(jsonb, jsonb, public.payment_method) to anon, authenticated;
grant execute on function public.get_order_by_reference(text) to anon, authenticated;
