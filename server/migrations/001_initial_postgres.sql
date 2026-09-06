create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  password_hash text not null,
  role text not null default 'admin' check (role in ('super_admin', 'owner', 'admin', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists properties (
  id text primary key,
  title text not null,
  description text,
  property_type text not null,
  listing_type text not null check (listing_type in ('Sale', 'Rent')),
  price numeric(14, 2) not null check (price >= 0),
  location text not null,
  area numeric(10, 2),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  floor text,
  total_floors integer check (total_floors is null or total_floors >= 0),
  furnishing text,
  status text not null default 'Fresh',
  amenities text[] not null default '{}',
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  score integer check (score is null or score between 0 and 100),
  commission numeric(14, 2),
  walk_time text,
  legacy_image text,
  is_active boolean not null default true,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id text not null references properties(id) on delete cascade,
  storage_path text not null,
  image_url text not null,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  property_id text references properties(id) on delete set null,
  customer_name text not null,
  phone text,
  email text,
  message text,
  need text,
  budget text,
  source text not null default 'Website',
  status text not null default 'New',
  priority text not null default 'Warm',
  lead_type text not null default 'Buyer',
  property_type text,
  preferred_location text,
  timeline text,
  assigned_to uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table leads add column if not exists priority text not null default 'Warm';
alter table leads add column if not exists lead_type text not null default 'Buyer';
alter table leads add column if not exists property_type text;
alter table leads add column if not exists preferred_location text;
alter table leads add column if not exists timeline text;

create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_property_type on properties(property_type);
create index if not exists idx_properties_listing_type on properties(listing_type);
create index if not exists idx_properties_location on properties(location);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_bedrooms on properties(bedrooms);
create index if not exists idx_properties_created_at on properties(created_at desc);
create index if not exists idx_property_images_property_id on property_images(property_id);
create index if not exists idx_property_images_order on property_images(property_id, display_order);
create unique index if not exists idx_property_images_one_primary on property_images(property_id) where is_primary = true;
create index if not exists idx_leads_property_id on leads(property_id);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_priority on leads(priority);
create index if not exists idx_leads_lead_type on leads(lead_type);
create index if not exists idx_leads_preferred_location on leads(preferred_location);
create index if not exists idx_leads_created_at on leads(created_at desc);

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_touch_updated_at on users;
create trigger users_touch_updated_at
before update on users
for each row execute function touch_updated_at();

drop trigger if exists properties_touch_updated_at on properties;
create trigger properties_touch_updated_at
before update on properties
for each row execute function touch_updated_at();

drop trigger if exists property_images_touch_updated_at on property_images;
create trigger property_images_touch_updated_at
before update on property_images
for each row execute function touch_updated_at();

drop trigger if exists leads_touch_updated_at on leads;
create trigger leads_touch_updated_at
before update on leads
for each row execute function touch_updated_at();

create or replace view property_rows as
  select
    p.id,
    p.title,
    p.description,
    p.property_type,
    p.listing_type,
    p.price,
    p.location,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.floor,
    p.total_floors,
    p.furnishing,
    p.status,
    p.amenities,
    p.latitude,
    p.longitude,
    p.score,
    p.commission,
    p.walk_time,
    coalesce(primary_image.image_url, first_image.image_url, p.legacy_image) as image_url,
    coalesce(primary_image.image_url, first_image.image_url, p.legacy_image) as image,
    coalesce(image_list.images, '[]'::jsonb) as images,
    p.is_active,
    p.created_by,
    p.created_at,
    p.updated_at
  from properties p
  left join lateral (
    select pi.image_url
    from property_images pi
    where pi.property_id = p.id and pi.is_primary = true
    order by pi.display_order asc, pi.created_at asc
    limit 1
  ) primary_image on true
  left join lateral (
    select pi.image_url
    from property_images pi
    where pi.property_id = p.id
    order by pi.display_order asc, pi.created_at asc
    limit 1
  ) first_image on true
  left join lateral (
    select jsonb_agg(
      jsonb_build_object(
        'id', pi.id,
        'imageUrl', pi.image_url,
        'storagePath', pi.storage_path,
        'displayOrder', pi.display_order,
        'isPrimary', pi.is_primary,
        'createdAt', pi.created_at,
        'updatedAt', pi.updated_at
      )
      order by pi.display_order asc, pi.created_at asc
    ) as images
    from property_images pi
    where pi.property_id = p.id
  ) image_list on true;

drop function if exists get_user_for_login(text);

create or replace function get_user_for_login(p_email text)
returns table (
  id uuid,
  name text,
  email text,
  phone text,
  password_hash text,
  role text,
  is_active boolean
)
language sql
stable
as $$
  select u.id, u.name, u.email, u.phone, u.password_hash, u.role, u.is_active
  from users u
  where lower(u.email) = lower(p_email)
  limit 1;
$$;

create or replace function create_admin_user(p_name text, p_email text, p_phone text, p_password_hash text, p_role text default 'admin')
returns uuid
language sql
as $$
  insert into users (name, email, phone, password_hash, role)
  values (p_name, lower(p_email), p_phone, p_password_hash, p_role)
  returning id;
$$;

create or replace function get_properties(
  p_q text default null,
  p_status text default null,
  p_property_type text default null,
  p_listing_type text default null,
  p_location text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_bedrooms integer default null
)
returns setof property_rows
language sql
stable
as $$
  select *
  from property_rows p
  where p.is_active = true
    and (p_q is null or concat_ws(' ', p.title, p.location, p.property_type, p.listing_type, p.status) ilike '%' || p_q || '%')
    and (p_status is null or p.status = p_status)
    and (p_property_type is null or p.property_type = p_property_type)
    and (p_listing_type is null or p.listing_type = p_listing_type)
    and (p_location is null or p.location ilike '%' || p_location || '%')
    and (p_min_price is null or p.price >= p_min_price)
    and (p_max_price is null or p.price <= p_max_price)
    and (p_bedrooms is null or p.bedrooms = p_bedrooms)
  order by p.created_at desc;
$$;

create or replace function get_property_by_id(p_id text)
returns setof property_rows
language sql
stable
as $$
  select *
  from property_rows p
  where p.id = p_id and p.is_active = true
  limit 1;
$$;

create or replace function create_property(p_payload jsonb)
returns setof property_rows
language plpgsql
as $$
declare
  v_id text;
begin
  v_id := coalesce(nullif(p_payload->>'id', ''), 'SE-NAL-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));

  insert into properties (
    id, title, description, property_type, listing_type, price, location, area,
    bedrooms, bathrooms, floor, total_floors, furnishing, status, amenities,
    latitude, longitude, score, commission, walk_time, legacy_image, created_by
  )
  values (
    v_id,
    p_payload->>'title',
    p_payload->>'description',
    p_payload->>'property_type',
    p_payload->>'listing_type',
    (p_payload->>'price')::numeric,
    p_payload->>'location',
    nullif(p_payload->>'area', '')::numeric,
    nullif(p_payload->>'bedrooms', '')::integer,
    nullif(p_payload->>'bathrooms', '')::integer,
    p_payload->>'floor',
    nullif(p_payload->>'total_floors', '')::integer,
    p_payload->>'furnishing',
    coalesce(p_payload->>'status', 'Fresh'),
    coalesce(array(select jsonb_array_elements_text(p_payload->'amenities')), '{}'),
    nullif(p_payload->>'latitude', '')::numeric,
    nullif(p_payload->>'longitude', '')::numeric,
    nullif(p_payload->>'score', '')::integer,
    nullif(p_payload->>'commission', '')::numeric,
    p_payload->>'walk_time',
    p_payload->>'legacy_image',
    nullif(p_payload->>'created_by', '')::uuid
  );

  return query select * from get_property_by_id(v_id);
end;
$$;

create or replace function update_property(p_id text, p_payload jsonb)
returns setof property_rows
language plpgsql
as $$
begin
  update properties
  set
    title = coalesce(p_payload->>'title', title),
    description = coalesce(p_payload->>'description', description),
    property_type = coalesce(p_payload->>'property_type', property_type),
    listing_type = coalesce(p_payload->>'listing_type', listing_type),
    price = coalesce(nullif(p_payload->>'price', '')::numeric, price),
    location = coalesce(p_payload->>'location', location),
    area = coalesce(nullif(p_payload->>'area', '')::numeric, area),
    bedrooms = coalesce(nullif(p_payload->>'bedrooms', '')::integer, bedrooms),
    bathrooms = coalesce(nullif(p_payload->>'bathrooms', '')::integer, bathrooms),
    floor = coalesce(p_payload->>'floor', floor),
    total_floors = coalesce(nullif(p_payload->>'total_floors', '')::integer, total_floors),
    furnishing = coalesce(p_payload->>'furnishing', furnishing),
    status = coalesce(p_payload->>'status', status),
    amenities = case when p_payload ? 'amenities' then array(select jsonb_array_elements_text(p_payload->'amenities')) else amenities end,
    latitude = coalesce(nullif(p_payload->>'latitude', '')::numeric, latitude),
    longitude = coalesce(nullif(p_payload->>'longitude', '')::numeric, longitude),
    score = coalesce(nullif(p_payload->>'score', '')::integer, score),
    commission = coalesce(nullif(p_payload->>'commission', '')::numeric, commission),
    walk_time = coalesce(p_payload->>'walk_time', walk_time),
    legacy_image = coalesce(p_payload->>'legacy_image', legacy_image)
  where id = p_id and is_active = true;

  return query select * from get_property_by_id(p_id);
end;
$$;

create or replace function update_property_status(p_id text, p_status text)
returns setof property_rows
language plpgsql
as $$
begin
  update properties set status = p_status where id = p_id and is_active = true;
  return query select * from get_property_by_id(p_id);
end;
$$;

create or replace function deactivate_property(p_id text)
returns setof property_rows
language plpgsql
as $$
begin
  update properties set is_active = false, status = 'Inactive' where id = p_id and is_active = true;
  return query select * from property_rows p where p.id = p_id limit 1;
end;
$$;

create or replace function add_property_image(
  p_property_id text,
  p_storage_path text,
  p_image_url text,
  p_display_order integer default 0,
  p_is_primary boolean default false
)
returns property_images
language plpgsql
as $$
declare
  v_image property_images;
begin
  if p_is_primary then
    update property_images set is_primary = false where property_id = p_property_id;
  end if;

  insert into property_images (property_id, storage_path, image_url, display_order, is_primary)
  values (p_property_id, p_storage_path, p_image_url, p_display_order, p_is_primary)
  returning * into v_image;

  return v_image;
end;
$$;

create or replace function get_property_images(p_property_id text)
returns setof property_images
language sql
stable
as $$
  select *
  from property_images
  where property_id = p_property_id
  order by display_order asc, created_at asc;
$$;

create or replace function update_property_image_order(p_property_id text, p_images jsonb)
returns setof property_images
language plpgsql
as $$
begin
  update property_images pi
  set display_order = (item->>'displayOrder')::integer
  from jsonb_array_elements(p_images) item
  where pi.property_id = p_property_id and pi.id = (item->>'id')::uuid;

  return query select * from get_property_images(p_property_id);
end;
$$;

create or replace function set_primary_property_image(p_property_id text, p_image_id uuid)
returns property_images
language plpgsql
as $$
declare
  v_image property_images;
begin
  update property_images set is_primary = false where property_id = p_property_id;
  update property_images
  set is_primary = true
  where property_id = p_property_id and id = p_image_id
  returning * into v_image;
  return v_image;
end;
$$;

create or replace function delete_property_image(p_property_id text, p_image_id uuid)
returns property_images
language plpgsql
as $$
declare
  v_image property_images;
begin
  delete from property_images
  where property_id = p_property_id and id = p_image_id
  returning * into v_image;
  return v_image;
end;
$$;

create or replace function create_lead(p_payload jsonb)
returns leads
language sql
as $$
  insert into leads (
    property_id, customer_name, phone, email, message, need, budget, source,
    status, priority, lead_type, property_type, preferred_location, timeline
  )
  values (
    case
      when exists (select 1 from properties where id = nullif(p_payload->>'property_id', ''))
      then nullif(p_payload->>'property_id', '')
      else null
    end,
    p_payload->>'customer_name',
    p_payload->>'phone',
    p_payload->>'email',
    p_payload->>'message',
    p_payload->>'need',
    p_payload->>'budget',
    coalesce(p_payload->>'source', 'Website'),
    coalesce(p_payload->>'status', 'New'),
    coalesce(p_payload->>'priority', 'Warm'),
    coalesce(p_payload->>'lead_type', 'Buyer'),
    p_payload->>'property_type',
    p_payload->>'preferred_location',
    p_payload->>'timeline'
  )
  returning *;
$$;

create or replace function get_leads()
returns setof leads
language sql
stable
as $$
  select * from leads where status <> 'Archived' order by created_at desc;
$$;

create or replace function get_lead_by_id(p_id uuid)
returns setof leads
language sql
stable
as $$
  select * from leads where id = p_id limit 1;
$$;

create or replace function update_lead_status(p_id uuid, p_status text)
returns leads
language sql
as $$
  update leads set status = p_status where id = p_id returning *;
$$;

create or replace function assign_lead(p_id uuid, p_assigned_to uuid)
returns leads
language sql
as $$
  update leads set assigned_to = p_assigned_to where id = p_id returning *;
$$;

create or replace function archive_lead(p_id uuid)
returns leads
language sql
as $$
  update leads set status = 'Archived' where id = p_id returning *;
$$;
