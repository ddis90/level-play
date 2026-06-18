import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Count users
    const userCount = await prisma.user.count();
    const roleCount = await prisma.role.count();

    // Test query
    const roles = await prisma.role.findMany({ take: 3 });

    return NextResponse.json({
      status: 'connected',
      userCount,
      roleCount,
      sampleRoles: roles.map(r => r.name),
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      databaseUrl: process.env.DATABASE_URL ? 'SET (but connection failed)' : 'NOT SET',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
