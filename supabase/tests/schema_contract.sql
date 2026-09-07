-- Run against a disposable/local Supabase database after migrations.
begin;
do $$ begin
  if not exists(select 1 from pg_tables where schemaname='public' and tablename='profiles') then raise exception 'profiles missing'; end if;
  if not exists(select 1 from pg_tables where schemaname='public' and tablename='transactions') then raise exception 'transactions missing'; end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='profiles') then raise exception 'profiles RLS policies missing'; end if;
  if not exists(select 1 from storage.buckets where id='digital-products' and public=false) then raise exception 'digital-products must be private'; end if;
end $$;
rollback;
