import { Modal, Text, Skeleton, Stack } from "@mantine/core";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import VideoCard from "./VideoCard";
import { routes, useRoute } from "../router";

interface VideoModalProps {
  videoId: string;
}

export default function VideoModal({ videoId }: VideoModalProps) {
  const route = useRoute();
  const page = route.name === "home" && route.params.page != null ? route.params.page : undefined;

  const video = useQuery(api.videos.getVideoById, {
    id: videoId as Id<"videos">,
  });

  const handleClose = () => routes.home({ page }).push();

  return (
    <Modal
      opened={true}
      onClose={handleClose}
      title="Video"
      size="md"
      centered
    >
      {video === undefined ? (
        <Stack gap="sm">
          <Skeleton height={200} radius="md" />
          <Skeleton height={16} width="75%" radius="sm" />
          <Skeleton height={60} radius="sm" />
          <Skeleton height={36} radius="md" />
        </Stack>
      ) : video === null ? (
        <Text c="dimmed">Video not found.</Text>
      ) : (
        <VideoCard video={video} />
      )}
    </Modal>
  );
}
