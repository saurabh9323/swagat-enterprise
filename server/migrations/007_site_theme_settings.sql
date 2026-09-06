create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_touch_updated_at on site_settings;
create trigger site_settings_touch_updated_at
before update on site_settings
for each row execute function touch_updated_at();

insert into site_settings (setting_key, setting_value, description)
values (
  'theme',
  '{
    "mode": "dark",
    "sidebarColor": "#071512",
    "navbarColor": "#10281f",
    "pageColor": "#111c29",
    "panelColor": "#25323b",
    "accentColor": "#d8ff69",
    "textColor": "#eef4f0"
  }'::jsonb,
  'Website and admin theme colors.'
)
on conflict (setting_key) do nothing;

create or replace function get_site_setting(p_setting_key text)
returns site_settings
language sql
stable
as $$
  select *
  from site_settings
  where setting_key = p_setting_key
  limit 1;
$$;

create or replace function upsert_site_setting(
  p_setting_key text,
  p_setting_value jsonb,
  p_description text default null,
  p_updated_by uuid default null
)
returns site_settings
language sql
as $$
  insert into site_settings (setting_key, setting_value, description, updated_by)
  values (p_setting_key, p_setting_value, p_description, p_updated_by)
  on conflict (setting_key) do update
  set
    setting_value = excluded.setting_value,
    description = coalesce(excluded.description, site_settings.description),
    updated_by = excluded.updated_by
  returning *;
$$;
