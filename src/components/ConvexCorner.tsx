import { Tooltip } from "@mantine/core";

const ConvexCorner = () => (
  <Tooltip label="Made with Convex" position="right" withArrow>
    <a
      href="https://convex.dev"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        clipPath: "polygon(0 0, 0 100%, 100% 0)",
      }}
      aria-label="Made with Convex"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style={{ fill: "var(--mantine-color-dark-5)" }}
      >
        <path d="M0,0 L0,250 L250,0 Z" />
      </svg>
      <img
        src="/convex.svg"
        alt="Convex"
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          width: 32,
          height: 32,
        }}
      />
    </a>
  </Tooltip>
);

export default ConvexCorner;
