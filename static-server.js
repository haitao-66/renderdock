// Zero-dependency static server for the RenderDock landing page.
// Serves landing/, accepts waitlist signups into landing/waitlist.json.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "landing");
const WAITLIST = path.join(ROOT, "waitlist.json");
const PORT = Number(process.env.PORT) || 4321;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 32 * 1024) {
        reject(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end('{"ok":true}');
    return;
  }

  if (req.method === "POST" && url.pathname === "/waitlist") {
    try {
      const body = await readBody(req);
      const { email } = JSON.parse(body || "{}");
      if (typeof email !== "string" || !EMAIL_RE.test(email)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end('{"ok":false,"error":"invalid email"}');
        return;
      }
      const record = JSON.stringify({ email, ts: new Date().toISOString() }) + "\n";
      await fs.promises.appendFile(WAITLIST, record, "utf8");
      res.writeHead(200, { "content-type": "application/json" });
      res.end('{"ok":true}');
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end('{"ok":false,"error":"internal"}');
    }
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  let filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, "index.html")) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (err || !(st.isFile() || st.isDirectory())) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    if (st.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log("RenderDock landing on http://localhost:" + PORT);
});
