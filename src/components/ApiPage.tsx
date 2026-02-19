import {
  Stack,
  Title,
  Text,
  Code,
  Badge,
  Group,
  Paper,
  Table,
  Divider,
  CopyButton,
  Button,
  Anchor,
} from "@mantine/core";

const ENDPOINT = "https://quirky-squirrel-220.convex.site/api/markdown";

const REQUEST_EXAMPLE = JSON.stringify({ url: "https://youtu.be/dQw4w9WgXcQ" }, null, 2);

const CURL_EXAMPLE = `curl -X POST ${ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://youtu.be/dQw4w9WgXcQ"}'`;

const RESPONSE_EXAMPLE = JSON.stringify(
  {
    markdown:
      "[![Never Gonna Give You Up](https://thumbs.video-to-markdown.com/abc123.jpg)](https://youtu.be/dQw4w9WgXcQ)",
    title: "Never Gonna Give You Up",
    url: "https://youtu.be/dQw4w9WgXcQ",
  },
  null,
  2,
);

const ERROR_EXAMPLE = JSON.stringify({ error: "Invalid YouTube URL" }, null, 2);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="sm">
      <Title order={3} size="h4">
        {title}
      </Title>
      {children}
    </Stack>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <Paper withBorder radius="md" p={0} style={{ overflow: "hidden" }}>
      <Group justify="space-between" px="md" py="xs" bg="dark.8">
        <Text size="xs" c="dimmed" ff="monospace">
          {language}
        </Text>
        <CopyButton value={code}>
          {({ copied, copy }) => (
            <Button size="xs" variant="subtle" color={copied ? "green" : "gray"} onClick={copy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
        </CopyButton>
      </Group>
      <Divider />
      <Code block p="md" style={{ borderRadius: 0, background: "transparent" }}>
        {code}
      </Code>
    </Paper>
  );
}

export default function ApiPage() {
  return (
    <Stack gap="xl" maw={760} mx="auto">
      <Stack gap="xs">
        <Title order={2}>Public API</Title>
        <Text c="dimmed">
          Convert any YouTube URL to markdown programmatically. Videos are processed once and
          cached, so repeated calls for the same URL are instant.
        </Text>
      </Stack>

      <Divider />

      <Section title="Endpoint">
        <Group gap="sm" align="center">
          <Badge color="green" size="lg" radius="sm" variant="filled">
            POST
          </Badge>
          <Code style={{ fontSize: "var(--mantine-font-size-sm)", flex: 1 }}>{ENDPOINT}</Code>
          <CopyButton value={ENDPOINT}>
            {({ copied, copy }) => (
              <Button size="xs" variant="light" color={copied ? "green" : "gray"} onClick={copy}>
                {copied ? "Copied!" : "Copy URL"}
              </Button>
            )}
          </CopyButton>
        </Group>
      </Section>

      <Section title="Request">
        <Text size="sm" c="dimmed">
          Send a JSON body with the YouTube URL. Accepts standard watch URLs, short{" "}
          <Code>youtu.be</Code> links, and embed URLs.
        </Text>
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Field</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Required</Table.Th>
              <Table.Th>Description</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Code>url</Code>
              </Table.Td>
              <Table.Td>string</Table.Td>
              <Table.Td>Yes</Table.Td>
              <Table.Td>YouTube video URL</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <CodeBlock code={REQUEST_EXAMPLE} language="json" />
      </Section>

      <Section title="Response">
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Field</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Description</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Code>markdown</Code>
              </Table.Td>
              <Table.Td>string</Table.Td>
              <Table.Td>Ready-to-paste markdown image link with play button thumbnail</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Code>title</Code>
              </Table.Td>
              <Table.Td>string</Table.Td>
              <Table.Td>Video title from YouTube</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Code>url</Code>
              </Table.Td>
              <Table.Td>string</Table.Td>
              <Table.Td>Canonical short URL for the video</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <CodeBlock code={RESPONSE_EXAMPLE} language="json" />
      </Section>

      <Section title="Example">
        <CodeBlock code={CURL_EXAMPLE} language="bash" />
      </Section>

      <Section title="Errors">
        <Text size="sm" c="dimmed">
          Errors return a non-2xx status with a JSON body containing an <Code>error</Code> field.
        </Text>
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Status</Table.Th>
              <Table.Th>Cause</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[
              ["400", "Missing or invalid URL, or video is private/unavailable"],
              ["500", "Unexpected server error"],
            ].map(([status, cause]) => (
              <Table.Tr key={status}>
                <Table.Td>
                  <Code>{status}</Code>
                </Table.Td>
                <Table.Td>{cause}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <CodeBlock code={ERROR_EXAMPLE} language="json" />
      </Section>

      <Divider />

      <Text size="sm" c="dimmed">
        Built on{" "}
        <Anchor href="https://convex.dev" target="_blank" rel="noopener noreferrer">
          Convex
        </Anchor>{" "}
        HTTP actions. Thumbnails are hosted on Cloudflare R2 and served via{" "}
        <Code>thumbs.video-to-markdown.com</Code>.
      </Text>
    </Stack>
  );
}
