// Test database connection and seed status
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Testing database connection...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if roles exist
    const roleCount = await prisma.role.count();
    console.log(`📊 Roles in database: ${roleCount}`);

    // Check if users exist
    const userCount = await prisma.user.count();
    console.log(`👤 Users in database: ${userCount}`);

    // List all users with their roles
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      console.log('\n📋 Users in database:');
      users.forEach(user => {
        const roleNames = user.roles.map(ur => ur.role.name).join(', ');
        console.log(`  - ${user.email} (${user.fullName}) - Roles: ${roleNames}`);
      });
    }

    // Check database URL
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      // Hide password in output
      const sanitized = dbUrl.replace(/:[^:@]+@/, ':****@');
      console.log(`\n🔗 DATABASE_URL: ${sanitized}`);
    } else {
      console.log('\n❌ DATABASE_URL not set!');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Error code:', error.code);
    if (error.meta) {
      console.error('Error meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
