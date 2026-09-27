# CampusFind — Campus Lost & Found

## Overview

CampusFind is a complete campus lost-and-found platform that helps students and staff report, search, and recover lost and found items on campus. Built as a polished, functional frontend prototype, it demonstrates real-world UI/UX patterns, responsive design, and clean code architecture.

## Problem Statement

Every campus faces the same problem: students lose belongings (laptops, ID cards, books, accessories) and others find them, but there's no central platform to connect losers with finders. Items sit in lost-and-found boxes unclaimed while owners search in vain.

## Solution

CampusFind provides a single platform where anyone can:
- Report a lost item with full details
- Report a found item to help reunite it with its owner
- Search and filter through all reported items
- View item details and contact the reporter
- Claim found items
- Track and manage their own reports
- See analytics and smart match suggestions

## Features

- **Home Dashboard** — Hero search, live statistics, category browsing, recent items
- **Browse Items** — Full-text search, multi-filter (type, category, location, date, status), sorting
- **Report Lost/Found** — Comprehensive forms with inline validation, image preview, all fields
- **Item Details** — Full item info, contact reporter, claim item, mark as claimed, location view
- **Smart Matching** — Suggests possible matches between lost and found items based on category, location, brand, color, and date proximity
- **My Reports** — Tabbed view (All/Lost/Found/Claimed) with edit, delete, and mark-claimed actions
- **Dashboard** — Analytics with charts: category distribution (pie), lost vs found by location (bar), reports over time (line), items by location (bar), recent activity feed
- **Notifications** — In-app notification system with dropdown and dedicated page
- **Dark Mode** — Full light/dark theme with persisted preference
- **Responsive Design** — Works from 320px mobile to 1440px+ desktop with hamburger menu, mobile filter drawer, and adaptive layouts
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, focus states, alt text
- **LocalStorage Persistence** — All items, notifications, and theme settings persist across refreshes
- **Toast Notifications** — Success, error, and warning toasts for user feedback
- **Confirmation Modals** — Reusable modals for delete, claim, and mark-claimed actions
- **404 Page** — Custom not-found page

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling and design system
- **React Router** — Client-side routing
- **Recharts** — Data visualization / charts
- **Lucide React** — Icon library
- **LocalStorage** — Client-side data persistence

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   ├── SearchBar.tsx
│   ├── ItemCard.tsx
│   ├── ItemGrid.tsx
│   ├── FilterPanel.tsx
│   ├── SortDropdown.tsx
│   ├── StatusBadge.tsx
│   ├── ItemForm.tsx
│   ├── ClaimModal.tsx
│   ├── ConfirmModal.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   ├── EmptyState.tsx
│   ├── StatCard.tsx
│   └── NotificationDropdown.tsx
├── pages/             # Route-level page components
│   ├── Home.tsx
│   ├── BrowseItems.tsx
│   ├── ReportLost.tsx
│   ├── ReportFound.tsx
│   ├── ItemDetails.tsx
│   ├── MyReports.tsx
│   ├── Dashboard.tsx
│   ├── Notifications.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── context/           # React context providers
│   └── AppContext.tsx
├── data/              # Constants and demo data
│   ├── constants.ts
│   └── demoData.ts
├── utils/             # Utility functions
│   ├── storage.ts
│   ├── filters.ts
│   ├── matching.ts
│   ├── validation.ts
│   ├── dateUtils.ts
│   └── stats.ts
├── types.ts           # TypeScript type definitions
├── App.tsx            # Root component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles and design tokens
```

## Installation

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

The build output will be in the `dist/` directory.

## Deployment

### Vercel

1. Push your repository to GitHub/GitLab
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel will auto-detect Vite — settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. The `vercel.json` file in the project root handles SPA routing fallback

### Netlify

1. Push your repository to GitHub/GitLab
2. Go to [netlify.com](https://netlify.com) and import the repository
3. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. The `public/_redirects` file handles SPA routing fallback (`/* /index.html 200`)

## Future Improvements

- **Real authentication** — Supabase Auth for user accounts and secure sessions
- **Backend/database** — Persistent server-side storage with Supabase Postgres
- **Email notifications** — Automatic email alerts when matches are found
- **Real-time matching** — WebSocket-based instant match notifications
- **Campus map integration** — Interactive map for precise item locations
- **QR-based claim verification** — Secure claim verification using QR codes
- **Admin moderation** — Report moderation and admin dashboard for staff
- **Push notifications** — Browser push notifications for mobile and desktop
- **Image upload** — Direct photo upload instead of URL-based images
- **Multi-campus support** — Expand beyond a single campus

## Demo User

The app uses a demo profile (no authentication required):
- **Name:** Campus Admin
- **Email:** admin@campusfind.demo
- **Department:** Computer Science
- **Year:** 2nd Year

## License

This project is a prototype built for evaluation purposes.
