import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { routes, useRoute } from "../router";
import VideoCard from "./VideoCard";

const ITEMS_PER_PAGE = 21;

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-700 aspect-video rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
    <p className="text-gray-400">Add a YouTube URL above to get started!</p>
  </div>
);

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages: (number | "...")[] = [0];

  if (currentPage > 2) pages.push("...");

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages - 2, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) pages.push("...");

  pages.push(totalPages - 1);
  return pages;
}

export default function VideosList() {
  const route = useRoute();
  const page =
    route.name === "home" && route.params.page != null
      ? route.params.page
      : 0;

  const result = useQuery(api.videos.getVideos, {
    page,
    perPage: ITEMS_PER_PAGE,
  });

  if (result === undefined) return <LoadingSkeleton />;
  if (result.totalCount === 0) return <EmptyState />;

  const { videos, totalCount } = result;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <a
            {...routes.home({ page: Math.max(0, page - 1) }).link}
            className={`px-3 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 transition-colors ${
              page === 0
                ? "opacity-40 pointer-events-none"
                : "hover:bg-gray-700"
            }`}
          >
            Previous
          </a>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-gray-500">
                ...
              </span>
            ) : (
              <a
                key={p}
                {...routes.home({ page: p }).link}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  p === page
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {p + 1}
              </a>
            ),
          )}

          <a
            {...routes.home({ page: Math.min(totalPages - 1, page + 1) }).link}
            className={`px-3 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 transition-colors ${
              page >= totalPages - 1
                ? "opacity-40 pointer-events-none"
                : "hover:bg-gray-700"
            }`}
          >
            Next
          </a>
        </div>
      )}
    </div>
  );
}
