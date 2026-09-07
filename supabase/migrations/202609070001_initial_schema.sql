-- Linqo initial production schema — PostgreSQL / Supabase
-- Apply with Supabase CLI after reviewing against the target project.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','moderator','administrator','super_administrator')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create table if not exists public.profile_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name_en text not null,
  name_am text,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.profile_categories(slug,name_en,name_am,position) values
 ('creator','Creator','ፈጣሪ',1),('business','Business','ንግድ',2),('freelancer','Freelancer','ፍሪላንሰር',3),('artist','Artist','አርቲስት',4),('musician','Musician','ሙዚቀኛ',5),('professional','Professional','ባለሙያ',6),('student','Student','ተማሪ',7),('organization','Organization','ድርጅት',8),('other','Other','ሌላ',9)
on conflict(slug) do nothing;

create table if not exists public.themes (
  id text primary key,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.themes(id,name,config) values
 ('minimal','Minimal','{}'),('glass','Glass','{}'),('creator','Creator','{}'),('professional','Professional','{}'),('business','Business','{}'),('dark','Dark','{}'),('elegant','Elegant','{}')
on conflict (id) do nothing;

create table if not exists public.usernames (
  username text primary key check (username = lower(username) and username ~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$' and char_length(username) between 3 and 30 and username not in ('admin','api','app','auth','dashboard','explore','features','help','login','logout','pricing','privacy','report','settings','signup','support','terms','www','linqo')),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$' and char_length(username) between 3 and 30 and username not in ('admin','api','app','auth','dashboard','explore','features','help','login','logout','pricing','privacy','report','settings','signup','support','terms','www','linqo')),
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text check (bio is null or char_length(bio) <= 240),
  avatar_url text,
  category text check (category is null or char_length(category) <= 60),
  locale text not null default 'en' check (locale in ('en','am')),
  is_public boolean not null default true,
  is_verified boolean not null default false,
  analytics_enabled boolean not null default true,
  theme_id text references public.themes(id) on delete set null,
  appearance jsonb not null default '{}'::jsonb,
  notification_preferences jsonb not null default '{"sales":true,"account":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists profiles_public_username_idx on public.profiles(username) where deleted_at is null and is_public=true;
create index if not exists profiles_user_idx on public.profiles(user_id) where deleted_at is null;

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('standard','social','whatsapp','telegram','phone','email','location','payment','product','heading','divider','image','video','embed')),
  title text not null check (char_length(title) between 1 and 120),
  url text check (url is null or char_length(url) <= 2048),
  thumbnail_url text,
  icon text,
  position integer not null default 0 check (position >= 0),
  is_enabled boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (starts_at is null or ends_at is null or starts_at < ends_at),
  check (
    (type in ('heading','divider') and url is null)
    or (type='email' and url ~* '^(mailto:|https?://)')
    or (type='phone' and url ~* '^(tel:|https?://)')
    or (type not in ('heading','divider','email','phone') and url ~* '^https?://')
  )
);
create index if not exists links_profile_position_idx on public.links(profile_id,position) where deleted_at is null;
create index if not exists links_public_idx on public.links(profile_id,is_enabled) where deleted_at is null;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 120),
  description text check (description is null or char_length(description) <= 2000),
  price numeric(14,2) not null check (price >= 0),
  currency text not null default 'ETB' check (currency in ('ETB','USD')),
  kind text not null check (kind in ('digital_file','service','course','template','ebook','image')),
  cover_url text,
  file_path text,
  file_mime text,
  file_size bigint check (file_size is null or file_size >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists products_profile_active_idx on public.products(profile_id,is_active) where deleted_at is null;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  product_id uuid references public.products(id) on delete restrict,
  tx_ref text not null unique,
  provider text not null,
  provider_reference text,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null check (currency in ('ETB','USD')),
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','cancelled')),
  customer_email text,
  checkout_url text,
  access_token_hash text not null,
  failure_code text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists transactions_profile_created_idx on public.transactions(profile_id,created_at desc);
create index if not exists transactions_status_idx on public.transactions(status,created_at desc);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_key text not null,
  tx_ref text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique(provider,event_key)
);
create index if not exists payment_events_tx_ref_idx on public.payment_events(tx_ref);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null unique references public.transactions(id) on delete restrict,
  tx_ref text not null unique,
  seller_profile_id uuid not null references public.profiles(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  buyer_user_id uuid references auth.users(id) on delete set null,
  buyer_email text,
  amount numeric(14,2) not null,
  currency text not null,
  status text not null default 'paid' check (status in ('paid','refunded')),
  access_token_hash text not null,
  purchased_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists purchases_seller_created_idx on public.purchases(seller_profile_id,purchased_at desc);
create index if not exists purchases_buyer_idx on public.purchases(buyer_user_id) where buyer_user_id is not null;

create table if not exists public.purchase_downloads (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete restrict,
  created_at timestamptz not null default now()
);
create index if not exists purchase_downloads_purchase_idx on public.purchase_downloads(purchase_id,created_at desc);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  plan text not null default 'free' check (plan in ('free','pro','business')),
  provider text,
  provider_subscription_id text,
  status text not null default 'active' check (status in ('active','trialing','past_due','cancelled','expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists subscriptions_active_profile_idx on public.subscriptions(profile_id) where status in ('active','trialing','past_due');

create table if not exists public.billing_orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  tx_ref text not null unique,
  provider text not null,
  plan text not null check (plan in ('pro','business')),
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'ETB' check (currency in ('ETB','USD')),
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','cancelled')),
  provider_reference text,
  checkout_url text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists billing_orders_profile_created_idx on public.billing_orders(profile_id,created_at desc);
create index if not exists billing_orders_status_idx on public.billing_orders(status,created_at desc);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null check (event_type in ('profile_view','link_click','product_purchase')),
  link_id uuid references public.links(id) on delete set null,
  referrer_domain text,
  device_type text check (device_type is null or device_type in ('mobile','tablet','desktop')),
  browser_family text,
  country_code text check (country_code is null or char_length(country_code)=2),
  occurred_at timestamptz not null default now()
);
create index if not exists analytics_events_profile_time_idx on public.analytics_events(profile_id,occurred_at desc);
create index if not exists analytics_events_link_time_idx on public.analytics_events(link_id,occurred_at desc) where link_id is not null;

create table if not exists public.analytics_daily (
  profile_id uuid not null references public.profiles(id) on delete restrict,
  day date not null,
  profile_views bigint not null default 0,
  link_clicks bigint not null default 0,
  product_purchases bigint not null default 0,
  revenue numeric(14,2) not null default 0,
  primary key(profile_id,day)
);

create table if not exists public.link_daily_stats (
  profile_id uuid not null references public.profiles(id) on delete restrict,
  link_id uuid not null references public.links(id) on delete cascade,
  day date not null,
  clicks bigint not null default 0,
  primary key(profile_id,link_id,day)
);
create index if not exists link_daily_stats_profile_day_idx on public.link_daily_stats(profile_id,day desc);

create table if not exists public.referrer_daily_stats (
  profile_id uuid not null references public.profiles(id) on delete restrict,
  day date not null,
  referrer_domain text not null,
  events bigint not null default 0,
  primary key(profile_id,day,referrer_domain)
);

create table if not exists public.device_daily_stats (
  profile_id uuid not null references public.profiles(id) on delete restrict,
  day date not null,
  device_type text not null,
  events bigint not null default 0,
  primary key(profile_id,day,device_type)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references auth.users(id) on delete set null,
  target_url text not null check (char_length(target_url) <= 2048),
  reason text not null check (reason in ('spam','impersonation','harassment','illegal','other')),
  details text check (details is null or char_length(details) <= 2000),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reports_status_created_idx on public.reports(status,created_at desc);


create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  note text not null check (char_length(note) between 20 and 1500),
  status text not null default 'open' check (status in ('open','reviewing','approved','rejected')),
  reviewer_user_id uuid references auth.users(id) on delete set null,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists verification_open_profile_idx on public.verification_requests(profile_id) where status in ('open','reviewing');
create index if not exists verification_status_created_idx on public.verification_requests(status,created_at desc);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','analyst')),
  created_at timestamptz not null default now(),
  unique(profile_id,user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_created_idx on public.notifications(user_id,created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','reviewed','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  previous_username text,
  requested_at timestamptz not null default now(),
  purge_after timestamptz not null default now()+interval '30 days',
  status text not null default 'requested' check (status in ('requested','cancelled','purged'))
);
create unique index if not exists account_deletion_pending_idx on public.account_deletion_requests(user_id) where status='requested';

create table if not exists public.rate_limits (
  rate_key text not null,
  bucket text not null,
  window_start timestamptz not null,
  request_count integer not null,
  primary key(rate_key,bucket)
);

-- Updated-at trigger utility.
create or replace function private.set_updated_at() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); return new; end; $$;
revoke all on function private.set_updated_at() from public;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger links_set_updated_at before update on public.links for each row execute function private.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function private.set_updated_at();
create trigger transactions_set_updated_at before update on public.transactions for each row execute function private.set_updated_at();
create trigger purchases_set_updated_at before update on public.purchases for each row execute function private.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function private.set_updated_at();
create trigger billing_orders_set_updated_at before update on public.billing_orders for each row execute function private.set_updated_at();
create trigger reports_set_updated_at before update on public.reports for each row execute function private.set_updated_at();
create trigger user_roles_set_updated_at before update on public.user_roles for each row execute function private.set_updated_at();

-- New users receive only the baseline user role. Never derive roles from user-editable metadata.
create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.user_roles(user_id,role) values(new.id,'user') on conflict(user_id) do nothing;
  return new;
end; $$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

-- Role helper lives outside the exposed schema. It is deliberately narrow and read-only.
create or replace function private.has_role(required_roles text[]) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.user_roles where user_id=(select auth.uid()) and role=any(required_roles));
$$;
revoke all on function private.has_role(text[]) from public;
grant execute on function private.has_role(text[]) to authenticated;

create or replace function private.profile_has_commerce(p_profile_id uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(
    select 1 from public.subscriptions s
    where s.profile_id=p_profile_id and s.plan in ('pro','business') and s.status in ('active','trialing','past_due')
      and (s.current_period_end is null or s.current_period_end>now())
  );
$$;
revoke all on function private.profile_has_commerce(uuid) from public;
grant execute on function private.profile_has_commerce(uuid) to anon,authenticated;

-- Atomic onboarding, executed with the authenticated caller's RLS permissions.
create or replace function public.complete_onboarding(p_username text,p_display_name text,p_bio text,p_category text,p_theme text,p_links jsonb)
returns uuid language plpgsql security definer set search_path='' as $$
declare uid uuid := (select auth.uid()); pid uuid; item jsonb; pos integer:=0; uname text:=lower(trim(p_username));
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if exists(select 1 from public.profiles where user_id=uid and deleted_at is null) then raise exception 'profile already exists'; end if;
  if uname !~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$' or char_length(uname) not between 3 and 30 or uname in ('admin','api','app','auth','dashboard','explore','features','help','login','logout','pricing','privacy','report','settings','signup','support','terms','www','linqo') then raise exception 'invalid username'; end if;
  if char_length(trim(p_display_name)) not between 1 and 80 then raise exception 'invalid display name'; end if;
  if p_bio is not null and char_length(p_bio)>240 then raise exception 'bio too long'; end if;
  if not exists(select 1 from public.profile_categories where name_en=p_category and is_active=true) then raise exception 'invalid category'; end if;
  if not exists(select 1 from public.themes where id=p_theme and is_active=true) then raise exception 'invalid theme'; end if;
  if jsonb_array_length(coalesce(p_links,'[]'::jsonb))>8 then raise exception 'free plan link limit exceeded'; end if;
  insert into public.usernames(username,user_id) values(uname,uid);
  insert into public.profiles(user_id,username,display_name,bio,category,theme_id)
  values(uid,uname,trim(p_display_name),nullif(trim(p_bio),''),p_category,p_theme) returning id into pid;
  insert into public.subscriptions(profile_id,plan,status) values(pid,'free','active');
  for item in select * from jsonb_array_elements(coalesce(p_links,'[]'::jsonb)) loop
    if (item->>'type') not in ('standard','social','whatsapp','telegram') then raise exception 'invalid onboarding link type'; end if;
    if coalesce(item->>'url','') !~* '^https?://' then raise exception 'invalid onboarding link URL'; end if;
    insert into public.links(profile_id,type,title,url,position,is_enabled)
    values(pid,item->>'type',left(item->>'title',120),item->>'url',pos,true); pos:=pos+1;
  end loop;
  return pid;
end; $$;
revoke all on function public.complete_onboarding(text,text,text,text,text,jsonb) from public,anon;
grant execute on function public.complete_onboarding(text,text,text,text,text,jsonb) to authenticated;

create or replace function public.reorder_profile_links(p_ids uuid[]) returns void language plpgsql security invoker set search_path='' as $$
declare expected integer; owned integer;
begin
  expected:=coalesce(array_length(p_ids,1),0);
  select count(*) into owned from public.links l join public.profiles p on p.id=l.profile_id
  where l.id=any(p_ids) and p.user_id=(select auth.uid()) and l.deleted_at is null;
  if expected=0 or owned<>expected then raise exception 'invalid link set'; end if;
  update public.links l set position=x.ord-1
  from unnest(p_ids) with ordinality as x(id,ord)
  where l.id=x.id;
end; $$;
revoke all on function public.reorder_profile_links(uuid[]) from public,anon;
grant execute on function public.reorder_profile_links(uuid[]) to authenticated;

create or replace function public.change_username(p_username text) returns text language plpgsql security definer set search_path='' as $$
declare uid uuid:=(select auth.uid()); old_name text; uname text:=lower(trim(p_username));
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if uname !~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$' or char_length(uname) not between 3 and 30 or uname in ('admin','api','app','auth','dashboard','explore','features','help','login','logout','pricing','privacy','report','settings','signup','support','terms','www','linqo') then raise exception 'invalid username'; end if;
  select username into old_name from public.profiles where user_id=uid and deleted_at is null for update;
  if old_name is null then raise exception 'profile missing'; end if;
  if old_name=uname then return uname; end if;
  insert into public.usernames(username,user_id) values(uname,uid);
  update public.profiles set username=uname,updated_at=now() where user_id=uid and deleted_at is null;
  delete from public.usernames where username=old_name and user_id=uid;
  return uname;
end; $$;
revoke all on function public.change_username(text) from public,anon;
grant execute on function public.change_username(text) to authenticated;

-- Service-role-only analytics aggregation.
create or replace function public.record_analytics_event(p_profile_id uuid,p_event_type text,p_link_id uuid,p_referrer text,p_device text,p_browser text,p_country text)
returns void language plpgsql security invoker set search_path='' as $$
declare d date:=current_date; enabled boolean;
begin
  select analytics_enabled and is_public and deleted_at is null into enabled from public.profiles where id=p_profile_id;
  if coalesce(enabled,false)=false then return; end if;
  insert into public.analytics_events(profile_id,event_type,link_id,referrer_domain,device_type,browser_family,country_code)
  values(p_profile_id,p_event_type,p_link_id,left(p_referrer,180),p_device,left(p_browser,80),left(p_country,2));
  insert into public.analytics_daily(profile_id,day,profile_views,link_clicks,product_purchases)
  values(p_profile_id,d,(p_event_type='profile_view')::int,(p_event_type='link_click')::int,(p_event_type='product_purchase')::int)
  on conflict(profile_id,day) do update set
    profile_views=public.analytics_daily.profile_views+excluded.profile_views,
    link_clicks=public.analytics_daily.link_clicks+excluded.link_clicks,
    product_purchases=public.analytics_daily.product_purchases+excluded.product_purchases;
  if p_link_id is not null and p_event_type='link_click' then
    insert into public.link_daily_stats(profile_id,link_id,day,clicks) values(p_profile_id,p_link_id,d,1)
    on conflict(profile_id,link_id,day) do update set clicks=public.link_daily_stats.clicks+1;
  end if;
  if p_referrer is not null then
    insert into public.referrer_daily_stats(profile_id,day,referrer_domain,events) values(p_profile_id,d,left(p_referrer,180),1)
    on conflict(profile_id,day,referrer_domain) do update set events=public.referrer_daily_stats.events+1;
  end if;
  if p_device is not null then
    insert into public.device_daily_stats(profile_id,day,device_type,events) values(p_profile_id,d,p_device,1)
    on conflict(profile_id,day,device_type) do update set events=public.device_daily_stats.events+1;
  end if;
end; $$;
revoke all on function public.record_analytics_event(uuid,text,uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.record_analytics_event(uuid,text,uuid,text,text,text,text) to service_role;

create or replace function public.consume_rate_limit(p_key text,p_bucket text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security invoker set search_path='' as $$
declare c integer;
begin
  insert into public.rate_limits(rate_key,bucket,window_start,request_count) values(p_key,p_bucket,now(),1)
  on conflict(rate_key,bucket) do update set
    window_start=case when public.rate_limits.window_start < now()-make_interval(secs=>p_window_seconds) then now() else public.rate_limits.window_start end,
    request_count=case when public.rate_limits.window_start < now()-make_interval(secs=>p_window_seconds) then 1 else public.rate_limits.request_count+1 end
  returning request_count into c;
  return c<=p_limit;
end; $$;
revoke all on function public.consume_rate_limit(text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,text,integer,integer) to service_role;

create or replace function public.finalize_paid_transaction(p_transaction_id uuid,p_provider_reference text)
returns void language plpgsql security invoker set search_path='' as $$
declare t public.transactions%rowtype;
begin
  select * into t from public.transactions where id=p_transaction_id for update;
  if t.id is null then raise exception 'transaction missing'; end if;
  if t.status='paid' then return; end if;
  update public.transactions set status='paid',provider_reference=coalesce(p_provider_reference,provider_reference),verified_at=now() where id=t.id;
  insert into public.purchases(transaction_id,tx_ref,seller_profile_id,product_id,buyer_email,amount,currency,status,access_token_hash)
  values(t.id,t.tx_ref,t.profile_id,t.product_id,t.customer_email,t.amount,t.currency,'paid',t.access_token_hash)
  on conflict(transaction_id) do nothing;
  insert into public.analytics_daily(profile_id,day,product_purchases,revenue) values(t.profile_id,current_date,1,t.amount)
  on conflict(profile_id,day) do update set product_purchases=public.analytics_daily.product_purchases+1,revenue=public.analytics_daily.revenue+excluded.revenue;
end; $$;
revoke all on function public.finalize_paid_transaction(uuid,text) from public,anon,authenticated;
grant execute on function public.finalize_paid_transaction(uuid,text) to service_role;

create or replace function public.finalize_subscription_billing(p_billing_order_id uuid,p_provider_reference text)
returns void language plpgsql security invoker set search_path='' as $$
declare b public.billing_orders%rowtype;
begin
  select * into b from public.billing_orders where id=p_billing_order_id for update;
  if b.id is null then raise exception 'billing order missing'; end if;
  if b.status='paid' then return; end if;
  update public.billing_orders set status='paid',provider_reference=coalesce(p_provider_reference,provider_reference),verified_at=now() where id=b.id;
  update public.subscriptions set status='expired',current_period_end=least(coalesce(current_period_end,now()),now()),updated_at=now()
    where profile_id=b.profile_id and status in ('active','trialing','past_due');
  insert into public.subscriptions(profile_id,plan,provider,provider_subscription_id,status,current_period_start,current_period_end)
  values(b.profile_id,b.plan,b.provider,b.provider_reference,'active',now(),now()+interval '30 days');
end; $$;
revoke all on function public.finalize_subscription_billing(uuid,text) from public,anon,authenticated;
grant execute on function public.finalize_subscription_billing(uuid,text) to service_role;

create or replace function public.request_account_deletion() returns void language plpgsql security definer set search_path='' as $$
declare uid uuid:=(select auth.uid()); pid uuid; old_name text; deleted_name text;
begin
  select id,username into pid,old_name from public.profiles where user_id=uid and deleted_at is null for update;
  if pid is null then return; end if;
  deleted_name:='deleted-'||replace(pid::text,'-','');
  insert into public.account_deletion_requests(user_id,previous_username) values(uid,old_name) on conflict do nothing;
  delete from public.usernames where user_id=uid;
  update public.profiles set is_public=false,deleted_at=now(),username=deleted_name,display_name='Deleted account',bio=null,avatar_url=null where id=pid;
  update public.links set is_enabled=false,deleted_at=coalesce(deleted_at,now()) where profile_id=pid;
  update public.products set is_active=false,deleted_at=coalesce(deleted_at,now()) where profile_id=pid;
end; $$;
revoke all on function public.request_account_deletion() from public,anon;
grant execute on function public.request_account_deletion() to authenticated;

create or replace function public.admin_review_verification(p_request_id uuid,p_status text,p_reviewer uuid,p_note text)
returns void language plpgsql security invoker set search_path='' as $$
declare pid uuid;
begin
  if p_status not in ('approved','rejected') then raise exception 'invalid status'; end if;
  select profile_id into pid from public.verification_requests where id=p_request_id for update;
  if pid is null then raise exception 'verification request missing'; end if;
  update public.verification_requests
    set status=p_status,reviewer_user_id=p_reviewer,review_note=nullif(p_note,''),updated_at=now()
    where id=p_request_id;
  update public.profiles set is_verified=(p_status='approved'),updated_at=now() where id=pid;
end; $$;
revoke all on function public.admin_review_verification(uuid,text,uuid,text) from public,anon,authenticated;
grant execute on function public.admin_review_verification(uuid,text,uuid,text) to service_role;

create or replace function private.enforce_profile_entitlements() returns trigger language plpgsql security invoker set search_path='' as $$
declare paid boolean;
begin
  if (select auth.uid()) is not null and (select auth.uid())=old.user_id and (new.theme_id is distinct from old.theme_id or new.appearance is distinct from old.appearance) then
    select exists(select 1 from public.subscriptions s where s.profile_id=old.id and s.plan in ('pro','business') and s.status in ('active','trialing','past_due') and (s.current_period_end is null or s.current_period_end>now())) into paid;
    if not paid then
      if coalesce(new.theme_id,'minimal')<>'minimal'
         or coalesce(new.appearance->>'backgroundType','solid')<>'solid'
         or coalesce(new.appearance->>'buttonStyle','rounded')<>'rounded'
         or coalesce(new.appearance->>'font','system')<>'system'
         or coalesce(new.appearance->>'fontSize','medium')<>'medium' then
        raise exception 'advanced appearance requires an eligible plan';
      end if;
    end if;
  end if;
  return new;
end; $$;
revoke all on function private.enforce_profile_entitlements() from public,anon,authenticated;
create trigger profiles_enforce_entitlements before update on public.profiles for each row execute function private.enforce_profile_entitlements();

-- RLS on every exposed public table.
alter table public.profile_categories enable row level security;
alter table public.user_roles enable row level security;
alter table public.themes enable row level security;
alter table public.usernames enable row level security;
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.payment_events enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_downloads enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_orders enable row level security;
alter table public.analytics_events enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.link_daily_stats enable row level security;
alter table public.referrer_daily_stats enable row level security;
alter table public.device_daily_stats enable row level security;
alter table public.reports enable row level security;
alter table public.verification_requests enable row level security;
alter table public.team_members enable row level security;
alter table public.notifications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.account_deletion_requests enable row level security;
alter table public.rate_limits enable row level security;

create policy categories_public_read on public.profile_categories for select to anon,authenticated using (is_active=true);
create policy categories_admin_read on public.profile_categories for select to authenticated using (private.has_role(array['administrator','super_administrator']));
create policy categories_admin_insert on public.profile_categories for insert to authenticated with check (private.has_role(array['administrator','super_administrator']));
create policy categories_admin_update on public.profile_categories for update to authenticated using (private.has_role(array['administrator','super_administrator'])) with check (private.has_role(array['administrator','super_administrator']));

create policy user_roles_read_own on public.user_roles for select to authenticated using (user_id=(select auth.uid()) or private.has_role(array['administrator','super_administrator']));
create policy user_roles_admin_manage on public.user_roles for update to authenticated using (private.has_role(array['super_administrator'])) with check (private.has_role(array['super_administrator']));
create policy themes_public_read on public.themes for select to anon,authenticated using (is_active=true);
create policy usernames_owner_read on public.usernames for select to authenticated using (user_id=(select auth.uid()));

create policy profiles_public_read on public.profiles for select to anon,authenticated using (is_public=true and deleted_at is null);
create policy profiles_owner_admin_read on public.profiles for select to authenticated using (user_id=(select auth.uid()) or private.has_role(array['moderator','administrator','super_administrator']));
create policy profiles_owner_update on public.profiles for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy profiles_admin_update on public.profiles for update to authenticated using (private.has_role(array['administrator','super_administrator'])) with check (private.has_role(array['administrator','super_administrator']));

create policy links_public_read on public.links for select to anon,authenticated using (deleted_at is null and is_enabled=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()) and exists(select 1 from public.profiles p where p.id=profile_id and p.is_public=true and p.deleted_at is null));
create policy links_owner_read on public.links for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['moderator','administrator','super_administrator']));
create policy links_owner_insert on public.links for insert to authenticated with check (
  exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid()))
  and (select count(*) from public.links l where l.profile_id=profile_id and l.deleted_at is null) < coalesce((select case s.plan when 'business' then 200 when 'pro' then 50 else 8 end from public.subscriptions s where s.profile_id=profile_id and s.status in ('active','trialing','past_due') and (s.current_period_end is null or s.current_period_end>now()) order by s.created_at desc limit 1),8)
);
create policy links_owner_update on public.links for update to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid()))) with check (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));

create policy products_public_read on public.products for select to anon,authenticated using (
  is_active=true and deleted_at is null
  and exists(select 1 from public.profiles p where p.id=profile_id and p.is_public=true and p.deleted_at is null)
  and private.profile_has_commerce(profile_id)
);
create policy products_owner_admin_read on public.products for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['administrator','super_administrator']));
create policy products_owner_insert on public.products for insert to authenticated with check (
  exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid()))
  and private.profile_has_commerce(profile_id)
);
create policy products_owner_update on public.products for update to authenticated
using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) and private.profile_has_commerce(profile_id))
with check (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) and private.profile_has_commerce(profile_id));

create policy transactions_seller_read on public.transactions for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['administrator','super_administrator']));
create policy purchases_seller_buyer_read on public.purchases for select to authenticated using (buyer_user_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=seller_profile_id and p.user_id=(select auth.uid())) or private.has_role(array['administrator','super_administrator']));
create policy downloads_seller_read on public.purchase_downloads for select to authenticated using (exists(select 1 from public.purchases pu join public.profiles p on p.id=pu.seller_profile_id where pu.id=purchase_id and p.user_id=(select auth.uid())));
create policy subscriptions_owner_read on public.subscriptions for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['administrator','super_administrator']));
create policy billing_orders_owner_admin_read on public.billing_orders for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['administrator','super_administrator']));

create policy analytics_events_owner_read on public.analytics_events for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));
create policy analytics_daily_owner_read on public.analytics_daily for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));
create policy link_daily_owner_read on public.link_daily_stats for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));
create policy referrer_daily_owner_read on public.referrer_daily_stats for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));
create policy device_daily_owner_read on public.device_daily_stats for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));

create policy reports_public_insert on public.reports for insert to anon,authenticated with check (reporter_user_id is null or reporter_user_id=(select auth.uid()));
create policy reports_moderator_read on public.reports for select to authenticated using (private.has_role(array['moderator','administrator','super_administrator']));
create policy reports_moderator_update on public.reports for update to authenticated using (private.has_role(array['moderator','administrator','super_administrator'])) with check (private.has_role(array['moderator','administrator','super_administrator']));
create policy verification_owner_read on public.verification_requests for select to authenticated using (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['moderator','administrator','super_administrator']));
create policy verification_owner_insert on public.verification_requests for insert to authenticated with check (exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));
create policy verification_moderator_update on public.verification_requests for update to authenticated using (private.has_role(array['moderator','administrator','super_administrator'])) with check (private.has_role(array['moderator','administrator','super_administrator']));
create policy team_member_read on public.team_members for select to authenticated using (user_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())));

create policy notifications_owner_read on public.notifications for select to authenticated using (user_id=(select auth.uid()));
create policy notifications_owner_update on public.notifications for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy contact_admin_read on public.contact_messages for select to authenticated using (private.has_role(array['administrator','super_administrator']));
create policy deletion_owner_read on public.account_deletion_requests for select to authenticated using (user_id=(select auth.uid()));
create policy deletion_owner_insert on public.account_deletion_requests for insert to authenticated with check (user_id=(select auth.uid()));

-- Explicit grants for Data API roles. RLS remains the authorization layer.
grant select on public.themes,public.profile_categories to anon,authenticated;
grant insert,update on public.profile_categories to authenticated;
grant select on public.profiles,public.links,public.products to anon,authenticated;
grant select on public.profiles,public.links,public.products,public.usernames to authenticated;
grant insert,update on public.links,public.products to authenticated;
grant update(display_name,bio,avatar_url,category,locale,is_public,analytics_enabled,theme_id,appearance,notification_preferences,updated_at) on public.profiles to authenticated;
grant select on public.user_roles,public.transactions,public.purchases,public.purchase_downloads,public.subscriptions,public.billing_orders,public.analytics_events,public.analytics_daily,public.link_daily_stats,public.referrer_daily_stats,public.device_daily_stats,public.reports,public.verification_requests,public.team_members,public.notifications,public.account_deletion_requests to authenticated;
grant insert on public.verification_requests to authenticated;
grant update on public.verification_requests to authenticated;
grant insert on public.reports,public.account_deletion_requests to authenticated;
grant insert on public.reports to anon;
grant update on public.user_roles,public.reports,public.notifications to authenticated;
grant all on public.transactions,public.billing_orders,public.payment_events,public.purchases,public.purchase_downloads,public.analytics_events,public.analytics_daily,public.link_daily_stats,public.referrer_daily_stats,public.device_daily_stats,public.rate_limits,public.notifications,public.contact_messages to service_role;
grant usage,select on all sequences in schema public to service_role;

-- Storage buckets and policies.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('avatars','avatars',true,4194304,array['image/jpeg','image/png','image/webp']),
 ('product-covers','product-covers',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('backgrounds','backgrounds',true,8388608,array['image/jpeg','image/png','image/webp']),
 ('digital-products','digital-products',false,104857600,null)
on conflict(id) do update set file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy storage_public_assets_read on storage.objects for select to anon,authenticated using (bucket_id in ('avatars','product-covers','backgrounds'));
create policy storage_owner_insert on storage.objects for insert to authenticated with check (
  (storage.foldername(name))[1]=(select auth.uid())::text
  and (
    bucket_id in ('avatars','backgrounds')
    or (bucket_id in ('product-covers','digital-products') and exists(select 1 from public.profiles p join public.subscriptions s on s.profile_id=p.id where p.user_id=(select auth.uid()) and p.deleted_at is null and s.plan in ('pro','business') and s.status in ('active','trialing','past_due') and (s.current_period_end is null or s.current_period_end>now())))
  )
);
create policy storage_owner_select_private on storage.objects for select to authenticated using (bucket_id='digital-products' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy storage_owner_update on storage.objects for update to authenticated using (bucket_id in ('avatars','product-covers','backgrounds','digital-products') and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id in ('avatars','product-covers','backgrounds','digital-products') and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy storage_owner_delete on storage.objects for delete to authenticated using (bucket_id in ('avatars','product-covers','backgrounds','digital-products') and (storage.foldername(name))[1]=(select auth.uid())::text);
