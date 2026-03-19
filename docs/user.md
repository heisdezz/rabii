# User Guide

## Creating an Account

1. Go to `/auth/sign-up`
2. Enter your full name, email address, and a password (confirmed twice)
3. Submit — you'll be logged in and redirected to the app

## Logging In

1. Go to `/auth/login`
2. Enter your email and password
3. Your session is persisted via a cookie — you'll stay logged in across page refreshes

## Browsing Videos

**Home feed** (`/app`) — Shows the newest uploads in a paginated grid, with a hero carousel of the most recent videos at the top.

**Browser** (`/app/browser`) — Full video listing with:
- **Search** — Filter by title keyword
- **Sort** — Newest, Oldest, Title A–Z, Title Z–A
- Pagination (20 videos per page)

## Watching a Video

Click any video card to go to its watch page (`/app/watch/:id`). The page shows:
- The video player
- Title, description, tags
- Uploader info with a link to their creator page

## Saving Videos

On a video's watch page, use the bookmark button to save it to your collection. Saved videos appear under your profile at `/app/profile/saved`. To remove a saved video, hover its card and click the bookmark icon.

## Your Profile

Navigate to `/app/profile` (via the user icon in the navbar). Three tabs are available:

| Tab | Description |
|---|---|
| Profile | Your display name, username, and account details |
| Videos | All videos you've uploaded |
| Saved | Videos you've bookmarked |

## Creator Pages

Clicking a video's uploader name takes you to their creator page (`/app/actor/:id`), which lists all videos they've published.
