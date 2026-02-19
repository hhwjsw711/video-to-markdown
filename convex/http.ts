import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { ConvexError } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

const http = httpRouter();

// Handle CORS preflight
http.route({
  path: "/api/markdown",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }),
});

/**
 * POST /api/markdown
 * Body: { "url": "https://www.youtube.com/watch?v=..." }
 * Returns: { "markdown": "[![title](thumbnail)](url)" }
 *
 * If the video has already been processed, returns the cached result immediately.
 * If new, fetches metadata and generates the decorated thumbnail first.
 */
http.route({
  path: "/api/markdown",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("url" in body) ||
      typeof (body as { url: unknown }).url !== "string" ||
      !(body as { url: string }).url.trim()
    ) {
      return jsonResponse({ error: "Missing or invalid 'url' field" }, 400);
    }

    const url = (body as { url: string }).url.trim();

    let videoDocId: Id<"videos">;
    try {
      videoDocId = await ctx.runAction(api.videos.processVideoUrl, { url });
    } catch (err) {
      if (err instanceof ConvexError && err.data?.type === "DUPLICATE_VIDEO") {
        videoDocId = err.data.id as Id<"videos">;
      } else {
        const message =
          err instanceof Error ? err.message : "Failed to process video";
        const isClientError =
          message.includes("Invalid YouTube URL") ||
          message.includes("Failed to fetch video metadata") ||
          message.includes("Invalid YouTube metadata");
        return jsonResponse({ error: message }, isClientError ? 400 : 500);
      }
    }

    const video = await ctx.runQuery(api.videos.getVideoById, {
      id: videoDocId,
    });
    if (!video) return jsonResponse({ error: "Video not found" }, 500);

    const markdown = `[![${video.title}](${video.processedThumbnailUrl})](${video.url})`;

    return jsonResponse({ markdown, title: video.title, url: video.url });
  }),
});

export default http;
