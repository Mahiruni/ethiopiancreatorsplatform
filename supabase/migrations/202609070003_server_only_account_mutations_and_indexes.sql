revoke all on function public.complete_onboarding(text,text,text,text,text,jsonb) from public, anon, authenticated, service_role;
revoke all on function public.change_username(text) from public, anon, authenticated, service_role;
revoke all on function public.request_account_deletion() from public, anon, authenticated, service_role;

create or replace function public.complete_onboarding_server(
  p_user_id uuid,p_username text,p_display_name text,p_bio text,p_category text,p_theme text,p_links jsonb
) returns uuid language plpgsql security invoker set search_path='' as $$
declare pid uuid; item jsonb; pos integer:=0; uname text:=lower(trim(p_username));
begin
  if p_user_id is null or not exists(select 1 from auth.users where id=p_user_id) then raise exception 'invalid user'; end if;
  if exists(select 1 from public.profiles where user_id=p_user_id and deleted_at is null) then raise exception 'profile already exists'; end if;
  if uname !~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$' or char_length(uname) not between 3 and 30 or uname in ('admin','api','app','auth','dashboard','explore','features','help','login','logout','pricing','privacy','report','settings','signup','support','terms','www','linqo') then raise exception 'invalid username'; end if;
  if char_length(trim(p_display_name)) not between 1 and 80 then raise exception 'invalid display name'; end if;
  if p_bio is not null and char_length(p_bio)>240 then raise exception 'bio too long'; end if;
  if not exists(select 1 from public.profile_categories where name_en=p_category and is_active=true) then raise exception 'invalid category'; end if;
  if p_theme not in ('minimal','creator') then raise exception 'premium theme requires paid plan'; end if;
  if jsonb_array_length(coalesce(p_links,'[]'::jsonb))>8 then raise exception 'free plan link limit exceeded'; end if;
  insert into public.usernames(username,user_id) values(uname,p_user_id);
  insert into public.profiles(user_id,username,display_name,bio,category,theme_id)
  values(p_user_id,uname,trim(p_display_name),nullif(trim(p_bio),''),p_category,p_theme) returning id into pid;
  insert into public.subscriptions(profile_id,plan,status) values(pid,'free','active');
  for item in select * from jsonb_array_elements(coalesce(p_links,'[]'::jsonb)) loop
    if (item->>'type') not in ('standard','social','whatsapp','telegram') then raise exception 'invalid onboarding link type'; end if;
    if coalesce(item->>'url','') !~* '^https?://' then raise exception 'invalid onboarding link URL'; end if;
    insert into public.links(profile_id,type,title,url,position,is_enabled)
    values(pid,item->>'type',left(item->>'title',120),item->>'url',pos,true);
    pos:=pos+1;
  end loop;
  return pid;
end; $$;
revoke all on function public.complete_onboarding_server(uuid,text,text,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.complete_onboarding_server(uuid,text,text,text,text,text,jsonb) to service_role;

create or replace function public.change_username_server(p_user_id uuid,p_username text) returns text
language plpgsql security invoker set search_path='' as $$
declare old_name text; uname text:=lower(trim(p_username));
begin
  if p_user_id is null then raise exception 'invalid user'; end if;
  if uname !~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$' or char_length(uname) not between 3 and 30 or uname in ('admin','api','app','auth','dashboard','explore','features','help','login','logout','pricing','privacy','report','settings','signup','support','terms','www','linqo') then raise exception 'invalid username'; end if;
  select username into old_name from public.profiles where user_id=p_user_id and deleted_at is null for update;
  if old_name is null then raise exception 'profile missing'; end if;
  if old_name=uname then return uname; end if;
  insert into public.usernames(username,user_id) values(uname,p_user_id);
  update public.profiles set username=uname,updated_at=now() where user_id=p_user_id and deleted_at is null;
  delete from public.usernames where username=old_name and user_id=p_user_id;
  return uname;
end; $$;
revoke all on function public.change_username_server(uuid,text) from public, anon, authenticated;
grant execute on function public.change_username_server(uuid,text) to service_role;

create or replace function public.request_account_deletion_server(p_user_id uuid) returns void
language plpgsql security invoker set search_path='' as $$
begin
  if p_user_id is null then raise exception 'invalid user'; end if;
  update public.profiles set is_public=false,deleted_at=coalesce(deleted_at,now()),updated_at=now() where user_id=p_user_id;
  update public.links set is_enabled=false,updated_at=now() where profile_id in(select id from public.profiles where user_id=p_user_id);
  update public.products set is_active=false,updated_at=now() where profile_id in(select id from public.profiles where user_id=p_user_id);
  insert into public.account_deletion_requests(user_id) values(p_user_id) on conflict do nothing;
end; $$;
revoke all on function public.request_account_deletion_server(uuid) from public, anon, authenticated;
grant execute on function public.request_account_deletion_server(uuid) to service_role;

create index if not exists link_daily_stats_link_id_idx on public.link_daily_stats(link_id);
create index if not exists profiles_theme_id_idx on public.profiles(theme_id);
create index if not exists purchases_product_id_idx on public.purchases(product_id);
create index if not exists reports_reported_profile_id_idx on public.reports(reported_profile_id);
create index if not exists reports_reporter_user_id_idx on public.reports(reporter_user_id);
create index if not exists team_members_user_id_idx on public.team_members(user_id);
create index if not exists transactions_product_id_idx on public.transactions(product_id);
create index if not exists verification_requests_reviewer_id_idx on public.verification_requests(reviewer_id);

create policy payment_events_service_only on public.payment_events for all to service_role using (true) with check (true);
create policy rate_limits_service_only on public.rate_limits for all to service_role using (true) with check (true);

drop policy if exists categories_public_read on public.profile_categories;
drop policy if exists categories_admin_read on public.profile_categories;
create policy categories_anon_read on public.profile_categories for select to anon using (is_active=true);
create policy categories_authenticated_read on public.profile_categories for select to authenticated using (is_active=true or private.has_role(array['administrator','super_administrator']));

drop policy if exists profiles_public_read on public.profiles;
drop policy if exists profiles_owner_admin_read on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_anon_read on public.profiles for select to anon using (is_public=true and deleted_at is null);
create policy profiles_authenticated_read on public.profiles for select to authenticated using ((is_public=true and deleted_at is null) or user_id=(select auth.uid()) or private.has_role(array['moderator','administrator','super_administrator']));
create policy profiles_authenticated_update on public.profiles for update to authenticated using (user_id=(select auth.uid()) or private.has_role(array['administrator','super_administrator'])) with check (user_id=(select auth.uid()) or private.has_role(array['administrator','super_administrator']));

drop policy if exists links_public_read on public.links;
drop policy if exists links_owner_read on public.links;
create policy links_anon_read on public.links for select to anon using (deleted_at is null and is_enabled=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()) and exists(select 1 from public.profiles p where p.id=profile_id and p.is_public=true and p.deleted_at is null));
create policy links_authenticated_read on public.links for select to authenticated using ((deleted_at is null and is_enabled=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()) and exists(select 1 from public.profiles p where p.id=profile_id and p.is_public=true and p.deleted_at is null)) or exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['moderator','administrator','super_administrator']));

drop policy if exists products_public_read on public.products;
drop policy if exists products_owner_admin_read on public.products;
create policy products_anon_read on public.products for select to anon using (is_active=true and deleted_at is null and exists(select 1 from public.profiles p where p.id=profile_id and p.is_public=true and p.deleted_at is null) and private.profile_has_commerce(profile_id));
create policy products_authenticated_read on public.products for select to authenticated using ((is_active=true and deleted_at is null and exists(select 1 from public.profiles p where p.id=profile_id and p.is_public=true and p.deleted_at is null) and private.profile_has_commerce(profile_id)) or exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid())) or private.has_role(array['administrator','super_administrator']));
