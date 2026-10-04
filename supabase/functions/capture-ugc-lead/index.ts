/// <reference lib="deno.ns" />

import { isIP } from "node:net";
import { timingSafeEqual } from "node:crypto";

const PUBLIC_KEY = "sb_publishable_0cuUdRflVAIh8FPdNisCIw_m6taqTzl";
const MAX_BODY_BYTES = 16_384;
const encoder = new TextEncoder();
const origins = new Set([
  "https://www.mehdikhoudali.com",
  "https://mehdikhoudali.com",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  ...(Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
]);
const choices = {
  role: ["Founder / business owner", "UGC creator", "Marketer", "Agency / freelancer", "Just exploring"],
  industry: ["E-commerce", "SaaS / tech", "Beauty / wellness", "Food / lifestyle", "Education", "Other"],
  teamSize: ["Just me", "2-5", "6-20", "21+"],
  goal: ["Create better content", "Find ad inspiration", "Grow my brand", "Improve client work"],
};

class InvalidRequest extends Error {}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InvalidRequest("Expected a JSON object.");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, max: number, required = false): string | null {
  if (value === undefined || value === null) {
    if (required) throw new InvalidRequest(`${field} is required.`);
    return null;
  }
  if (typeof value !== "string" || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
    throw new InvalidRequest(`${field} must be text of at most ${max} characters.`);
  }
  const normalized = value.trim();
  if (required && !normalized) throw new InvalidRequest(`${field} is required.`);
  return normalized || null;
}

function choice(data: Record<string, unknown>, field: keyof typeof choices): string {
  const value = text(data[field], field, 100, true)!;
  if (!choices[field].includes(value)) throw new InvalidRequest(`${field} is invalid.`);
  return value;
}

function url(value: unknown, field: string, hosts?: string[]): string | null {
  const input = text(value, field, 500);
  if (!input) return null;
  try {
    const parsed = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
    const host = parsed.hostname.toLowerCase();
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password ||
        !host.includes(".") || parsed.port ||
        (hosts && !hosts.some((allowed) => host === allowed || host === `www.${allowed}`))) {
      throw new Error();
    }
    parsed.hash = "";
    const normalized = parsed.toString();
    if (normalized.length > 500) throw new Error();
    return normalized;
  } catch {
    throw new InvalidRequest(`${field} must be a valid HTTP(S) URL${hosts ? " for its platform" : ""}.`);
  }
}

async function digest(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

function hex(value: Uint8Array): string {
  return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES || !req.body) {
    throw new InvalidRequest("Request body is missing or exceeds 16384 bytes.");
  }
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new InvalidRequest("Request body exceeds 16384 bytes.");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return object(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)));
  } catch (error) {
    if (error instanceof InvalidRequest) throw error;
    throw new InvalidRequest("Request body must be valid JSON.");
  } finally {
    reader.releaseLock();
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "apikey, content-type",
    "Access-Control-Expose-Headers": "Retry-After",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  };
  if (origins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  const respond = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });

  if (!origins.has(origin)) return respond(403, { error: "Origin is not allowed." });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") {
    headers.Allow = "POST, OPTIONS";
    return respond(405, { error: "Only POST is supported." });
  }

  try {
    // This public client identifier is not a secret or proof of a human visitor.
    if (!timingSafeEqual(await digest(req.headers.get("apikey") ?? ""), await digest(PUBLIC_KEY))) {
      return respond(401, { error: "Invalid API key." });
    }
    if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      throw new InvalidRequest("Content-Type must be application/json.");
    }
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!serviceKey || !supabaseUrl) throw new Error("Missing server configuration.");
    const rpc = async (name: string, body: unknown): Promise<boolean> => {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
        method: "POST",
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error("Database request failed.");
      const result = await response.json();
      if (typeof result !== "boolean") throw new Error("Unexpected database response.");
      return result;
    };

    // Cloudflare overwrites this at hosted ingress; X-Forwarded-For contains proxy hops.
    const forwarded = req.headers.get("cf-connecting-ip")?.trim() ?? "";
    const ip = isIP(forwarded) ? forwarded.toLowerCase() : "unknown";
    const hour = Math.floor(Date.now() / 3_600_000);
    const hmacKey = await crypto.subtle.importKey("raw", encoder.encode(serviceKey), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const ipHash = hex(new Uint8Array(await crypto.subtle.sign("HMAC", hmacKey, encoder.encode(`ugc-ip:${hour}:${ip}`))));
    if (!await rpc("consume_ugc_rate_limit", { p_ip_hash: ipHash })) {
      headers["Retry-After"] = String(3600 - Math.floor(Date.now() / 1000) % 3600);
      return respond(429, { error: "Too many requests. Please try again later." });
    }

    const body = await readJson(req);
    if (body.websiteTrap !== "") throw new InvalidRequest("Invalid submission.");
    const step = body.step;
    if (typeof step !== "number" || !Number.isInteger(step) || step < 1 || step > 4) {
      throw new InvalidRequest("step must be 1, 2, 3, or 4.");
    }
    if (typeof body.sessionToken !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.sessionToken)) {
      throw new InvalidRequest("sessionToken must be a UUID v4.");
    }
    const data = object(body.data);
    const lead: Record<string, string | boolean | null> = {
      name: text(data.name, "name", 100, true),
      email: text(data.email, "email", 254, true)!.toLowerCase(),
    };
    if ((lead.email as string).length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email as string)) {
      throw new InvalidRequest("email is invalid.");
    }
    if (step >= 2) {
      Object.assign(lead, {
        role: choice(data, "role"),
        project_name: text(data.projectName, "projectName", 150, true),
        project_description: text(data.projectDescription, "projectDescription", 1500, true),
        industry: choice(data, "industry"),
        team_size: choice(data, "teamSize"),
        website: url(data.website, "website"),
      });
    }
    if (step >= 3) {
      const social = data.socialLinks === undefined ? {} : object(data.socialLinks);
      lead.instagram = url(social.instagram, "instagram", ["instagram.com"]);
      lead.tiktok = url(social.tiktok, "tiktok", ["tiktok.com"]);
      lead.linkedin = url(social.linkedin, "linkedin", ["linkedin.com"]);
      lead.x = url(social.x, "x", ["x.com", "twitter.com"]);
    }
    if (step === 4) {
      Object.assign(lead, {
        goal: choice(data, "goal"),
        challenge: text(data.challenge, "challenge", 1500, true),
      });
    }
    const attribution = body.attribution === undefined ? {} : object(body.attribution);
    for (const field of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      lead[field] = text(attribution[field], field, 200);
    }
    const referrer = url(attribution.referrer, "referrer");
    lead.referrer = referrer ? new URL(referrer).origin : null;
    lead.timezone = text(body.timezone, "timezone", 100);
    if (lead.timezone) {
      try { new Intl.DateTimeFormat("en", { timeZone: lead.timezone }); }
      catch { throw new InvalidRequest("timezone must be a valid IANA timezone."); }
    }
    const sessionHash = hex(await digest(body.sessionToken.toLowerCase()));
    const completed = await rpc("save_ugc_lead", { p_session_token_hash: sessionHash, p_step: step, p_lead: lead });
    let libraryUrl: string | null = null;
    if (step === 4 && completed) {
      // Delivery is configured separately; never imply that an email was sent.
      const configured = Deno.env.get("UGC_LIBRARY_URL");
      if (configured) {
        try { libraryUrl = url(configured, "libraryUrl"); } catch { /* Invalid delivery config fails closed. */ }
      }
    }
    return respond(200, { ok: true, completed, libraryUrl });
  } catch (error) {
    if (error instanceof InvalidRequest) return respond(400, { error: error.message });
    return respond(500, { error: "Unable to save your submission. Please try again." });
  }
});
