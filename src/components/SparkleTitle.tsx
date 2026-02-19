import { Title, type TitleProps } from "@mantine/core";
import { useEffect, useRef, useCallback } from "react";

const SPARKLE_COLORS = ["#FFC700", "#FF6B6B", "#48DBFB", "#FF9FF3", "#FECA57"];
const SPARKLE_COUNT = 3;
const SPAWN_INTERVAL_MS = 600;

interface Sparkle {
  id: number;
  el: HTMLSpanElement;
  timeout: ReturnType<typeof setTimeout>;
}

function createSparkleEl(container: HTMLElement): Sparkle {
  const el = document.createElement("span");
  const size = Math.random() * 10 + 8;
  const color =
    SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];

  Object.assign(el.style, {
    position: "absolute",
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: "none",
    zIndex: "2",
    animation: "sparkle-spin 700ms ease forwards",
  });

  el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 160 160" fill="none">
    <path d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z" fill="${color}"/>
  </svg>`;

  container.appendChild(el);

  const id = Math.random();
  const timeout = setTimeout(() => {
    el.remove();
  }, 700);

  return { id, el, timeout };
}

interface SparkleTitleProps extends TitleProps {
  children: React.ReactNode;
}

export default function SparkleTitle({ children, ...props }: SparkleTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);

  const cleanup = useCallback(() => {
    for (const s of sparklesRef.current) {
      clearTimeout(s.timeout);
      s.el.remove();
    }
    sparklesRef.current = [];
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (sparklesRef.current.length > SPARKLE_COUNT * 2) {
        sparklesRef.current = sparklesRef.current.filter((s) =>
          container.contains(s.el),
        );
      }
      createSparkleEl(container);
    }, SPAWN_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [cleanup]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      <Title {...props} style={{ position: "relative", zIndex: 1, ...props.style }}>
        {children}
      </Title>
    </div>
  );
}
