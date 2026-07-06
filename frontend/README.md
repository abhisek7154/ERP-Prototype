# School ERP — Frontend

Next.js **App Router** application for the School ERP product: marketing site, auth screens, and the main **dashboard** with sidebar navigation, headers, and module placeholders.

## Requirements

- Node.js (LTS) and npm

## Commands

```bash
npm install
npm run dev      # development — http://localhost:3000
npm run build    # production build
npm run start    # run production build
npm run lint     # ESLint
```

## Stack

| Area | Packages |
|------|-----------|
| Framework | Next.js 16, React 19 |
| Styling | Tailwind CSS v4, `tailwind-merge`, `tw-animate-css` |
| UI | Radix UI primitives, shadcn-style components (`~/components/ui`), Lucide icons |
| Data / tables | TanStack Query, TanStack Table |
| Forms / validation | Zod |
| Misc | `next-themes`, Sonner, Recharts, Ant Design (antd), DnD Kit |

See `package.json` for pinned versions.

## Project layout

| Path | Purpose |
|------|---------|
| `src/app/(main)/` | Public marketing / landing routes |
| `src/app/(auth)/` | Login and auth layouts |
| `src/app/(dashboard)/` | ERP shell: layout, sidebar, header, `dashboard/[...slug]` placeholders |
| `src/components/ui/` | Shared primitives (button, sidebar, dialog, …) |
| `src/app/(dashboard)/_components/sidebar-nav.tsx` | Navigation tree and URLs |
| `src/app/(dashboard)/_components/nav-main.tsx` | Sidebar rendering and menu filter |
| `src/modules/` | Feature-oriented module stubs |

Agent notes for this Next major version live in **`AGENTS.md`**.

## Documentation

- **[Menu structure](../doc/menu-structure.md)** — sidebar IA and routes (generated from `sidebar-nav.tsx`).
- **[Features](../doc/features.md)** — product capabilities.
- **[Repository README](../README.md)** — monorepo overview including the NestJS backend.

## Deploy

Any Node-compatible host that supports Next.js (`next build` / `next start`). See [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying).
