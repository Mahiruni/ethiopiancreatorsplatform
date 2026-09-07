create or replace function public.username_is_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_username is not null
    and p_username ~ '^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$'
    and length(p_username) between 3 and 30
    and p_username not in (
      'admin','api','app','auth','dashboard','explore','features','help','login','logout',
      'pricing','privacy','report','settings','signup','support','terms','www','linqo'
    )
    and not exists (
      select 1
      from public.usernames u
      where u.username = p_username
    );
$$;

revoke all on function public.username_is_available(text) from public;
grant execute on function public.username_is_available(text) to anon, authenticated;

comment on function public.username_is_available(text)
is 'Returns only username availability. Does not expose ownership data.';
