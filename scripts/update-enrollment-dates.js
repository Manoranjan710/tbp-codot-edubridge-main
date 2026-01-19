const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function updateEnrollmentDates() {
  try {
    console.log('🔄 Starting to update student enrollment dates...');

    // Get all existing students
    const students = await prisma.student.findMany({
      select: { id: true }
    });

    if (students.length === 0) {
      console.log('⚠️  No students found in database');
      return;
    }

    console.log(`📊 Found ${students.length} students to update`);

    // Create dates spanning the whole year
    const currentYear = new Date().getFullYear();
    const months = [];
    
    // Generate dates for each month of the current year
    for (let month = 0; month < 12; month++) {
      // Random day within each month (1-28 to avoid month-end issues)
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const date = new Date(currentYear, month, randomDay);
      months.push(date);
    }

    // Update students with distributed dates
    let updated = 0;
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      // Distribute students across all months, cycling through if more students than months
      const monthIndex = i % months.length;
      const enrollmentDate = months[monthIndex];
      
      // Add some random hours/minutes to make it more realistic
      enrollmentDate.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );

      await prisma.student.update({
        where: { id: student.id },
        data: { createdAt: enrollmentDate }
      });

      updated++;
      
      if (updated % 10 === 0) {
        console.log(`✅ Updated ${updated}/${students.length} students...`);
      }
    }

    console.log(`🎉 Successfully updated enrollment dates for ${updated} students!`);
    console.log('📅 Students are now distributed across all months of the year');
    
    // Show distribution summary
    const distribution = await prisma.student.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      }
    });

    const monthlyCount = {};
    distribution.forEach(item => {
      const month = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short' });
      monthlyCount[month] = (monthlyCount[month] || 0) + item._count.id;
    });

    console.log('📊 Distribution by month:');
    Object.entries(monthlyCount).forEach(([month, count]) => {
      console.log(`  ${month}: ${count} students`);
    });

  } catch (error) {
    console.error('❌ Error updating enrollment dates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateEnrollmentDates()
  .then(() => {
    console.log('🏁 Update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });