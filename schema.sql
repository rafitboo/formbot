-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. FORMS TABLE
create table if not exists public.forms (
    id uuid primary key default gen_random_uuid(),
    title text not null default 'Untitled Form',
    description text default '',
    welcome_message text default 'Hi there! Please take a moment to fill out this quick form.',
    completion_message text default 'Thank you! Your response has been recorded.',
    primary_color text default '#2563eb',
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. QUESTIONS TABLE
create table if not exists public.questions (
    id uuid primary key default gen_random_uuid(),
    form_id uuid not null references public.forms(id) on delete cascade,
    title text not null,
    question_type text not null check (question_type in ('text', 'email', 'multiple_choice', 'yes_no')),
    order_index integer not null default 0,
    is_required boolean default true,
    options jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RESPONSES TABLE (Submission Sessions)
create table if not exists public.responses (
    id uuid primary key default gen_random_uuid(),
    form_id uuid not null references public.forms(id) on delete cascade,
    submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ANSWERS TABLE (Individual Question Values)
create table if not exists public.answers (
    id uuid primary key default gen_random_uuid(),
    response_id uuid not null references public.responses(id) on delete cascade,
    question_id uuid not null references public.questions(id) on delete cascade,
    value text default '',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES FOR PERFORMANCE
create index if not exists idx_questions_form_id on public.questions(form_id);
create index if not exists idx_responses_form_id on public.responses(form_id);
create index if not exists idx_answers_response_id on public.answers(response_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table public.forms enable row level security;
alter table public.questions enable row level security;
alter table public.responses enable row level security;
alter table public.answers enable row level security;

-- PUBLIC READ & WRITE POLICIES
create policy "Allow public read access on published forms"
    on public.forms for select using (true);

create policy "Allow public modifications on forms"
    on public.forms for all using (true);

create policy "Allow public access on questions"
    on public.questions for all using (true);

create policy "Allow public submissions to responses"
    on public.responses for all using (true);

create policy "Allow public submissions to answers"
    on public.answers for all using (true);