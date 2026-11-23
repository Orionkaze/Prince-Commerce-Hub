# PRIME COMMERCE HUB — Official Website

A production-grade, responsive website for **PRIME COMMERCE HUB**, a premier Accountancy coaching institute founded by **Parvesh Kumar** (Founder & Lead Educator, 30+ years teaching experience). Built with **Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Embla Carousel, and Lucide Icons**.

---

## 🏛️ Brand & Institute Information

- **Brand Name:** PRIME COMMERCE HUB
- **Founder & Lead Educator:** Parvesh Kumar
- **Teaching Experience:** 30+ Years Teaching Excellence
- **Subject:** Accountancy (Class 11 & Class 12 Commerce)
- **Positioning:** Conceptual clarity, personalized student guidance, structured learning, and academic excellence.

---

## 🎨 Design System & Tokens

- **Font Family:** `Plus Jakarta Sans` (weights 400, 500, 600, 700, 800)
- **Type Scale:**
  - Hero H1: `text-[44px] sm:text-[60px] lg:text-[74px] font-extrabold tracking-[-0.035em] leading-[1.03]`
  - Section H2: `text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08]`
  - Card/Step H3: `text-[20px] lg:text-[24px] font-bold tracking-[-0.02em] leading-[1.25]`
  - Eyebrow Tag: `inline-block bg-[#FDE047] text-[#16141B] text-[11px] font-extrabold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[4px]`
- **Color Palette:**
  - Primary Canvas: `#FFFFFF`
  - Soft Neutral Surface: `#F7F7F9`
  - Soft Lavender Accent Card: `#ECE8FA`
  - Brand Royal Purple: `#5B32D6` (hover `#4A23C2`)
  - Hero Gradient: `linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)`
  - Deep Night Indigo: `#1D1136`
  - Obsidian Charcoal: `#16141B`
  - Highlighter Yellow: `#FDE047` / `#FACC15`

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎓 Learning Management System (LMS)

PRIME COMMERCE HUB includes a production-grade, enterprise-ready LMS designed specifically for Class 11 & Class 12 Commerce Accountancy students and institute administrators.

### Core Architecture & Tech Stack

| Responsibility | Technology | Description |
|---|---|---|
| **Frontend & SSR** | Next.js 16 (App Router), React 19 | Turbopack compilation, Cache Components, Partial Prerendering |
| **Styling & UI** | Tailwind CSS 4, Framer Motion, Lucide | Responsive design adhering to Institute tokens (`#5B32D6`, `#16141B`, `#FDE047`) |
| **Authentication** | Supabase Auth | Google OAuth + Email password with role-based session verification |
| **Database & Security** | Supabase PostgreSQL with RLS | Row-level security for courses, modules, lectures, enrollments, purchases |
| **Storage & Streaming** | Cloudflare R2 via `@aws-sdk/client-s3` | Presigned direct uploads (PUT & multipart) and short-lived signed playback URLs |
| **Payment Gateway** | Razorpay | Server-side order creation, HMAC-SHA256 signature verification, idempotent webhooks |
| **Transactional Email** | Resend | Branded HTML email templates for purchase receipts, enrollments, and admin alerts |

---

### Route Map

#### 👨‍🎓 Student Portal
- `/courses`: Public catalog with search, class filtering (Class 11/12), price sorting, and Razorpay buy button.
- `/courses/[slug]`: Course overview, instructor bio, collapsible curriculum, and free preview video player.
- `/dashboard`: Personalized student dashboard with learning progress KPIs, continue learning cards, and order history.
- `/my-courses`: Registered course library with quick access to course learning interfaces.
- `/learn/[courseId]/[lectureId]`: HTML5 video player with seek support, resume playback, auto-save progress, previous/next navigation, downloadable PDF resources, collapsible module sidebar, and completion celebration.
- `/purchase/success`: Payment verification outcome with transaction details and immediate course access.
- `/purchase/failed`: Payment failure resolution page with retry actions.
- `/profile`: Student account overview, credentials, and sign-out.

#### 🛠️ Admin Portal (Protected via `requireAdmin()`)
- `/admin`: Administrative overview with real-time KPI metrics, active courses count, student count, total enrollments, and verified revenue.
- `/admin/courses`: Course catalog management with status filters (`PUBLISHED`, `DRAFT`, `ARCHIVED`) and class filtering.
- `/admin/courses/new`: Course creation form with Cloudflare R2 thumbnail uploader.
- `/admin/courses/[courseId]`: Interactive curriculum builder with module creation, reordering, lecture editor, and R2 video upload.
- `/admin/students`: Enrolled student directory, lecture progress inspection, and manual grant/revoke access modal with audit logging.
- `/admin/orders`: Complete ledger of Razorpay transactions and student purchases.
- `/admin/settings`: Live system connectivity diagnostics for Supabase, Cloudflare R2, Razorpay, and Resend.

---

### Database Setup & Migrations

The database migration is located at:
`supabase/migrations/20261123_complete_lms_schema.sql`

To apply the schema:
1. Open your Supabase Project Dashboard (`https://supabase.com/dashboard/project/<your-project-id>`).
2. Navigate to the **SQL Editor**.
3. Paste the contents of `supabase/migrations/20261123_complete_lms_schema.sql` and run the script.
4. The script creates all necessary tables (`profiles`, `user_roles`, `courses`, `course_modules`, `lectures`, `lecture_resources`, `enrollments`, `payments`, `purchases`, `lecture_progress`, `webhook_events`, `email_logs`, `admin_audit_logs`), enables RLS, creates helper security definer functions (`is_admin`, `has_course_access`, `has_lecture_access`, `has_resource_access`), and automatically grants admin permissions to `parveshdhiman1900@gmail.com` and `akshit2046@gmail.com`.

---

### Cloudflare R2 Configuration

1. Log in to the Cloudflare Dashboard and navigate to **R2**.
2. Verify the target bucket name is set to `prime-commerce-storage`.
3. Add the following CORS configuration to allow direct browser-to-R2 uploads:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD", "POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
4. Generate an R2 API Token with **Object Read & Write** permissions and configure `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME` in `.env.local`.

---

### Razorpay Webhook Configuration

1. In the Razorpay Dashboard, navigate to **Settings > Webhooks**.
2. Add a new webhook with URL: `https://<your-domain>/api/webhooks/razorpay`.
3. Set your webhook secret and add it to `RAZORPAY_WEBHOOK_SECRET` in `.env.local`.
4. Subscribe to the following active events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`

