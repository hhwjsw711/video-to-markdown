import {
  Card,
  Image,
  Text,
  Code,
  Badge,
  Button,
  Group,
  CopyButton,
} from "@mantine/core";
import { Doc } from "../../convex/_generated/dataModel";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface VideoCardProps {
  video: Doc<"videos">;
}

export default function VideoCard({ video }: VideoCardProps) {
  const markdownCode = `[![${video.title}](${video.processedThumbnailUrl})](${video.url})`;

  return (
    <Card shadow="md" padding="lg" radius="md" className="video-card">
      <Card.Section
        component="a"
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={video.processedThumbnailUrl}
          height={200}
          alt={video.title}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} lineClamp={1} style={{ flex: 1 }}>
          {video.title}
        </Text>
        <Badge color="gray" variant="light" size="sm">
          {timeAgo(video._creationTime)}
        </Badge>
      </Group>

      <Code
        block
        mt="xs"
        style={{
          fontSize: "var(--mantine-font-size-xs)",
          whiteSpace: "pre",
          overflowX: "auto",
          userSelect: "all",
        }}
      >
        {markdownCode}
      </Code>

      <CopyButton value={markdownCode}>
        {({ copied, copy }) => (
          <Button
            color={copied ? "green" : "red"}
            fullWidth
            mt="md"
            radius="md"
            onClick={copy}
          >
            {copied ? "Copied!" : "Copy Markdown to Clipboard"}
          </Button>
        )}
      </CopyButton>
    </Card>
  );
}
