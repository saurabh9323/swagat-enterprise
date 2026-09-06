create table if not exists user_roles (
  code text primary key,
  name text not null,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into user_roles (code, name, description, permissions, is_system)
values
  ('super_admin', 'Super Admin', 'Full platform access across users, properties, leads, settings, sessions, and audit records.', '{"all": "manage", "users": "manage", "properties": "manage", "leads": "manage", "settings": "manage", "sessions": "manage", "audit": "read"}', true),
  ('owner', 'Owner', 'Full business and user-management access.', '{"users": "manage", "properties": "manage", "leads": "manage", "settings": "manage"}', true),
  ('admin', 'Admin', 'Can manage properties, images, and leads.', '{"properties": "manage", "leads": "manage", "users": "read"}', true),
  ('staff', 'Staff', 'Can view assigned leads and help with follow-up.', '{"properties": "read", "leads": "assigned"}', true)
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  permissions = excluded.permissions,
  is_system = excluded.is_system;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'users_role_check'
  ) then
    alter table users drop constraint users_role_check;
  end if;

  alter table users add constraint users_role_check
    check (role in ('super_admin', 'owner', 'admin', 'staff'));
end;
$$;

alter table users add column if not exists username text;
alter table users add column if not exists alternate_phone text;
alter table users add column if not exists job_title text;
alter table users add column if not exists branch text not null default 'Nalasopara East';
alter table users add column if not exists avatar_url text;
alter table users add column if not exists permissions jsonb not null default '{}'::jsonb;
alter table users add column if not exists mfa_enabled boolean not null default false;
alter table users add column if not exists mfa_method text not null default 'none';
alter table users add column if not exists otp_channel text not null default 'email';
alter table users add column if not exists last_login_at timestamptz;
alter table users add column if not exists password_changed_at timestamptz;
alter table users add column if not exists invited_by uuid references users(id) on delete set null;

create unique index if not exists idx_users_username on users(lower(username)) where username is not null;
create index if not exists idx_users_role on users(role);
create index if not exists idx_users_active on users(is_active);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_mfa_method_check'
  ) then
    alter table users add constraint users_mfa_method_check
      check (mfa_method in ('none', 'email_otp', 'sms_otp', 'authenticator'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'users_otp_channel_check'
  ) then
    alter table users add constraint users_otp_channel_check
      check (otp_channel in ('email', 'sms', 'whatsapp'));
  end if;
end;
$$;

create table if not exists user_otps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  purpose text not null default 'login_mfa',
  channel text not null default 'email',
  destination text,
  otp_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  failed_attempts integer not null default 0,
  max_attempts integer not null default 5,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_jti text unique,
  ip_address inet,
  user_agent text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists user_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id) on delete set null,
  target_user_id uuid references users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_otps_user_id on user_otps(user_id);
create index if not exists idx_user_otps_active on user_otps(user_id, purpose, expires_at) where consumed_at is null;
create index if not exists idx_auth_sessions_user_id on auth_sessions(user_id);
create index if not exists idx_auth_sessions_token_jti on auth_sessions(token_jti);
create index if not exists idx_user_audit_logs_actor on user_audit_logs(actor_user_id);
create index if not exists idx_user_audit_logs_target on user_audit_logs(target_user_id);
create index if not exists idx_user_audit_logs_created_at on user_audit_logs(created_at desc);

drop trigger if exists user_roles_touch_updated_at on user_roles;
create trigger user_roles_touch_updated_at
before update on user_roles
for each row execute function touch_updated_at();

create or replace view user_rows as
  select
    u.id,
    u.name,
    u.email,
    u.phone,
    u.username,
    u.alternate_phone,
    u.job_title,
    u.branch,
    u.avatar_url,
    u.role,
    r.name as role_name,
    coalesce(r.permissions, '{}'::jsonb) || coalesce(u.permissions, '{}'::jsonb) as effective_permissions,
    u.mfa_enabled,
    u.mfa_method,
    u.otp_channel,
    u.is_active,
    u.last_login_at,
    u.password_changed_at,
    u.invited_by,
    u.created_at,
    u.updated_at
  from users u
  left join user_roles r on r.code = u.role;

drop function if exists get_user_for_login(text);

create or replace function get_user_for_login(p_email text)
returns table (
  id uuid,
  name text,
  email text,
  phone text,
  password_hash text,
  role text,
  is_active boolean,
  mfa_enabled boolean,
  mfa_method text,
  otp_channel text
)
language sql
stable
as $$
  select
    u.id,
    u.name,
    u.email,
    u.phone,
    u.password_hash,
    u.role,
    u.is_active,
    u.mfa_enabled,
    u.mfa_method,
    u.otp_channel
  from users u
  where lower(u.email) = lower(p_email)
  limit 1;
$$;

create or replace function create_admin_user(p_name text, p_email text, p_phone text, p_password_hash text, p_role text default 'admin')
returns uuid
language sql
as $$
  insert into users (name, email, phone, password_hash, role, password_changed_at)
  values (p_name, lower(p_email), p_phone, p_password_hash, p_role, now())
  returning id;
$$;

create or replace function create_user(p_payload jsonb)
returns setof user_rows
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into users (
    name, email, phone, username, alternate_phone, job_title, branch,
    avatar_url, password_hash, role, permissions, mfa_enabled, mfa_method,
    otp_channel, is_active, invited_by, password_changed_at
  )
  values (
    p_payload->>'name',
    lower(p_payload->>'email'),
    p_payload->>'phone',
    nullif(p_payload->>'username', ''),
    p_payload->>'alternate_phone',
    p_payload->>'job_title',
    coalesce(p_payload->>'branch', 'Nalasopara East'),
    p_payload->>'avatar_url',
    p_payload->>'password_hash',
    coalesce(p_payload->>'role', 'staff'),
    coalesce(p_payload->'permissions', '{}'::jsonb),
    coalesce((p_payload->>'mfa_enabled')::boolean, false),
    coalesce(p_payload->>'mfa_method', 'none'),
    coalesce(p_payload->>'otp_channel', 'email'),
    coalesce((p_payload->>'is_active')::boolean, true),
    nullif(p_payload->>'invited_by', '')::uuid,
    now()
  )
  returning id into v_id;

  return query select * from get_user_by_id(v_id);
end;
$$;

create or replace function get_users(p_role text default null, p_is_active boolean default null, p_q text default null)
returns setof user_rows
language sql
stable
as $$
  select *
  from user_rows u
  where (p_role is null or u.role = p_role)
    and (p_is_active is null or u.is_active = p_is_active)
    and (
      p_q is null or
      concat_ws(' ', u.name, u.email, u.phone, u.username, u.branch, u.job_title) ilike '%' || p_q || '%'
    )
  order by u.created_at desc;
$$;

create or replace function get_user_by_id(p_id uuid)
returns setof user_rows
language sql
stable
as $$
  select * from user_rows where id = p_id limit 1;
$$;

create or replace function update_user(p_id uuid, p_payload jsonb)
returns setof user_rows
language plpgsql
as $$
begin
  update users
  set
    name = coalesce(p_payload->>'name', name),
    phone = coalesce(p_payload->>'phone', phone),
    username = coalesce(nullif(p_payload->>'username', ''), username),
    alternate_phone = coalesce(p_payload->>'alternate_phone', alternate_phone),
    job_title = coalesce(p_payload->>'job_title', job_title),
    branch = coalesce(p_payload->>'branch', branch),
    avatar_url = coalesce(p_payload->>'avatar_url', avatar_url),
    role = coalesce(p_payload->>'role', role),
    permissions = case when p_payload ? 'permissions' then p_payload->'permissions' else permissions end,
    mfa_enabled = coalesce((p_payload->>'mfa_enabled')::boolean, mfa_enabled),
    mfa_method = coalesce(p_payload->>'mfa_method', mfa_method),
    otp_channel = coalesce(p_payload->>'otp_channel', otp_channel),
    is_active = coalesce((p_payload->>'is_active')::boolean, is_active),
    password_hash = coalesce(p_payload->>'password_hash', password_hash),
    password_changed_at = case when p_payload ? 'password_hash' then now() else password_changed_at end
  where id = p_id;

  return query select * from get_user_by_id(p_id);
end;
$$;

create or replace function deactivate_user(p_id uuid)
returns setof user_rows
language plpgsql
as $$
begin
  update users set is_active = false where id = p_id;
  return query select * from get_user_by_id(p_id);
end;
$$;

create or replace function create_user_otp(
  p_user_id uuid,
  p_purpose text,
  p_channel text,
  p_destination text,
  p_otp_hash text,
  p_expires_at timestamptz,
  p_ip_address inet default null,
  p_user_agent text default null
)
returns user_otps
language sql
as $$
  insert into user_otps (user_id, purpose, channel, destination, otp_hash, expires_at, ip_address, user_agent)
  values (p_user_id, p_purpose, p_channel, p_destination, p_otp_hash, p_expires_at, p_ip_address, p_user_agent)
  returning *;
$$;

create or replace function consume_user_otp(p_otp_id uuid)
returns user_otps
language sql
as $$
  update user_otps set consumed_at = now() where id = p_otp_id and consumed_at is null returning *;
$$;

create or replace function increment_user_otp_failure(p_otp_id uuid)
returns user_otps
language sql
as $$
  update user_otps set failed_attempts = failed_attempts + 1 where id = p_otp_id and consumed_at is null returning *;
$$;

create or replace function get_user_otp_challenge(p_otp_id uuid)
returns table (
  id uuid,
  user_id uuid,
  purpose text,
  channel text,
  destination text,
  otp_hash text,
  expires_at timestamptz,
  consumed_at timestamptz,
  failed_attempts integer,
  max_attempts integer
)
language sql
stable
as $$
  select id, user_id, purpose, channel, destination, otp_hash, expires_at, consumed_at, failed_attempts, max_attempts
  from user_otps
  where id = p_otp_id
  limit 1;
$$;

create or replace function record_auth_session(
  p_user_id uuid,
  p_token_jti text,
  p_ip_address inet default null,
  p_user_agent text default null,
  p_expires_at timestamptz default null
)
returns auth_sessions
language sql
as $$
  insert into auth_sessions (user_id, token_jti, ip_address, user_agent, expires_at)
  values (p_user_id, p_token_jti, p_ip_address, p_user_agent, p_expires_at)
  returning *;
$$;

create or replace function record_user_audit(
  p_actor_user_id uuid,
  p_target_user_id uuid,
  p_action text,
  p_metadata jsonb default '{}'::jsonb,
  p_ip_address inet default null,
  p_user_agent text default null
)
returns user_audit_logs
language sql
as $$
  insert into user_audit_logs (actor_user_id, target_user_id, action, metadata, ip_address, user_agent)
  values (p_actor_user_id, p_target_user_id, p_action, p_metadata, p_ip_address, p_user_agent)
  returning *;
$$;
