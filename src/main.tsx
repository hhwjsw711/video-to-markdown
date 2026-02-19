import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouteProvider } from "./router";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  primaryColor: "red",
  defaultRadius: "md",
});

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-center" />
      <RouteProvider>
        <ConvexProvider client={convex}>
          <App />
        </ConvexProvider>
      </RouteProvider>
    </MantineProvider>
  </StrictMode>,
);
