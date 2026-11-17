# FormBot — Interactive Conversational Form Builder & Chatbot Widget

[![Live Demo](https://img.shields.io/badge/Live%20Demo-formbot--eight.vercel.app-2563eb?style=for-the-badge&logo=vercel)](https://formbot-eight.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**FormBot** is a full-stack conversational form builder web application that transforms traditional, static web forms into engaging, one-question-at-a-time chatbot experiences. Creators can design custom conversational flows, preview interactions live, publish shareable standalone form links, embed a floating chatbot widget onto any external website with a single JavaScript snippet, and manage responses with real-time analytics and CSV exports.

🔗 **Live Production Demo:** [https://formbot-eight.vercel.app/](https://formbot-eight.vercel.app/)  
📂 **Repository:** [https://github.com/rafitboo/formbot](https://github.com/rafitboo/formbot)

---

## Table of Contents

- [Key Features](#key-features)
- [System Architecture & Workflow](#system-architecture--workflow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started Locally](#getting-started-locally)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Embedding the Chatbot Widget](#embedding-the-chatbot-widget)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Key Features

### 1. Landing Page & Interactive Sandbox (`/`)
- Clean, responsive marketing layout featuring a hero section, feature breakdown, and a 3-step workflow guide.
- Built-in **Live Interactive Demo** allowing visitors to test the conversational form experience directly on the homepage.

### 2. User Dashboard (`/dashboard`)
- Real-time aggregated metrics cards displaying **Total Forms**, **Total Responses**, and **Average Responses per Form**.
- Full form lifecycle management: create new forms, edit existing flows, toggle **Draft / Published** status, copy shareable links, and delete forms.

### 3. Visual Form Builder (`/builder/[id]`)
- **Multiple Question Types:** Supports **Short Text**, **Email Address**, **Multiple Choice**, and **Yes / No** prompts.
- **Flow Controls:** Add, edit, delete, reorder (up/down), and toggle required validation per question.
- **Brand Customization:** Customize form title, description, welcome greeting, completion message, and primary brand color.
- **Side-by-Side Live Preview:** Test changes instantaneously in an interactive chatbot preview pane before publishing.

### 4. Chatbot Runner & Cross-Origin Floating Widget (`/forms/[id]`, `/widget/[id]`, `/widget.js`)
- One-question-at-a-time chat interface with smooth message history bubbles.
- Client-side validation for mandatory fields and valid email formatting.
- Mobile- and desktop-responsive UI.
- Zero-dependency `public/widget.js` script that injects a floating launcher button and sandboxed `<iframe>` modal onto any external webpage without CSS conflicts.

### 5. Submissions & Analytics (`/responses/[id]` & `/test-embed`)
- Chronological submission feed with localized timestamps and detailed question-to-answer inspection.
- **One-Click CSV Export** for offline reporting and spreadsheet analysis.
- Built-in **External Website Simulation Environment (`/test-embed`)** and one-click **Embed Code Generator** modal to verify third-party widget mounting.

---

## System Architecture & Workflow

```text
┌────────────────────┐      Server Actions      ┌───────────────────────┐
│   Form Creator     │ ───────────────────────► │  Supabase PostgreSQL  │
│ (Dashboard/Builder)│                          │ (forms, questions,    │
└────────────────────┘                          │  responses, answers)  │
                                                └───────────┬───────────┘
                                                            │
┌────────────────────┐   POST /api/forms/[id]/submit        │
│ Public / External  │ ─────────────────────────────────────┘
│ User (widget.js or │
│    /forms/[id])    │ ──────► Viewed & Exported as CSV in /responses/[id]
└────────────────────┘
```

1. **Authoring:** Creators configure questions, validation rules, and branding in `/builder/[id]` and publish the form.
2. **Distribution:** Published forms are accessible via standalone links (`/forms/[id]`) or embedded on external sites via `widget.js`.
3. **Collection:** Respondents complete the conversation step by step; validated answers are stored transactionally via `POST /api/forms/[id]/submit`.
4. **Reporting:** Form owners inspect submissions and download CSV exports from `/responses/[id]`.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Language** | Next.js 16 (App Router, Server Actions, Route Handlers), React, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide React Icons |
| **Database & Security** | Supabase (PostgreSQL with Row Level Security & Cascade Constraints) |
| **Embed Widget** | Vanilla JavaScript (`public/widget.js`) with isolated `<iframe>` rendering |
| **Deployment & VCS** | Git, GitHub, Vercel CI/CD |

---

## Project Structure

```text
formbot/
├── public/
│   └── widget.js                     # Standalone cross-origin floating widget script
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── form-actions.ts       # Server Actions for form & question CRUD
│   │   ├── api/
│   │   │   └── forms/[id]/submit/
│   │   │       └── route.ts          # Public REST endpoint for form submissions
│   │   ├── builder/[id]/page.tsx     # Visual Form Builder page
│   │   ├── dashboard/page.tsx        # User Dashboard & metrics overview
│   │   ├── forms/[id]/page.tsx       # Standalone public chatbot runner
│   │   ├── responses/[id]/page.tsx   # Submission inspector & CSV export page
│   │   ├── test-embed/page.tsx       # Simulated external website embed tester
│   │   ├── widget/[id]/page.tsx      # Sandboxed iframe chatbot view for widget.js
│   │   ├── globals.css               # Global Tailwind styles
│   │   ├── layout.tsx                # Root layout & metadata
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── ChatbotRunner.tsx         # Core conversational form engine & validation
│   │   ├── DashboardView.tsx         # Dashboard UI & form action controls
│   │   ├── Footer.tsx                # Application footer
│   │   ├── FormBuilder.tsx           # Two-column builder & live preview editor
│   │   ├── InteractiveDemo.tsx       # Homepage interactive chatbot sandbox
│   │   ├── Navbar.tsx                # Top navigation bar
│   │   └── ResponsesView.tsx         # Response viewer, embed modal, & CSV exporter
│   └── lib/
│       ├── supabase.ts               # Build-safe Supabase client initialization
│       ├── types.ts                  # Shared TypeScript interfaces
│       └── utils.ts                  # Helper utilities
├── schema.sql                        # PostgreSQL relational schema & RLS policies
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # Project documentation
```

---

## Getting Started Locally

### Prerequisites
- **Node.js** 18.18+ or 20+
- **npm** (or yarn/pnpm)
- A free [Supabase](https://supabase.com/) project

### 1. Clone the Repository
```bash
git clone https://github.com/rafitboo/formbot.git
cd formbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize the Database
Run the SQL migration script in your Supabase **SQL Editor** (detailed in the [Database Setup](#database-setup-supabase) section below).

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup (Supabase)

Execute the contents of `schema.sql` inside your Supabase SQL Editor to create the four relational tables (`forms`, `questions`, `responses`, `answers`), foreign-key indexes, and Row Level Security policies:

```sql
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

-- 3. RESPONSES TABLE
create table if not exists public.responses (
    id uuid primary key default gen_random_uuid(),
    form_id uuid not null references public.forms(id) on delete cascade,
    submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ANSWERS TABLE
create table if not exists public.answers (
    id uuid primary key default gen_random_uuid(),
    response_id uuid not null references public.responses(id) on delete cascade,
    question_id uuid not null references public.questions(id) on delete cascade,
    value text default '',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES
create index if not exists idx_questions_form_id on public.questions(form_id);
create index if not exists idx_responses_form_id on public.responses(form_id);
create index if not exists idx_answers_response_id on public.answers(response_id);

-- ROW LEVEL SECURITY
alter table public.forms enable row level security;
alter table public.questions enable row level security;
alter table public.responses enable row level security;
alter table public.answers enable row level security;

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
```

---

## Embedding the Chatbot Widget

To embed any **Published** FormBot widget onto an external HTML site, WordPress page, or Webflow project, paste the following snippet right before the closing `</body>` tag:

```html
<script
  src="https://formbot-eight.vercel.app/widget.js"
  data-form-id="YOUR_FORM_ID"
  data-host="https://formbot-eight.vercel.app"
  async>
</script>
```

You can also test any published Form ID live using the built-in host simulator at [https://formbot-eight.vercel.app/test-embed](https://formbot-eight.vercel.app/test-embed).

---

## Deployment

This application is configured for seamless deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) across **Production**, **Preview**, and **Development**.
4. Deploy.

---

## Future Improvements

- **Conditional Logic & Branching:** Support rule-based skip logic so follow-up questions adapt dynamically based on previous answers.
- **Multi-Tenant Authentication:** Add user authentication via Supabase Auth with user-scoped RLS policies for private creator workspaces.
- **Webhooks & Email Notifications:** Trigger outbound webhooks and instant email alerts whenever a new submission is recorded.

---

## Author

**Md. Rafiul Islam**  
- GitHub: [@rafitboo](https://github.com/rafitboo)  
- LinkedIn: [linkedin.com/in/rafitboo](https://www.linkedin.com/in/rafitboo/)  
- Portfolio: [rafitboo.vercel.app](https://rafitboo.vercel.app/)