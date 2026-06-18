import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyCredentials, createSessionCookie } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch (err) {
    console.error('Login JSON parse error:', err);
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 422 });
  }

  try {
    const user = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    createSessionCookie(user);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Login verification error:', err);
    return NextResponse.json(
      { error: 'Server error during login. Please try again.' },
      { status: 500 }
    );
  }
}
