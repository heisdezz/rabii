# Rabii

A straightforward video platform — upload, discover, and share videos without algorithmic noise or clutter. Your videos, your stage.

## Features

- **Watch & Browse** — Paginated video feed with sort, title search, and booru-style tag filtering
- **Upload** — Drag-and-drop video upload with title, markdown description, tags, thumbnail picker, and auto resolution detection
- **Video Player** — YouTube-like player (react-tuby) with speed control, fullscreen, and keyboard shortcuts
- **Like / Dislike** — React to videos; counts stored in a dedicated likes collection
- **Save** — Bookmark videos to your saved collection
- **Tag Search** — Autocomplete tag search bar with multi-tag AND filtering
- **Similar Videos** — Sidebar of related videos matched by tags
- **Profile** — Edit your profile (name, bio, age, country) with rich-text about me; view your uploads and saved videos
- **Creator pages** — Browse videos by a specific creator
- **Auth** — Email/password registration and login with persistent sessions
- **Responsive UI** — Mobile-friendly navbar with slide-out drawer sidebar

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TanStack Start, TanStack Router, TanStack Query |
| UI | Tailwind CSS v4, DaisyUI v5 |
| Backend | PocketBase |
| Video Player | react-tuby |
| Forms | React Hook Form + Zod |
| Query Builder | @sergio9929/pb-query |
| Markdown | react-markdown, @uiw/react-md-editor |
| Icons | Tabler Icons |

## Getting Started

```bash
bun install
bun --bun run dev
```

## Environment Variables

Create a `.env` file in the project root. The PocketBase URL for the runtime client is read from `VITE_MAIN_URL`.

```env
# PocketBase instance URL (runtime)
VITE_MAIN_URL=https://your-pocketbase-instance.example.com

# Used by pocketbase-typegen for type generation
PB_TYPEGEN_URL=https://your-pocketbase-instance.example.com
PB_TYPEGEN_EMAIL=admin@example.com
PB_TYPEGEN_PASSWORD=yourpassword

# Or use a token instead:
# PB_TYPEGEN_TOKEN=eyJhbGci...
```

## Updating PocketBase Types

Whenever you change your PocketBase schema, regenerate `pocketbase-types.ts`:

```bash
bunx pocketbase-typegen --url $PB_TYPEGEN_URL --email $PB_TYPEGEN_EMAIL --password $PB_TYPEGEN_PASSWORD --out pocketbase-types.ts
```

Or with a token:

```bash
bunx pocketbase-typegen --url $PB_TYPEGEN_URL --token $PB_TYPEGEN_TOKEN --out pocketbase-types.ts
```

> Add to `package.json` for convenience:
> ```json
> "typegen": "pocketbase-typegen --url $PB_TYPEGEN_URL --email $PB_TYPEGEN_EMAIL --password $PB_TYPEGEN_PASSWORD --out pocketbase-types.ts"
> ```
> Then run with `bun run typegen`.

## Build

```bash
bun --bun run build
```
