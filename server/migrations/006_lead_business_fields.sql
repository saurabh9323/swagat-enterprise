alter table leads add column if not exists lead_type text not null default 'Buyer';
alter table leads add column if not exists property_type text;
alter table leads add column if not exists preferred_location text;
alter table leads add column if not exists timeline text;

create index if not exists idx_leads_lead_type on leads(lead_type);
create index if not exists idx_leads_preferred_location on leads(preferred_location);

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
