import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import VideoForm from "./components/VideoForm";
import VideosList from "./components/VideosList";
import VideoModal from "./components/VideoModal";
import ApiPage from "./components/ApiPage";
import GitHubCorner from "./components/GitHubCorner";
import ConvexCorner from "./components/ConvexCorner";
import SparkleTitle from "./components/SparkleTitle";
import { routes, useRoute } from "./router";

const Logo = () => (
  <ThemeIcon size="xl" radius="md" color="red">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </ThemeIcon>
);

const Nav = () => {
  const route = useRoute();
  const isApi = route.name === "api";
  return (
    <Group gap="lg" justify="center">
      <Anchor
        href={routes.home({}).href}
        onClick={(e) => { e.preventDefault(); routes.home({}).push(); }}
        fw={isApi ? 400 : 600}
        c={isApi ? "dimmed" : "red"}
        underline="never"
      >
        Generator
      </Anchor>
      <Anchor
        href={routes.api().href}
        onClick={(e) => { e.preventDefault(); routes.api().push(); }}
        fw={isApi ? 600 : 400}
        c={isApi ? "red" : "dimmed"}
        underline="never"
      >
        API
      </Anchor>
    </Group>
  );
};

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
    <Nav />
  </Stack>
);

const VideosSection = () => (
  <Stack gap="md">
    <Title order={3}>Generated Videos</Title>
    <VideosList />
  </Stack>
);

export default function App() {
  const route = useRoute();
  const videoParam = route.name === "home" ? route.params.video : undefined;
  const isApi = route.name === "api";

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <ConvexCorner />
      <GitHubCorner />
      <Container size="xl" py="xl" style={{ position: "relative", zIndex: 1 }}>
        <Stack gap="xl">
          <HeroSection />
          {isApi ? (
            <ApiPage />
          ) : (
            <>
              <VideoForm />
              <VideosSection />
            </>
          )}
        </Stack>
      </Container>
      {videoParam && <VideoModal videoId={videoParam} />}
    </div>
  );
}
