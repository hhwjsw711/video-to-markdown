import {
  Card,
  Image,
  Text,
  Code,
  CopyButton,
  ActionIcon,
  Tooltip,
  Badge,
  Stack,
  Box,
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
    <Card shadow="sm" radius="md" withBorder style={{ position: "relative" }}>
      <Badge
        size="xs"
        variant="filled"
        color="dark"
        style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
      >
        {timeAgo(video._creationTime)}
      </Badge>

      <Stack gap="sm">
        <Box>
          <Text size="xs" fw={500} c="dimmed" mb={4}>
            Preview
          </Text>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block" }}
          >
            <Image
              src={video.processedThumbnailUrl}
              alt={video.title}
              radius="sm"
            />
          </a>
        </Box>

        <Box>
          <Text size="xs" fw={500} c="dimmed" mb={4}>
            Markdown Code
          </Text>
          <Box style={{ position: "relative" }}>
            <Code
              block
              style={{
                fontSize: "var(--mantine-font-size-xs)",
                whiteSpace: "pre",
                overflowX: "auto",
                paddingRight: 40,
              }}
            >
              {markdownCode}
            </Code>
            <CopyButton value={markdownCode}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                  <ActionIcon
                    variant="subtle"
                    color={copied ? "green" : "gray"}
                    onClick={copy}
                    style={{ position: "absolute", top: 6, right: 6 }}
                    size="sm"
                  >
                    {copied ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
