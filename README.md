# Video to Markdown Generator

A simple web application that converts YouTube videos into markdown-friendly format with thumbnails and play buttons.

So that it looks somthing like this:

[![I spent 10 months making the BEST Christmas lights display & simulator](https://thumbs.thumbnailrater.com/4fdf6bac.jpg)](https://youtu.be/lzWzY74JOuI)

## What it does

This tool allows you to:
1. **Input a YouTube URL** - Simply paste any YouTube video URL
2. **Generate a thumbnail with play button** - Automatically fetches the video thumbnail and overlays a play button icon
3. **Get markdown code** - Provides ready-to-use markdown code that displays the thumbnail image and links to the video

Perfect for documentation, README files, blog posts, or anywhere you want to embed YouTube videos in markdown format while showing an attractive thumbnail preview.

## Public API

You can generate markdown programmatically via a simple HTTP POST request - no API key required.

**Endpoint:** `POST https://quirky-squirrel-220.convex.site/api/markdown`

```bash
curl -X POST https://quirky-squirrel-220.convex.site/api/markdown \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtu.be/dQw4w9WgXcQ"}'
```

**Response:**

```json
{
  "markdown": "[![Never Gonna Give You Up](https://thumbs.thumbnailrater.com/abc123.jpg)](https://youtu.be/dQw4w9WgXcQ)",
  "title": "Never Gonna Give You Up",
  "url": "https://youtu.be/dQw4w9WgXcQ"
}
```

If the video has already been processed, the result is returned from cache instantly. If new, it fetches metadata and generates the decorated thumbnail before responding.

Full API documentation is available at [vid2md.thumbnailrater.com/api](https://vid2md.thumbnailrater.com/api).

## Learn More

Built with [Convex](https://convex.dev/) - the full-stack TypeScript platform that makes building apps delightfully simple.
