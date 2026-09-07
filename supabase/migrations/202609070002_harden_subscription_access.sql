revoke insert, update, delete on public.subscriptions, public.billing_orders from anon, authenticated;
revoke insert, update, delete on public.transactions, public.payment_events, public.purchases, public.purchase_downloads from anon, authenticated;
revoke insert, update, delete on public.analytics_events, public.analytics_daily, public.link_daily_stats, public.referrer_daily_stats, public.device_daily_stats from anon, authenticated;
revoke insert, update, delete on public.rate_limits from anon, authenticated;

grant select on public.billing_orders to authenticated;

drop policy if exists billing_orders_owner_admin_read on public.billing_orders;
create policy billing_orders_owner_admin_read on public.billing_orders for select to authenticated using (
  exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=(select auth.uid()))
  or private.has_role(array['administrator','super_administrator'])
);

create or replace function private.block_untrusted_financial_write() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if current_user not in ('service_role','postgres') then
    raise exception 'financial state is server managed';
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end; $$;
revoke all on function private.block_untrusted_financial_write() from public, anon, authenticated;

drop trigger if exists subscriptions_server_managed on public.subscriptions;
create trigger subscriptions_server_managed before insert or update or delete on public.subscriptions for each row execute function private.block_untrusted_financial_write();
drop trigger if exists billing_orders_server_managed on public.billing_orders;
create trigger billing_orders_server_managed before insert or update or delete on public.billing_orders for each row execute function private.block_untrusted_financial_write();
