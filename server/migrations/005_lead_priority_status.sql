alter table leads add column if not exists priority text not null default 'Warm';

create index if not exists idx_leads_priority on leads(priority);
