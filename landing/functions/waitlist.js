// Cloudflare Pages Function: waitlist signup endpoint.
// Requires a KV namespace bound as WAITLIST in the Pages project settings.
export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.WAITLIST) {
    return new Response(JSON.stringify({ ok: false, error: "storage not configured" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  let email;
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    email = "";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "invalid email" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  await env.WAITLIST.put(
    crypto.randomUUID(),
    JSON.stringify({ email, ts: new Date().toISOString() })
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
