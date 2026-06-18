import crypto from 'crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import type { RoleName } from '@prisma/client';
import { prisma } from './prisma';

// --- Session shape -----------------------------------------------------------
// Kept minimal and self-contained so the cookie is the only state needed to
// render role-aware UI. When swapping to Entra ID, this same SessionUser is
// produced from the ID token / group claims instead of the seeded DB.
export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: RoleName[];
}

const COOKIE_NAME = 'lp_session';
const SECRET = process.env.SESSION_SECRET || 'insecure-dev-secret';

// --- Signing (HMAC) ----------------------------------------------------------
// A signed, base64url-encoded JSON payload. Not encrypted — contains no secrets,
// only identity + roles — but tamper-proof via HMAC so roles can't be forged.
function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function encodeSession(user: SessionUser): string {
  const body = Buffer.from(JSON.stringify(user)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function decodeSession(token: string): SessionUser | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  // Constant-time compare to prevent signature timing attacks.
  const expected = sign(body);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// --- Public API --------------------------------------------------------------

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { roles: { include: { role: true } } },
    });

    if (!user || !user.isActive) {
      console.log('User not found or inactive:', email);
      return null;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log('Password mismatch for:', email);
      return null;
    }

    console.log('Login successful for:', email, 'roles:', user.roles.map(ur => ur.role.name));

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles.map((ur) => ur.role.name),
    };
  } catch (err) {
    console.error('Database error during credential verification:', err);
    throw err; // Let the route handler catch and return 500
  }
}

export function createSessionCookie(user: SessionUser) {
  cookies().set(COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.APP_ENV !== 'dev',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

// Read the current user from the request cookie (server components / routes).
export function getSessionUser(): SessionUser | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}

// Guard for server code: returns the user or throws (caller redirects).
export function requireUser(): SessionUser {
  const user = getSessionUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user;
}
