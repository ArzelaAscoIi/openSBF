-- Add Prüfungsbögen exam results column to user_progress
-- Stores attempt history per Prüfungsbogen as JSONB array keyed by see_pb_01 … see_pb_15

alter table public.user_progress
  add column if not exists pruefungsboegen jsonb not null default '{}'::jsonb;
