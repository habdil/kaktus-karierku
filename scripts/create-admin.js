const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAdmin() {
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  try {
    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        admin: {
          create: {
            fullName: 'Admin Test'
          }
        }
      },
      include: {
        admin: true
      }
    });

    console.log('Test admin created successfully:', user);
  } catch (error) {
    console.error('Error creating test admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createTestAdmin()
  .catch(console.error);