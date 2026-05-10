# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** portfolio site with React 19, TypeScript strict mode, and Tailwind CSS 4.

### Content System

Content is stored two ways:
- **Projects**: metadata in `data/projects.json`, long-form markdown in `content/projects/[slug].md`
- **Blog**: markdown files in `posts/` (root-level, legacy) and `content/blog/` (new path via `lib/md.ts`)

`lib/md.ts` converts markdown to HTML using gray-matter + remark. `lib/projects.ts` reads `data/projects.json` synchronously. `lib/posts.ts` reads the root-level `posts/` directory — not `content/blog/`. Both loaders run at request time in server components.

### Routing

- `/` — Homepage with hero, about, featured projects, contact
- `/projects` — All projects with client-side tag/search filtering
- `/projects/[slug]` — Individual project (markdown rendered)
- `/blog`, `/blog/[slug]` — Blog listing and posts
- `/about` — About page
- `/api/contact` — POST endpoint; sends email via Nodemailer SMTP
- `/p/[slug]` → permanent redirect to `/projects/[slug]` (next.config.ts)

### Component Patterns

- **Server components** fetch data directly (e.g., `FeaturedProjects` reads `projects.json`)
- **Client components** handle interactivity: contact form, theme toggle, command palette, lightbox
- **Animation**: Framer Motion used extensively — `Reveal` wraps content with scroll-triggered fade-in, `TiltCard` adds 3D hover effect
- **Hydration safety**: Client-only components (e.g., `ThemeToggle`) guard against SSR mismatch with a mounted state check

### Styling

Tailwind CSS 4 (PostCSS plugin, not the v3 config format). Dark mode is class-based (`dark:` prefix), toggled via `next-themes`.

Custom utility classes defined in `app/globals.css`: `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.tag`, `.shine-btn`, `.glass`, `.gradient-divider`.

Path alias `@/*` maps to the repository root.

### Admin System

Protected at `/admin` via `middleware.ts` using JWT (`jose`). The middleware checks the `admin_token` HttpOnly cookie on every `/admin/*` request (skips `/admin/login`).

- **Login**: `POST /api/auth/login` — verifies `ADMIN_PASSWORD`, issues a 7-day JWT cookie
- **Logout**: `POST /api/auth/logout` — clears the cookie
- **Works CRUD**: `GET|POST /api/works`, `PUT|DELETE /api/works/[id]`
- **Image upload**: `POST /api/upload` — uploads to Supabase Storage bucket `project-images`; `DELETE /api/upload` removes a file
- **Supabase client**: `lib/supabase.ts` — exports `getSupabase()` (anon key, public reads) and `getAdminSupabase()` (service role key, mutations). Lazy-initialized to avoid build-time errors when env vars are absent.

### Database Setup

1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL editor to create the `works` table with RLS policies
3. Create a Storage bucket named **`project-images`** (public read)
4. Note: the `images` column (text array) used by the admin UI is not in `schema.sql` — add it manually: `ALTER TABLE works ADD COLUMN images text[] DEFAULT '{}';`

### Migration Scripts

Three one-time migration scripts in `scripts/` (run in order):

```bash
node scripts/migrate-projects.mjs        # Upsert data/projects.json → works table
node scripts/migrate-images.mjs          # Sync image paths from public/images/ → works.images
node scripts/upload-images-to-storage.mjs # Upload images to Supabase Storage, update DB with public URLs
```

Each script reads `.env.local` directly (no dotenv dependency).

### Environment Variables

Required in `.env.local`:

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-side admin operations only

# Admin auth
ADMIN_PASSWORD=
JWT_SECRET=                  # base64-encoded random string

# Contact form (Nodemailer SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=                   # app-specific password for Gmail
SMTP_FROM=
CONTACT_RECEIVER=
```

### Email (Contact Form)

`/api/contact` uses Nodemailer with `export const runtime = 'nodejs'` (required). Calls `transporter.verify()` before sending. Sets `replyTo` to the sender's address.
