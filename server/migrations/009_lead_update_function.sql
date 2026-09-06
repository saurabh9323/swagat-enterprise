create or replace function update_lead(p_id uuid, p_payload jsonb)
returns leads
language plpgsql
as $$
declare
  v_lead leads;
begin
  update leads
  set
    property_id = case
      when p_payload ? 'property_id' and exists (select 1 from properties where id = nullif(p_payload->>'property_id', ''))
      then nullif(p_payload->>'property_id', '')
      when p_payload ? 'property_id'
      then null
      else property_id
    end,
    customer_name = coalesce(p_payload->>'customer_name', customer_name),
    phone = case when p_payload ? 'phone' then nullif(p_payload->>'phone', '') else phone end,
    email = case when p_payload ? 'email' then nullif(p_payload->>'email', '') else email end,
    message = case when p_payload ? 'message' then nullif(p_payload->>'message', '') else message end,
    need = case when p_payload ? 'need' then nullif(p_payload->>'need', '') else need end,
    budget = case when p_payload ? 'budget' then nullif(p_payload->>'budget', '') else budget end,
    source = coalesce(p_payload->>'source', source),
    status = coalesce(p_payload->>'status', status),
    priority = coalesce(p_payload->>'priority', priority),
    lead_type = coalesce(p_payload->>'lead_type', lead_type),
    property_type = case when p_payload ? 'property_type' then nullif(p_payload->>'property_type', '') else property_type end,
    preferred_location = case when p_payload ? 'preferred_location' then nullif(p_payload->>'preferred_location', '') else preferred_location end,
    timeline = case when p_payload ? 'timeline' then nullif(p_payload->>'timeline', '') else timeline end
  where id = p_id
  returning * into v_lead;

  return v_lead;
end;
$$;
