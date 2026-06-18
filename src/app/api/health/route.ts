import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Health check endpoint to verify database connectivity.
 *
 * Returns:
 * - 200: Database is accessible and contains seeded data
 * - 503: Database connection failed or not seeded
 */
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Check if database is seeded by counting roles
    const roleCount = await prisma.role.count();
    const userCount = await prisma.user.count();

    if (roleCount === 0 || userCount === 0) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: 'Database is not seeded. Run: npm run db:seed',
          details: {
            roles: roleCount,
            users: userCount,
            databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      seed: {
        roles: roleCount,
        users: userCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        code: error.code,
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
        details: {
          message: error.message,
          code: error.code,
          ...(error.meta && { meta: error.meta }),
        },
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
