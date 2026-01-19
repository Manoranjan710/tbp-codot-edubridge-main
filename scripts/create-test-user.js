const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'admin@college.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });

    console.log('✅ Test user created successfully:');
    console.log('Email: admin@college.com');
    console.log('Password: password123');
    console.log('User ID:', user.id);

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  User already exists with this email');
    } else {
      console.error('❌ Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();