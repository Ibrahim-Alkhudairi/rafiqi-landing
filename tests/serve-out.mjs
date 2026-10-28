// Serves out/ the way public/.htaccess does on Bluehost: directories give
// index.html, a folder without its slash gets one (301), "/" goes to /ar/
// (302), anything missing gets 404.html with status 404.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const root = join(import.meta.dirname, "..", "out");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml" };

createServer(async (req, res) => {
  try {
    const send = async (file, status) => {
      const body = await readFile(file);
      res.writeHead(status, { "content-type": types[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    };
    const notFound = () => send(join(root, "404.html"), 404);
    const { pathname: raw } = new URL(req.url, "http://x");
    const pathname = decodeURIComponent(raw);
    if (pathname === "/") return res.writeHead(302, { location: "/ar/" }).end();
    const file = join(root, normalize(pathname));
    if (!(file + sep).startsWith(root + sep)) return await notFound();
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      if (!pathname.endsWith("/")) return res.writeHead(301, { location: raw + "/" }).end();
      return await send(join(file, "index.html"), 200).catch(notFound);
    }
    return await (info ? send(file, 200) : notFound());
  } catch {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(3123, "localhost");
