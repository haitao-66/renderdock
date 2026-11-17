import Fastify from "fastify";
import { render } from "./renderer.js";
import { authorize, checkRateLimit, checkQuota } from "./auth.js";
import { incrementUsage, currentMonth } from "./db.js";

const app = Fastify({
  logger: { level: "info" },
  bodyLimit: 5 * 1024 * 1024,
});

const SAFE_FILENAME = /[^a-zA-Z0-9._-]/g;

app.get("/healthz", async () => ({ ok: true, service: "renderdock-api" }));

app.get("/", async () => ({
  service: "RenderDock",
  status: "beta",
  docs: "https://renderdock.dev",
}));

app.post("/v1/render", async (req, reply) => {
  const auth = authorize(req);
  if (auth.error) {
    return reply.code(auth.status).send({ error: auth.error });
  }
  const { record } = auth;

  if (!checkRateLimit(record.key_hash)) {
    return reply.code(429).send({ error: "rate limit exceeded, try again shortly" });
  }

  const quota = checkQuota(record);
  if (!quota.ok) {
    return reply.code(402).send({ error: "monthly quota exceeded", used: quota.used, quota: quota.quota });
  }

  const body = req.body || {};
  const { format = "pdf", ...input } = body;
  if (format !== "pdf" && format !== "png") {
    return reply.code(400).send({ error: "format must be pdf or png" });
  }

  try {
    const output = await render(input, format);
    incrementUsage(record.id, currentMonth());

    reply.header("X-RenderDock-Quota", `${quota.used + 1}/${quota.quota}`);
    if (body.filename) {
      const safe = String(body.filename).replace(SAFE_FILENAME, "_");
      reply.header("Content-Disposition", `attachment; filename="${safe}.${format}"`);
    }
    return reply.type(format === "pdf" ? "application/pdf" : "image/png").send(output);
  } catch (err) {
    const badInput = [
      "invalid url",
      "only http and https are allowed",
      "urls with credentials are not allowed",
      "host did not resolve",
      "private network addresses are not allowed",
      "one of markdown, html, url or template is required",
      "markdown must be a string",
      "html must be a string",
      "url must be a string",
      "template must be a string",
      "data must be an object",
    ];
    if (badInput.includes(err.message)) {
      return reply.code(400).send({ error: err.message });
    }
    req.log.error({ err }, "render failed");
    return reply.code(500).send({ error: "render failed" });
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen({ port, host: "127.0.0.1" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`RenderDock API listening on :${port}`);
});
