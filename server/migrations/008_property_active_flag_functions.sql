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
    latitude, longitude, score, commission, walk_time, legacy_image, is_active, created_by
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
