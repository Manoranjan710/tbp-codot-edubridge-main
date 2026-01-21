const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function listAllAgents() {
  try {
    console.log('Fetching all agents from database...\n');

    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        country: true,
        status: true,
        createdAt: true,
      }
    });

    if (agents.length === 0) {
      console.log('No agents found in database');
      process.exit(0);
    }

    console.log(`Found ${agents.length} agents:\n`);
    console.log('='.repeat(100));

    agents.forEach((agent, index) => {
      console.log(`\n${index + 1}. Agent ID: ${agent.id}`);
      console.log(`   Name: ${agent.first_name} ${agent.last_name}`);
      console.log(`   Email: ${agent.email}`);
      console.log(`   Country: ${agent.country}`);
      console.log(`   Status: ${agent.status}`);
      console.log(`   Created: ${agent.createdAt}`);
    });

    console.log('\n' + '='.repeat(100));
    console.log(`\nTotal: ${agents.length} agents`);

    // Check for Sophia Williams
    const sophia = agents.find(a => a.email.toLowerCase().includes('sophia'));
    if (sophia) {
      console.log(`\n✅ Found Sophia Williams:`);
      console.log(`   ID: ${sophia.id}`);
      console.log(`   Email: ${sophia.email}`);
    } else {
      console.log(`\n⚠️  Sophia Williams not found in database`);
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listAllAgents();
