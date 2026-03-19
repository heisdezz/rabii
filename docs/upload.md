# Video Upload Guide

## Uploading a Video

Navigate to `/app/upload` (or click the upload button in the navbar).

### Steps

1. **Drop or select a video file** — Drag a file onto the upload zone, or click it to open the file picker. Supported formats depend on your browser's native video support (MP4/WebM recommended).

2. **Fill in the details:**

   | Field | Required | Notes |
   |---|---|---|
   | Title | Yes | Shown on cards and the watch page |
   | Description | No | Supports Markdown formatting |
   | Tags | No | Comma-separated keywords for discoverability |
   | Thumbnail | No | Pick a frame from the video or upload a custom image |

3. **Submit** — The video and metadata are uploaded to PocketBase. You'll be redirected to the watch page once complete.

## Picking a Thumbnail

The thumbnail picker lets you:
- **Extract a frame** — Scrub through the video and capture the current frame as the thumbnail
- **Upload a custom image** — Use any image file instead

If no thumbnail is set, a placeholder icon is shown on video cards.

## Editing a Video

From your profile's Videos tab, hover a card and click the edit (pencil) icon. This opens `/app/upload/:id` where you can update the title, description, tags, and thumbnail. The video file itself cannot be replaced after upload.

## Deleting a Video

Video deletion is managed directly through the PocketBase admin panel at this time. There is no in-app delete option.

## Limits & Notes

- Video processing (resolution, duration metadata) is handled automatically after upload
- Large files may take time to upload depending on your connection and server configuration
- Keep PocketBase running locally or pointed at your hosted instance via the `POCKETBASE_URL` environment variable
