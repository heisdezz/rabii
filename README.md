# Rabii

A straightforward video platform — upload, discover, and share videos without algorithmic noise or clutter. Your videos, your stage.

## Features

- **Watch & Browse** — Paginated video feed with sort and search
- **Upload** — Drag-and-drop video upload with title, markdown description, tags, and custom thumbnail
- **Profile** — View your uploaded videos, saved bookmarks, and profile info
- **Save** — Bookmark videos to your saved collection
- **Creator pages** — Browse videos by a specific creator
- **Auth** — Email/password registration and login with persistent sessions

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TanStack Start, TanStack Router, TanStack Query |
| UI | Tailwind CSS v4, DaisyUI v5 |
| Backend | PocketBase |
| Forms | React Hook Form + Zod |
| Icons | Tabler Icons |

## Getting Started

```bash
bun install
bun --bun run dev
```

## Environment Variables

Create a `.env` file in the project root. These are only used for type generation — the PocketBase URL for the runtime client is set directly in `src/client/pb.ts`.

```env
# PocketBase instance URL (used by pocketbase-typegen)
PB_TYPEGEN_URL=https://your-pocketbase-instance.example.com

# Admin credentials (one of email/password OR token)
PB_TYPEGEN_EMAIL=admin@example.com
PB_TYPEGEN_PASSWORD=yourpassword

# Or use a token instead:
# PB_TYPEGEN_TOKEN=eyJhbGci...
```

## Updating PocketBase Types

Whenever you change your PocketBase schema, regenerate `pocketbase-types.ts` so TypeScript stays in sync:

```bash
bunx pocketbase-typegen --url $PB_TYPEGEN_URL --email $PB_TYPEGEN_EMAIL --password $PB_TYPEGEN_PASSWORD --out pocketbase-types.ts
```

Or with a token:

```bash
bunx pocketbase-typegen --url $PB_TYPEGEN_URL --token $PB_TYPEGEN_TOKEN --out pocketbase-types.ts
```

> To run this without typing the flags each time, add a script to `package.json`:
> ```json
> "typegen": "pocketbase-typegen --url $PB_TYPEGEN_URL --email $PB_TYPEGEN_EMAIL --password $PB_TYPEGEN_PASSWORD --out pocketbase-types.ts"
> ```
> Then run it with `bun run typegen`.

## Build

```bash
bun --bun run build
```

## Tests

```bash
bun --bun run test
```

## Docs

- [User Guide](./docs/user.md) — Account creation, browsing, and saving videos
- [Video Upload Guide](./docs/upload.md) — Uploading and managing your videos
