import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  ThemeIcon,
} from "@mantine/core";
import VideoForm from "./components/VideoForm";
import VideosList from "./components/VideosList";
import GitHubCorner from "./components/GitHubCorner";
import ConvexCorner from "./components/ConvexCorner";
import SparkleTitle from "./components/SparkleTitle";

const Logo = () => (
  <ThemeIcon size="xl" radius="md" color="red">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </ThemeIcon>
);

const HeroSection = () => (
  <Stack align="center" gap="md">
    <Group gap="sm">
      <Logo />
      <SparkleTitle order={1} fw={700}>
        Video to Markdown
      </SparkleTitle>
    </Group>
    <Text size="lg" c="dimmed" maw={600} ta="center">
      Simply paste a YouTube URL and get beautiful markdown code with
      thumbnails, perfect for documentation, READMEs, and blog posts.
    </Text>
  </Stack>
);

const VideosSection = () => (
  <Stack gap="md">
    <Title order={3}>Generated Videos</Title>
    <VideosList />
  </Stack>
);

export default function App() {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <ConvexCorner />
      <GitHubCorner />
      <Container size="xl" py="xl" style={{ position: "relative", zIndex: 1 }}>
        <Stack gap="xl">
          <HeroSection />
          <VideoForm />
          <VideosSection />
        </Stack>
      </Container>
    </div>
  );
}
