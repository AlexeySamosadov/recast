#!/usr/bin/env node
/** Generate a batch of valid Recast Pro license keys to upload into Whop as deliverables.
 *  Usage: node gen-keys.mjs 50 > keys.txt   */
import { readFileSync } from "node:fs";
const priv = JSON.parse(readFileSync(new URL("./license_private_key.json", import.meta.url)));
const n = Number(process.argv[2] || 50);
const b64 = b => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const key = await crypto.subtle.importKey("jwk", priv, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
const out = [];
for (let i = 0; i < n; i++) {
  const payload = { email: "recast-pro", plan: "pro", iat: Math.floor(Date.now() / 1000), n: i };
  const pb = new TextEncoder().encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, pb);
  out.push(b64(pb) + "." + b64(sig));
}
console.log(out.join("\n"));
