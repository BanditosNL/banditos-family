// Supabase Edge Function: push-notification
// Deploy met: supabase functions deploy push-notification

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VAPID_PUBLIC_KEY  = "BMSHAJ0wmDJp2bdR6wJc6q2v5WejYQA7vi3uQ8FMmk1TP4W5vY75okLCsR--FJ9dwWrgLSc_GTPN7WM1zfEKdYg";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT     = "mailto:banditos@family.app";

// Base64url helpers
function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
}

function uint8ArrayToBase64url(arr) {
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Create VAPID JWT
async function createVapidJWT(audience) {
  const header  = { alg: "ES256", typ: "JWT" };
  const payload = { aud: audience, exp: Math.floor(Date.now()/1000) + 12*3600, sub: VAPID_SUBJECT };

  const enc = new TextEncoder();
  const headerB64  = uint8ArrayToBase64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const keyData = base64urlToUint8Array(VAPID_PRIVATE_KEY);
  const key = await crypto.subtle.importKey(
    "pkcs8", keyData,
    { name: "ECDSA", namedCurve: "P-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    enc.encode(signingInput)
  );
  return `${signingInput}.${uint8ArrayToBase64url(new Uint8Array(sig))}`;
}

// Send a single push message
async function sendPush(subscription, payload) {
  const { endpoint, keys } = subscription;
  const origin   = new URL(endpoint).origin;
  const jwt      = await createVapidJWT(origin);
  const authHeader = `vapid t=${jwt},k=${VAPID_PUBLIC_KEY}`;

  // Encrypt payload using Web Push encryption (simplified — use plain text for now)
  const body = JSON.stringify(payload);

  const res = await fetch(endpoint, {
    method:  "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type":  "application/json",
      "TTL":           "86400",
    },
    body,
  });

  return res.status;
}

// Main handler
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" } });
  }

  try {
    const { van, tekst, gezin_code, exclude_user_id } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get all push subscriptions for this gezin, except the sender
    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("gezin_code", gezin_code)
      .neq("user_id", exclude_user_id || "");

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { "Content-Type": "application/json" } });
    }

    const payload = {
      title: `🤠 ${van}`,
      body:  tekst.length > 100 ? tekst.substring(0, 97) + "..." : tekst,
      tag:   "banditos-chat",
      url:   "/",
    };

    // Send to all subscribers
    const results = await Promise.allSettled(
      subs.map(sub => sendPush(sub.subscription, payload))
    );

    const sent = results.filter(r => r.status === "fulfilled" && r.value < 300).length;

    return new Response(JSON.stringify({ sent, total: subs.length }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
