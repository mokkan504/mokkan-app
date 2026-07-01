create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text not null default 'direct',
  visitor_id uuid not null,
  device text not null check (device in ('mobile','tablet','desktop')),
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_visitor_id_idx on public.analytics_events(visitor_id);
alter table public.analytics_events enable row level security;

drop policy if exists "analytics admin read" on public.analytics_events;
create policy "analytics admin read" on public.analytics_events for select to authenticated using (public.is_admin());
revoke all on public.analytics_events from anon, authenticated;
grant select on public.analytics_events to authenticated;

create or replace function public.track_page_view(
  p_path text, p_referrer text, p_visitor_id uuid, p_device text
) returns void language plpgsql security definer set search_path = public as $$
begin
  if p_path is null or length(p_path) > 200 or p_path !~ '^/' then return; end if;
  if p_device not in ('mobile','tablet','desktop') then return; end if;
  insert into public.analytics_events(path,referrer,visitor_id,device)
  values(p_path,left(coalesce(p_referrer,'direct'),200),p_visitor_id,p_device);
end; $$;

revoke all on function public.track_page_view(text,text,uuid,text) from public;
grant execute on function public.track_page_view(text,text,uuid,text) to anon, authenticated;
