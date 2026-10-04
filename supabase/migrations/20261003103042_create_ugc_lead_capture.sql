-- Filename synchronized with the remote MCP migration version after deployment.
create table public.ugc_leads (
  id uuid primary key default gen_random_uuid(),
  session_token_hash text not null unique check (session_token_hash ~ '^[0-9a-f]{64}$'),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  role text check (role in ('Founder / business owner', 'UGC creator', 'Marketer', 'Agency / freelancer', 'Just exploring')),
  project_name text check (char_length(project_name) between 1 and 150),
  project_description text check (char_length(project_description) between 1 and 1500),
  industry text check (industry in ('E-commerce', 'SaaS / tech', 'Beauty / wellness', 'Food / lifestyle', 'Education', 'Other')),
  team_size text check (team_size in ('Just me', '2-5', '6-20', '21+')),
  website text check (char_length(website) <= 500),
  instagram text check (char_length(instagram) <= 500),
  tiktok text check (char_length(tiktok) <= 500),
  linkedin text check (char_length(linkedin) <= 500),
  x text check (char_length(x) <= 500),
  goal text check (goal in ('Create better content', 'Find ad inspiration', 'Grow my brand', 'Improve client work')),
  challenge text check (char_length(challenge) between 1 and 1500),
  budget text check (budget in ('Not yet', 'Under $500', '$500-$2,000', '$2,000+')),
  marketing_consent boolean not null default false,
  consent_version text not null default 'ugc-v1' check (consent_version = 'ugc-v1'),
  utm_source text check (char_length(utm_source) <= 200),
  utm_medium text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  utm_content text check (char_length(utm_content) <= 200),
  utm_term text check (char_length(utm_term) <= 200),
  referrer text check (char_length(referrer) <= 500),
  timezone text check (char_length(timezone) <= 100),
  step smallint not null check (step between 1 and 4),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (step < 2 or (role is not null and project_name is not null and project_description is not null and industry is not null and team_size is not null)),
  check (step < 4 or (goal is not null and challenge is not null and budget is not null)),
  check ((step = 4) = (completed_at is not null)),
  check (not marketing_consent or step = 4)
);

create table public.ugc_rate_limits (
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  window_start timestamptz not null,
  requests integer not null check (requests between 1 and 41),
  expires_at timestamptz not null,
  primary key (ip_hash, window_start)
);
create index ugc_rate_limits_expires_at_idx on public.ugc_rate_limits (expires_at);

alter table public.ugc_leads enable row level security;
alter table public.ugc_rate_limits enable row level security;
revoke all on public.ugc_leads, public.ugc_rate_limits from public, anon, authenticated;
grant select, insert, update on public.ugc_leads to service_role;
grant select, insert, update, delete on public.ugc_rate_limits to service_role;

-- An atomic fixed UTC-hour counter shared by all Edge Function instances.
create function public.consume_ugc_rate_limit(p_ip_hash text)
returns boolean
language plpgsql security invoker
set search_path = ''
as $$
declare
  v_window timestamptz := date_trunc('hour', clock_timestamp(), 'UTC');
  v_requests integer;
begin
  delete from public.ugc_rate_limits where expires_at <= clock_timestamp();
  insert into public.ugc_rate_limits (ip_hash, window_start, requests, expires_at)
  values (p_ip_hash, v_window, 1, v_window + interval '1 hour')
  on conflict (ip_hash, window_start) do update
    set requests = least(public.ugc_rate_limits.requests + 1, 41)
  returning requests into v_requests;
  return v_requests <= 40;
end;
$$;

-- The capability hash, never an unverified email, is the conflict/update key.
create function public.save_ugc_lead(p_session_token_hash text, p_step smallint, p_lead jsonb)
returns boolean
language plpgsql security invoker
set search_path = ''
as $$
declare
  v_completed boolean;
begin
  insert into public.ugc_leads as lead (
    session_token_hash, step, name, email, role, project_name, project_description,
    industry, team_size, website, instagram, tiktok, linkedin, x, goal, challenge,
    budget, marketing_consent, utm_source, utm_medium, utm_campaign, utm_content,
    utm_term, referrer, timezone, completed_at
  ) values (
    p_session_token_hash, p_step, p_lead->>'name', p_lead->>'email',
    case when p_step >= 2 then p_lead->>'role' end,
    case when p_step >= 2 then p_lead->>'project_name' end,
    case when p_step >= 2 then p_lead->>'project_description' end,
    case when p_step >= 2 then p_lead->>'industry' end,
    case when p_step >= 2 then p_lead->>'team_size' end,
    case when p_step >= 2 then p_lead->>'website' end,
    case when p_step >= 3 then p_lead->>'instagram' end,
    case when p_step >= 3 then p_lead->>'tiktok' end,
    case when p_step >= 3 then p_lead->>'linkedin' end,
    case when p_step >= 3 then p_lead->>'x' end,
    case when p_step = 4 then p_lead->>'goal' end,
    case when p_step = 4 then p_lead->>'challenge' end,
    case when p_step = 4 then p_lead->>'budget' end,
    case when p_step = 4 then coalesce((p_lead->>'marketing_consent')::boolean, false) else false end,
    p_lead->>'utm_source', p_lead->>'utm_medium', p_lead->>'utm_campaign',
    p_lead->>'utm_content', p_lead->>'utm_term', p_lead->>'referrer', p_lead->>'timezone',
    case when p_step = 4 then now() end
  )
  on conflict (session_token_hash) do update set
    name = excluded.name,
    email = excluded.email,
    role = case when p_step >= 2 then excluded.role else lead.role end,
    project_name = case when p_step >= 2 then excluded.project_name else lead.project_name end,
    project_description = case when p_step >= 2 then excluded.project_description else lead.project_description end,
    industry = case when p_step >= 2 then excluded.industry else lead.industry end,
    team_size = case when p_step >= 2 then excluded.team_size else lead.team_size end,
    website = case when p_step >= 2 then excluded.website else lead.website end,
    instagram = case when p_step >= 3 then excluded.instagram else lead.instagram end,
    tiktok = case when p_step >= 3 then excluded.tiktok else lead.tiktok end,
    linkedin = case when p_step >= 3 then excluded.linkedin else lead.linkedin end,
    x = case when p_step >= 3 then excluded.x else lead.x end,
    goal = case when p_step = 4 then excluded.goal else lead.goal end,
    challenge = case when p_step = 4 then excluded.challenge else lead.challenge end,
    budget = case when p_step = 4 then excluded.budget else lead.budget end,
    marketing_consent = case when p_step = 4 then excluded.marketing_consent else lead.marketing_consent end,
    utm_source = coalesce(excluded.utm_source, lead.utm_source),
    utm_medium = coalesce(excluded.utm_medium, lead.utm_medium),
    utm_campaign = coalesce(excluded.utm_campaign, lead.utm_campaign),
    utm_content = coalesce(excluded.utm_content, lead.utm_content),
    utm_term = coalesce(excluded.utm_term, lead.utm_term),
    referrer = coalesce(excluded.referrer, lead.referrer),
    timezone = coalesce(excluded.timezone, lead.timezone),
    step = greatest(lead.step, excluded.step),
    completed_at = excluded.completed_at,
    updated_at = now()
  where lead.completed_at is null
  returning completed_at is not null into v_completed;

  if not found then
    select completed_at is not null into v_completed
      from public.ugc_leads where session_token_hash = p_session_token_hash;
  end if;
  return v_completed;
end;
$$;

revoke all on function public.consume_ugc_rate_limit(text) from public, anon, authenticated;
revoke all on function public.save_ugc_lead(text, smallint, jsonb) from public, anon, authenticated;
grant execute on function public.consume_ugc_rate_limit(text) to service_role;
grant execute on function public.save_ugc_lead(text, smallint, jsonb) to service_role;
