/**
 * This script simulates how the frontend will actually served (using a file server), which can be useful to test the SPA fallback and asset handling.
 */

import { createServer } from "http";
import { readFile } from "fs/promises";
import { extname, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const BUILD_DIR = join(__dirname, "build", "client");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

async function serveFile(filePath, res) {
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": mimeType });
    res.end(content);
    return true;
  } catch (error) {
    return false;
  }
}

const server = createServer(async (req, res) => {
  // Remove query string and decode URL
  const url = decodeURIComponent(req.url.split("?")[0]);

  // Try to serve the requested file
  const filePath = join(BUILD_DIR, url);
  if (await serveFile(filePath, res)) {
    console.log(`✓ ${url}`);
    return;
  }

  // If file not found, try index.html in that directory
  const indexPath = join(filePath, "index.html");
  if (await serveFile(indexPath, res)) {
    console.log(`✓ ${url} → index.html`);
    return;
  }

  // Fall back to __spa-fallback.html for client-side routing
  const fallbackPath = join(BUILD_DIR, "__spa-fallback.html");
  if (await serveFile(fallbackPath, res)) {
    console.log(`✓ ${url} → __spa-fallback.html`);
    return;
  }

  // If even fallback doesn't exist, return 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
  console.log(`✗ ${url} → 404`);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}/\n`);
});
