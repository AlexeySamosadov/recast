#!/usr/bin/env node
/** Manual Recast license issuer. node sign-license.mjs buyer@email.com [days] */
import { readFileSync } from "node:fs";
const priv = JSON.parse(readFileSync(new URL("./license_private_key.json", import.meta.url)));
const email = process.argv[2], days = process.argv[3] ? Number(process.argv[3]) : 0;
if (!email) { console.error("usage: node sign-license.mjs <email> [days]"); process.exit(1); }
const payload = { email, plan: "pro", iat: Math.floor(Date.now() / 1000) };
if (days > 0) payload.exp = payload.iat + days * 86400;
const b64 = b => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const key = await crypto.subtle.importKey("jwk", priv, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
const pb = new TextEncoder().encode(JSON.stringify(payload));
const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, pb);
console.log("\n" + b64(pb) + "." + b64(sig) + "\n");
