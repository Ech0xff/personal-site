import { createHash, timingSafeEqual } from "node:crypto";

import { jwtVerify, SignJWT } from "jose";

export const SESSION_SECONDS = 7 * 24 * 60 * 60;
const issuer = "personal-site";
const audience = "dashboard";
const digest = (value: string) => createHash("sha256").update(value).digest();
const signingKey = (token: string) =>
  digest(`personal-site:admin-session:${token}`);

export function matchesAdminToken(
  candidate: string,
  configured: string | undefined,
) {
  return (
    Boolean(configured) &&
    timingSafeEqual(digest(candidate), digest(configured ?? ""))
  );
}

export async function createSessionToken(token: string, now: Date) {
  if (!token) throw new Error("Admin login is not configured.");
  const issuedAt = Math.floor(now.getTime() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_SECONDS)
    .sign(signingKey(token));
}

export async function isValidSession(
  value: string | undefined,
  token: string | undefined,
  now: Date,
) {
  if (!value || !token) return false;
  try {
    const { payload } = await jwtVerify(value, signingKey(token), {
      algorithms: ["HS256"],
      issuer,
      audience,
      subject: "admin",
      currentDate: now,
      maxTokenAge: SESSION_SECONDS,
      requiredClaims: ["iat", "exp"],
    });
    return typeof payload.exp === "number";
  } catch {
    return false;
  }
}
