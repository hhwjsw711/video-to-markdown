import { v, ConvexError } from "convex/values";
import { R2 } from "@convex-dev/r2";
import { components, api, internal as internalApi } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { convex } from "./fluent";
import {
  extractVideoId,
  getYoutubeVideoTitle,
  fetchYoutubeThumbnailWithFallback,
  hashThumbnail,
  addPlayIconToThumbnail,
  getDecoratedThumbnailUrl,
} from "./utils";

export const r2 = new R2(components.r2);

export const createVideo = convex
  .mutation()
  .input({
    url: v.string(),
    videoId: v.string(),
    title: v.string(),
    thumbnailKey: v.optional(v.string()),
    originalThumbnailUrl: v.string(),
    processedThumbnailUrl: v.string(),
    initialThumbnailHash: v.optional(v.string()),
  })
  .handler(async (ctx, args): Promise<Id<"videos">> => {
    const videoId = await ctx.db.insert("videos", {
      url: args.url,
      videoId: args.videoId,
      title: args.title,
      thumbnailKey: args.thumbnailKey,
      originalThumbnailUrl: args.originalThumbnailUrl,
      processedThumbnailUrl: args.processedThumbnailUrl,
      lastThumbnailHash: args.initialThumbnailHash,
      checkIntervalDays: 1,
      lastCheckedAt: Date.now(),
      nextCheckAt: undefined,
    });

    return videoId;
  })
  .public();

export const getVideoById = convex
  .query()
  .input({ id: v.id("videos") })
  .handler(async (ctx, { id }) => {
    return await ctx.db.get(id);
  })
  .public();

export const getVideoByYoutubeId = convex
  .query()
  .input({ videoId: v.string() })
  .handler(async (ctx, { videoId }) => {
    return await ctx.db
      .query("videos")
      .withIndex("by_videoId", (q) => q.eq("videoId", videoId))
      .unique();
  })
  .internal();

export const getVideos = convex
  .query()
  .input({
    page: v.optional(v.number()),
    perPage: v.optional(v.number()),
  })
  .handler(async (ctx, { page = 0, perPage = 21 }) => {
    const allVideos = await ctx.db.query("videos").order("desc").collect();
    const totalCount = allVideos.length;
    const start = page * perPage;
    const videos = allVideos.slice(start, start + perPage);
    return { videos, totalCount };
  })
  .public();

export const processVideoUrl = convex
  .action()
  .input({ url: v.string() })
  .handler(async (ctx, { url }): Promise<Id<"videos">> => {
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error("Invalid YouTube URL");

    const existing = await ctx.runQuery(internalApi.videos.getVideoByYoutubeId, { videoId });
    if (existing) throw new ConvexError({ type: "DUPLICATE_VIDEO", id: existing._id });

    const title = await getYoutubeVideoTitle(videoId);

    const { url: originalThumbnailUrl, buffer: thumbnailBuffer } =
      await fetchYoutubeThumbnailWithFallback(videoId);
    const initialThumbnailHash = await hashThumbnail(thumbnailBuffer);
    const decoratedBuffer = await addPlayIconToThumbnail(thumbnailBuffer);

    const shortId = crypto.randomUUID().substring(0, 8);
    const thumbnailKey = await r2.store(ctx, decoratedBuffer, {
      key: `${shortId}.jpg`,
      type: "image/jpeg",
    });

    const videoDocId = await ctx.runMutation(api.videos.createVideo, {
      url: `https://youtu.be/${videoId}`,
      videoId: videoId,
      title,
      thumbnailKey,
      originalThumbnailUrl,
      processedThumbnailUrl: getDecoratedThumbnailUrl(thumbnailKey),
      initialThumbnailHash,
    });

    await ctx.runMutation(internalApi.thumbnailMonitor.scheduleInitialCheck, {
      videoId: videoDocId,
    });

    return videoDocId;
  })
  .public();
