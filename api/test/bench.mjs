// Render performance benchmark: sequential and concurrent renders.
// Run: node test/bench.mjs <api-key> [iterations]
// Results inform VPS sizing and honest performance claims.
const KEY = process.argv[2] || process.env.RENDERDOCK_API_KEY;
const N = Number(process.argv[3]) || 12;
if (!KEY) {
  console.error("usage: node test/bench.mjs <api-key> [iterations]");
  process.exit(2);
}

const BASE = "http://127.0.0.1:8787";
const MARKDOWN = `# Benchmark document\n\nParagraph ${"text ".repeat(200)}\n\n| A | B |\n| - | - |\n| 1 | 2 |\n| 3 | 4 |\n\n> quote\n\n- item one\n- item two\n\nMore ${"text ".repeat(150)}`;

async function renderOnce(i) {
  const t0 = performance.now();
  const res = await fetch(`${BASE}/v1/render`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ markdown: MARKDOWN, format: "pdf" }),
  });
  if (!res.ok) throw new Error(`render ${i} failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return { ms: performance.now() - t0, bytes: buf.length };
}

function stats(msList) {
  const sorted = [...msList].sort((a, b) => a - b);
  const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
  return { min: q(0), p50: q(0.5), p95: q(0.95), max: q(1), avg: msList.reduce((a, b) => a + b, 0) / msList.length };
}

// sequential (cold-ish start first)
const seq = [];
for (let i = 0; i < Math.max(2, Math.floor(N / 3)); i++) {
  const r = await renderOnce(i);
  seq.push(r.ms);
  console.log(`seq ${i + 1}: ${r.ms.toFixed(0)}ms (${r.bytes} bytes)`);
}

// concurrent (5 at a time)
const conc = [];
const concurrency = 5;
for (let batch = 0; batch * concurrency < N; batch++) {
  const t0 = performance.now();
  const results = await Promise.all(
    Array.from({ length: Math.min(concurrency, N - batch * concurrency) }, (_, k) =>
      renderOnce(`c${batch}-${k}`)
    )
  );
  conc.push(...results.map((r) => r.ms));
  console.log(`batch ${batch + 1}: ${results.length} renders in ${(performance.now() - t0).toFixed(0)}ms wall`);
}

console.log("\nsequential ms:", stats(seq));
console.log("concurrent ms:", stats(conc));
