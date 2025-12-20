import { defineConfig, type Plugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgrPlugin from "vite-plugin-svgr";
import path from "node:path";
import { browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Dev-only plugin that exposes CLI commands via HTTP endpoints
// Only runs during `npm run dev`, never included in production build
function devApi(): Plugin {
  const backendDir = path.resolve(__dirname, "../dodeka/backend");

  const getJsonBody = (req: import("node:http").IncomingMessage) =>
    new Promise<Record<string, unknown>>((resolve) => {
      let body = "";
      req.on("data", (chunk: Buffer) => (body += chunk));
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({});
        }
      });
    });

  return {
    name: "dev-api",
    apply: "serve", // Only during dev, never in build
    configureServer(server) {
      // Add middleware directly (not as post-hook) so it runs before proxy
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/dev/")) {
          return next();
        }

        res.setHeader("Content-Type", "application/json");

        try {
          if (req.url === "/api/dev/reset" && req.method === "POST") {
            const { stdout, stderr } = await execAsync(
              "uv run backend-actions reset",
              { cwd: backendDir },
            );
            res.end(JSON.stringify({ ok: true, output: stdout, stderr }));
            return;
          }

          if (req.url === "/api/dev/prepare-user" && req.method === "POST") {
            const { email, firstname, lastname } = await getJsonBody(req);
            let cmd = `uv run backend-actions prepare-user "${email}"`;
            if (firstname) cmd += ` --firstname "${firstname}"`;
            if (lastname) cmd += ` --lastname "${lastname}"`;
            const { stdout, stderr } = await execAsync(cmd, { cwd: backendDir });
            res.end(JSON.stringify({ ok: true, output: stdout, stderr }));
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ ok: false, error: "Not found" }));
        } catch (error: unknown) {
          res.statusCode = 500;
          const message =
            error instanceof Error ? error.message : "Unknown error";
          res.end(JSON.stringify({ ok: false, error: message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    devApi(),
    reactRouter(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      $images: path.resolve(__dirname, "./src/images"),
      $components: path.resolve(__dirname, "./src/components"),
      $functions: path.resolve(__dirname, "./src/functions"),
      $content: path.resolve(__dirname, "./src/content"),
    },
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslist("baseline widely available")),
      cssModules: true,
      drafts: {
        customMedia: true,
      },
    },
  },
  build: {
    cssMinify: "lightningcss",
    target: "baseline-widely-available",
  },
});
