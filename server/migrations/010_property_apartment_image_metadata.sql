alter table properties add column if not exists apartment_name text;
alter table property_images add column if not exists image_label text;
alter table property_images add column if not exists image_size text;

create index if not exists idx_properties_apartment_name on properties(apartment_name);
create index if not exists idx_property_images_label on property_images(property_id, image_label);

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
    p.updated_at,
    p.apartment_name
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
        'imageLabel', pi.image_label,
        'imageSize', pi.image_size,
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

create or replace function create_property(p_payload jsonb)
returns setof property_rows
language plpgsql
as $$
declare
  v_id text;
begin
  v_id := coalesce(nullif(p_payload->>'id', ''), 'SE-NAL-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));

  insert into properties (
    id, title, description, apartment_name, property_type, listing_type, price, location, area,
    bedrooms, bathrooms, floor, total_floors, furnishing, status, amenities,
    latitude, longitude, score, commission, walk_time, legacy_image, is_active, created_by
  )
  values (
    v_id,
    p_payload->>'title',
    p_payload->>'description',
    p_payload->>'apartment_name',
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
    coalesce(nullif(p_payload->>'is_active', '')::boolean, true),
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
    apartment_name = case when p_payload ? 'apartment_name' then nullif(p_payload->>'apartment_name', '') else apartment_name end,
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
    legacy_image = coalesce(p_payload->>'legacy_image', legacy_image),
    is_active = coalesce(nullif(p_payload->>'is_active', '')::boolean, is_active)
  where id = p_id;

  return query select * from get_property_by_id(p_id);
end;
$$;

create or replace function add_property_image(
  p_property_id text,
  p_storage_path text,
  p_image_url text,
  p_image_label text,
  p_image_size text,
  p_display_order integer,
  p_is_primary boolean
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

  insert into property_images (property_id, storage_path, image_url, image_label, image_size, display_order, is_primary)
  values (p_property_id, p_storage_path, p_image_url, p_image_label, p_image_size, coalesce(p_display_order, 0), coalesce(p_is_primary, false))
  returning * into v_image;

  return v_image;
end;
$$;
