-- Filename synchronized with the deployed MCP migration version.
-- Retain historical budget/consent columns and rows; only relax completion requirements.
alter table public.ugc_leads
  drop constraint ugc_leads_check1,
  add constraint ugc_leads_completion_check
    check (step < 4 or (goal is not null and challenge is not null));
