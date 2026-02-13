# BBLF - Personal Blog Platform

A modern, full-featured personal blog platform built with Next.js 16, React 19, Supabase, and Tailwind CSS.

## 📋 Todo List

- [x] Optimize project structure.
- [x] Configure a webhook to refresh the cache.
- [ ] Separate environment
- [ ] Automated Supabase configuration

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Storage**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)
- **Image Compression**: [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## 📋 Prerequisites

- Node.js 18+ (recommended: Node.js 24)
- npm, yarn, pnpm, or bun
- Supabase account ([sign up here](https://supabase.com/))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yuzi-beep/BBLF.git
```

### 2. Install dependencies

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Set up Supabase

1. Create a new project on [Supabase](https://app.supabase.com/)
2. Go to Project Settings > API to get your credentials
3. Run the SQL commands in `supabase/table.sql` to create required tables
4. Create a storage bucket named `images` with public access

### 4. Configure environment variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values
```

Required environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_PROJECT_ID`: Your Supabase project ID (for type generation)
- `DASHBOARD_SECRET_KEY`: A secure secret key for dashboard authentication

### 5. Generate TypeScript types (optional)

```bash
bun run gen:types
```

### 6. Run the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 7. Access the dashboard

Navigate to [http://localhost:3000/auth](http://localhost:3000/auth) and enter your `DASHBOARD_SECRET_KEY` to access the admin dashboard.

## 📦 Build for Production

```bash
bun run build
bun run start
```

## 🚢 Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yuzi-beep/BBLF.git)

### Manual Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel](https://vercel.com/) and sign in
3. Click "New Project" and import your repository
4. Configure environment variables:
   - Add all variables from `.env.example`
5. Click "Deploy"

### Environment Variables for Vercel

Make sure to add these in your Vercel project settings:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_PROJECT_ID=your_supabase_project_id
DASHBOARD_SECRET_KEY=your_secure_secret_key_here
```

## 📁 Project Structure

```
BBLF/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (index)/           # Public facing pages
│   │   ├── auth/              # Authentication page
│   │   └── dashboard/         # Admin dashboard
│   │       ├── posts/         # Posts management
│   │       ├── thoughts/      # Thoughts management
│   │       ├── event/         # Events management
│   │       └── images/        # Image gallery management
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── supabase/                  # Supabase SQL schemas
└── ...config files
```

## 🎨 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun run gen:types` - Generate TypeScript types from Supabase
- `bun run gen:icons` - Generate icon components from SVGs

### Maintenance Scripts (Interactive)

These scripts require explicit environment selection and interactive confirmation (`yes`) before execution.

- `bun run reset:db:dev` - Reset database with `.env.development`
- `bun run reset:db:prod` - Reset database with `.env.production`
- `bun run reset:webhook:dev` - Configure webhook with `.env.development`
- `bun run reset:webhook:prod` - Configure webhook with `.env.production`
- `bun run vercel:env:push:dev` - Push env vars to Vercel `development`
- `bun run vercel:env:push:prod` - Push env vars to Vercel `production`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
