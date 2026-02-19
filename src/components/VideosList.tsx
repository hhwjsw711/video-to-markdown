import { useQuery } from "convex/react";
import {
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Pagination,
  Center,
} from "@mantine/core";
import { api } from "../../convex/_generated/api";
import { routes, useRoute } from "../router";
import VideoCard from "./VideoCard";

const ITEMS_PER_PAGE = 21;

const LoadingSkeleton = () => (
  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
    {[...Array(6)].map((_, i) => (
      <Stack key={i} gap="sm">
        <Skeleton height={180} radius="md" />
        <Skeleton height={16} width="75%" radius="sm" />
        <Skeleton height={12} width="50%" radius="sm" />
      </Stack>
    ))}
  </SimpleGrid>
);

const EmptyState = () => (
  <Stack align="center" gap="md" py="xl">
    <ThemeIcon size={64} radius="xl" variant="light" color="gray">
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </ThemeIcon>
    <Text size="lg" fw={500}>
      No videos yet
    </Text>
    <Text c="dimmed">Add a YouTube URL above to get started!</Text>
  </Stack>
);

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

  return (
    <Stack gap="xl">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Center>
          <Pagination
            total={totalPages}
            value={page + 1}
            onChange={(newPage) => routes.home({ page: newPage - 1 }).push()}
            color="red"
            radius="md"
            withEdges
          />
        </Center>
      )}
    </Stack>
  );
}
