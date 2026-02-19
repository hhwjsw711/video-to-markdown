import { useState, FormEvent } from "react";
import { useAction } from "convex/react";
import { notifications } from "@mantine/notifications";
import { TextInput, Button, Stack } from "@mantine/core";
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
      .catch((err) =>
        notifications.show({
          title: "Error",
          message: getFriendlyError(err),
          color: "red",
        }),
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
      <Stack gap="sm">
        <TextInput
          label="YouTube URL"
          placeholder="https://youtu.be/G0kHv7qqqO1"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
          disabled={isLoading}
          required
          size="md"
        />
        <Button
          type="submit"
          fullWidth
          size="md"
          color="red"
          loading={isLoading}
          disabled={!url.trim()}
        >
          Generate Markdown
        </Button>
      </Stack>
    </form>
  );
}
