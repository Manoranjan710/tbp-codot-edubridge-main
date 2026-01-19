const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function updateEnrollmentDatesRandom() {
  try {
    console.log('🔄 Starting to update student enrollment dates with random distribution...');

    // Get all existing students
    const students = await prisma.student.findMany({
      select: { id: true }
    });

    if (students.length === 0) {
      console.log('⚠️  No students found in database');
      return;
    }

    console.log(`📊 Found ${students.length} students to update`);

    const currentYear = new Date().getFullYear();
    
    // Create weighted distribution for months (some months might be more popular for enrollment)
    const monthWeights = [
      { month: 0, weight: 8 },   // Jan - Higher enrollment (new year)
      { month: 1, weight: 12 },  // Feb - Peak enrollment
      { month: 2, weight: 15 },  // Mar - Peak enrollment  
      { month: 3, weight: 10 },  // Apr - Moderate
      { month: 4, weight: 8 },   // May - Lower
      { month: 5, weight: 6 },   // Jun - Lower
      { month: 6, weight: 18 },  // Jul - Peak (mid-year intake)
      { month: 7, weight: 14 },  // Aug - High
      { month: 8, weight: 12 },  // Sep - High
      { month: 9, weight: 8 },   // Oct - Moderate
      { month: 10, weight: 5 },  // Nov - Low
      { month: 11, weight: 4 }   // Dec - Low (holidays)
    ];

    // Calculate total weight
    const totalWeight = monthWeights.reduce((sum, item) => sum + item.weight, 0);
    
    // Create month assignments for all students
    const studentMonthAssignments = [];
    
    for (let i = 0; i < students.length; i++) {
      // Generate random number between 0 and totalWeight
      let randomValue = Math.random() * totalWeight;
      
      // Find which month this random value falls into
      let selectedMonth = 0;
      for (const monthWeight of monthWeights) {
        randomValue -= monthWeight.weight;
        if (randomValue <= 0) {
          selectedMonth = monthWeight.month;
          break;
        }
      }
      
      // Generate random date within that month
      const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);
      
      const enrollmentDate = new Date(currentYear, selectedMonth, randomDay, randomHour, randomMinute, randomSecond);
      
      studentMonthAssignments.push({
        studentId: students[i].id,
        date: enrollmentDate,
        month: selectedMonth
      });
    }

    // Show distribution before updating
    const monthCounts = {};
    studentMonthAssignments.forEach(assignment => {
      const monthName = new Date(currentYear, assignment.month, 1).toLocaleDateString('en-US', { month: 'short' });
      monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
    });

    console.log('📅 Planned distribution by month:');
    Object.entries(monthCounts).forEach(([month, count]) => {
      console.log(`  ${month}: ${count} students`);
    });

    // Update students in database
    let updated = 0;
    
    for (const assignment of studentMonthAssignments) {
      await prisma.student.update({
        where: { id: assignment.studentId },
        data: { createdAt: assignment.date }
      });

      updated++;
      
      if (updated % 20 === 0) {
        console.log(`✅ Updated ${updated}/${students.length} students...`);
      }
    }

    console.log(`🎉 Successfully updated enrollment dates for ${updated} students!`);
    console.log('📊 Students are now randomly distributed across the year with realistic patterns');
    
    // Verify actual distribution
    const actualDistribution = await prisma.student.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      }
    });

    const actualMonthlyCount = {};
    actualDistribution.forEach(item => {
      const month = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short' });
      actualMonthlyCount[month] = (actualMonthlyCount[month] || 0) + item._count.id;
    });

    console.log('📈 Actual final distribution by month:');
    Object.entries(actualMonthlyCount).forEach(([month, count]) => {
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
updateEnrollmentDatesRandom()
  .then(() => {
    console.log('🏁 Random distribution update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });