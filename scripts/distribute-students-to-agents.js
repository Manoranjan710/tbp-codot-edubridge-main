const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function distributeStudentsToAgents() {
  try {
    console.log('Starting student distribution to agents...');

    // Get all agents
    const agents = await prisma.agent.findMany();
    console.log(`Found ${agents.length} agents`);

    if (agents.length === 0) {
      console.log('No agents found. Please create agents first.');
      process.exit(1);
    }

    // Get all students with null agentId
    const studentsWithoutAgent = await prisma.student.findMany({
      where: {
        agentId: null
      }
    });

    console.log(`Found ${studentsWithoutAgent.length} students without an agent`);

    if (studentsWithoutAgent.length === 0) {
      console.log('All students are already assigned to agents.');
      process.exit(0);
    }

    // Distribute students evenly among agents
    let updateCount = 0;
    for (let i = 0; i < studentsWithoutAgent.length; i++) {
      const student = studentsWithoutAgent[i];
      const agent = agents[i % agents.length]; // Round-robin distribution

      await prisma.student.update({
        where: { id: student.id },
        data: { agentId: agent.id }
      });

      updateCount++;
      if (updateCount % 100 === 0) {
        console.log(`Distributed ${updateCount} students...`);
      }
    }

    console.log(`\n✅ Successfully distributed ${updateCount} students to ${agents.length} agents`);

    // Show distribution summary
    const distribution = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        _count: {
          select: { _all: false }
        }
      }
    });

    console.log('\nDistribution Summary:');
    console.log('====================');
    
    for (const agent of agents) {
      const studentCount = await prisma.student.count({
        where: { agentId: agent.id }
      });
      console.log(`${agent.first_name} ${agent.last_name} (${agent.email}): ${studentCount} students`);
    }

    console.log('\n✅ Distribution completed successfully!');
  } catch (error) {
    console.error('Error distributing students:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

distributeStudentsToAgents();
