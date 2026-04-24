# Invoice Management App

A fully responsive invoice management application built with React, React Router, and Tailwind CSS v4. This was built as part of the HNG Frontend Wizards Stage 2 task.

**[View Live Demo](https://invoice-mgmt-odielijah.netlify.app/)**

## 🎬 Project Preview
https://github.com/user-attachments/assets/dcf3aa71-2460-4fb9-8ac5-f61b3552005c


---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://github.com/odielijah/invoice-mgmt-app.git
cd invoice-app
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Features

- **Create invoices** — fill out the full invoice form and save as Pending or Draft
- **View invoices** — browse the full invoice list or click through to a detailed view
- **Edit invoices** — update any invoice field via the slide-in form drawer
- **Delete invoices** — remove an invoice with a confirmation modal before deletion
- **Mark as Paid** — transition Pending invoices to Paid status
- **Save as Draft** — save incomplete invoices to finish later
- **Filter by status** — checkbox dropdown to filter by Draft, Pending, or Paid
- **Dark / light mode** — toggle with persistence via localStorage
- **Data persistence** — all invoice state saved to localStorage across page reloads
- **Fully responsive** — mobile (320px+), tablet (768px+), desktop (1024px+)

---

## Architecture

```
src/
├── assets/
│   ├── icons/          # SVG icon components (ArrowDown, ArrowRight, Plus, Moon, Sun)
│   └── images/         # Profile avatar
├── components/
│   ├── DeleteModal.jsx  # Confirmation modal with ESC key + focus trap support
│   ├── InvoiceForm.jsx  # Slide-in drawer form for create and edit
│   ├── InvoiceItem.jsx  # Invoice list card (responsive mobile/desktop layouts)
│   ├── NoInvoices.jsx   # Empty state illustration
│   ├── Sidebar.jsx      # Navigation — top bar on mobile, left sidebar on desktop
│   └── Status.jsx       # Status badge (Paid / Pending / Draft)
├── data/
│   └── invoices.js      # Seed data (initial invoices loaded if localStorage is empty)
├── pages/
│   ├── Invoices.jsx     # Invoice list page with filter dropdown
│   └── InvoiceDetails.jsx # Invoice detail page with action buttons
├── App.jsx              # Root — state management, routing, theme, localStorage
├── index.css            # Tailwind v4 config, custom theme tokens, typography
└── main.jsx
```

### State management

All invoice state lives in `App.jsx` as a single `invoices` array. The four state operations — `addInvoice`, `updateInvoice`, `deleteInvoice`, and `markAsPaid` — are passed down as props. This keeps the data flow simple and predictable without needing a context or external store.

### Data persistence

Two `useEffect` hooks in `App.jsx` handle persistence:
- Invoices are saved to `localStorage` under the key `invoice-app-data` on every state change
- On mount, invoices are loaded from localStorage (falling back to seed data if empty)
- Theme preference is stored separately under the key `theme`

### Dark mode

Tailwind v4 dark mode is configured with `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`. The `isDark` state in `App.jsx` toggles the `dark` class on `document.documentElement`, which triggers all `dark:` utility classes globally.

---

## Trade-offs

- **No backend** — data is persisted in localStorage rather than a database. This means data is per-browser and not shared across devices. A Node/Express or Next.js API route could be added to make it persistent server-side.
- **Props drilling over Context** — state is passed as props through two levels (App → Pages → Form). For this app size it's clear and maintainable; a larger app would benefit from React Context or Zustand.
- **Seed data on first load** — if localStorage is empty the app pre-populates with sample invoices so reviewers can see the app in a useful state immediately.
- **No optimistic UI** — edits and deletes update state synchronously since there's no async API layer. This would need to change with a real backend.

---

## Accessibility

- Semantic HTML throughout — `<header>`, `<aside>`, `<main>`, `<section>`, `<label>`, `<button>`
- All form fields have associated `<label>` elements
- Delete modal uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`
- Modal closes on `Escape` key via a `keydown` event listener
- Filter dropdown closes on outside click via a `mousedown` listener
- Status badges use sufficient colour contrast for WCAG AA compliance in both light and dark modes
- Interactive elements all have visible hover and focus states
- Images have descriptive `alt` attributes

---

## Improvements Beyond Requirements

- **Seed data fallback** — new users see real invoice examples rather than a blank app
- **Responsive item rows in detail view** — mobile shows `qty x price → total` format instead of a 4-column table that would overflow on small screens
- **Fixed bottom action bar on mobile** — Edit / Delete / Mark as Paid float above the content on mobile, matching the Figma design exactly
- **Arrow rotation on filter toggle** — the chevron rotates 180° when the dropdown is open for clear affordance
- **`flex-shrink-0` on header actions** — prevents the Filter + New button row from collapsing at very narrow viewports
