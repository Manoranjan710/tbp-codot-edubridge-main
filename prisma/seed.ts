import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Delete existing agents to avoid duplicates
  await prisma.agent.deleteMany({});

  // Create dummy agents data
  const agentsData = [
    {
      first_name: "John",
      last_name: "Smith", 
      address: "123 Main St, New York, NY 10001",
      email: "john.smith@example.com",
      country: "United States",
      status: "Active"
    },
    {
      first_name: "Sarah",
      last_name: "Johnson",
      address: "456 Oak Ave, Toronto, ON M5V 2A8",
      email: "sarah.johnson@example.com", 
      country: "Canada",
      status: "Active"
    },
    {
      first_name: "Michael",
      last_name: "Brown",
      address: "789 Pine Rd, London SW1A 1AA",
      email: "michael.brown@example.com",
      country: "United Kingdom", 
      status: "Inactive"
    },
    {
      first_name: "Emma",
      last_name: "Davis",
      address: "321 Elm St, Sydney NSW 2000",
      email: "emma.davis@example.com",
      country: "Australia",
      status: "Active"
    },
    {
      first_name: "Carlos",
      last_name: "Rodriguez",
      address: "654 Maple Dr, Mexico City 06600",
      email: "carlos.rodriguez@example.com",
      country: "Mexico",
      status: "Pending"
    },
    {
      first_name: "Lisa",
      last_name: "Anderson",
      address: "987 Cedar Ln, Los Angeles, CA 90210",
      email: "lisa.anderson@example.com",
      country: "United States",
      status: "Active"
    },
    {
      first_name: "Ahmed",
      last_name: "Hassan",
      address: "147 Birch St, Dubai 12345",
      email: "ahmed.hassan@example.com",
      country: "UAE",
      status: "Active"
    },
    {
      first_name: "Maria",
      last_name: "Garcia",
      address: "258 Walnut Ave, Madrid 28001",
      email: "maria.garcia@example.com",
      country: "Spain",
      status: "Inactive"
    },
    {
      first_name: "David",
      last_name: "Wilson",
      address: "369 Spruce Rd, Berlin 10115",
      email: "david.wilson@example.com",
      country: "Germany",
      status: "Active"
    },
    {
      first_name: "Priya",
      last_name: "Patel",
      address: "741 Poplar St, Mumbai 400001",
      email: "priya.patel@example.com",
      country: "India",
      status: "Pending"
    }
  ];

  // Insert all agents
  for (const agent of agentsData) {
    await prisma.agent.create({
      data: agent
    });
  }

  console.log(`✅ Seeded ${agentsData.length} agents successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });