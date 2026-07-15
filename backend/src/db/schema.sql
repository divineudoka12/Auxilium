-- Run this once in the Supabase SQL editor to set up tables.

create table if not exists applicants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  monthly_income numeric not null,
  monthly_debt numeric not null,
  employment_status text not null check (employment_status in ('employed', 'self_employed', 'unemployed')),
  credit_score integer,
  requested_loan_amount numeric not null,
  created_at timestamptz default now()
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references applicants(id) not null,
  affordability_ratio numeric not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  confidence numeric not null,
  explanation text not null,
  flags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists document_analyses (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references applicants(id) not null,
  extracted_fields jsonb not null default '{}',
  missing_fields text[] default '{}',
  inconsistencies text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists credit_memos (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references applicants(id) not null,
  recommendation text not null check (recommendation in ('approve', 'reject', 'manual_review')),
  summary text not null,
  score_id uuid references scores(id),
  document_analysis_id uuid references document_analyses(id),
  officer_decision text check (officer_decision in ('approved', 'rejected', 'pending')) default 'pending',
  created_at timestamptz default now()
);
