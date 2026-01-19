const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function deleteStudentsBelowId873() {
  try {
    console.log('🗑️  Deleting students with id less than 873...');
    
    const result = await prisma.student.deleteMany({
      where: {
        id: {
          lt: 873
        }
      }
    });
    
    console.log(`✅ Deleted ${result.count} students with id less than 873`);
    return result.count;
    
  } catch (error) {
    console.error('❌ Delete failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the delete operation
deleteStudentsBelowId873()
  .then((count) => {
    console.log(`🏁 Delete completed! ${count} students removed from database.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Delete failed:', error);
    process.exit(1);
  });