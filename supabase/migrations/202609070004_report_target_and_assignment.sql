alter table public.reports
  add column if not exists target_url text,
  add column if not exists assigned_to uuid references auth.users(id) on delete set null;

alter table public.reports
  add constraint reports_target_url_length check (target_url is null or char_length(target_url) <= 2048);

create index if not exists reports_assigned_to_idx on public.reports(assigned_to);

-- Reports created from the public report form must have a target URL.
-- Existing rows are left valid for migration compatibility; the application validates all new submissions.
