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
  } catch (err: any) {
    console.error('Login verification error:', {
      message: err.message,
      code: err.code,
      name: err.name,
    });

    // Provide more specific error messages based on error type
    if (err.code === 'P1001' || err.message?.includes("Can't reach database")) {
      return NextResponse.json(
        {
          error: 'Database connection failed. The database may not be configured or running.',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        { status: 503 }
      );
    }

    if (err.code === 'P2021' || err.message?.includes('does not exist')) {
      return NextResponse.json(
        {
          error: 'Database schema error. The database needs to be migrated.',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        { status: 503 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Server error during login. Please contact support if this persists.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
