import { useState, FormEvent } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";

function getFriendlyError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("Invalid YouTube URL"))
    return "That doesn't look like a valid YouTube URL. Please try again.";
  if (
    message.includes("Failed to fetch video metadata") ||
    message.includes("400")
  )
    return "Couldn't find that video. Please check the URL and try again.";
  if (message.includes("Invalid YouTube metadata"))
    return "Couldn't read metadata for that video. It may be private or unavailable.";
  return "Something went wrong. Please try again.";
}

export default function VideoForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const processVideo = useAction(api.videos.processVideoUrl);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    setIsLoading(true);

    processVideo({ url: url.trim() })
      .then(() => setUrl(""))
      .catch((err) => toast.error(getFriendlyError(err)))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-white mb-2"
          >
            YouTube URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/G0kHv7qqqO1"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors"
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            "Generate Markdown"
          )}
        </button>
      </form>
    </div>
  );
}
