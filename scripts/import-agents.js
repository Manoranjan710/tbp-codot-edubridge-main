const { PrismaClient } = require('../src/generated/prisma');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importAgents() {
  try {
    // Delete existing agents to avoid duplicates
    await prisma.agent.deleteMany({});
    console.log('🗑️  Cleared existing agent data');

    const csvFilePath = path.resolve('../agents.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    const agents = [];
    let rowCount = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv({
          skipLinesWithError: true,
          skipEmptyLines: true
        }))
        .on('data', (row) => {
          rowCount++;
          
          // Map CSV columns to database fields
          const agent = {
            first_name: row['first_name'] || '',
            last_name: row['last_name'] || '',
            address: row['Address'] || '',
            email: row['email'] || '',
            country: row['Country'] || '',
            // Convert numeric status to string
            status: row['Status'] === '1' ? 'active' : 'inactive'
          };

          // Validate required fields
          if (!agent.first_name || !agent.last_name || !agent.email) {
            console.warn(`⚠️  Skipping row ${rowCount} - missing required fields`);
            return;
          }

          agents.push(agent);
        })
        .on('end', async () => {
          try {
            console.log(`📄 Parsed ${agents.length} agent records from CSV`);
            
            // Insert agents one by one
            let inserted = 0;
            
            for (const agent of agents) {
              try {
                await prisma.agent.create({
                  data: agent
                });
                inserted++;
                console.log(`✅ Inserted agent: ${agent.first_name} ${agent.last_name} (${agent.email})`);
              } catch (error) {
                console.error(`❌ Failed to insert ${agent.first_name} ${agent.last_name}:`, error.message);
              }
            }

            console.log(`🎉 Successfully imported ${inserted} agents!`);
            resolve(inserted);
          } catch (error) {
            console.error('❌ Error inserting agents:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('❌ Error reading CSV file:', error);
          reject(error);
        });
    });

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importAgents()
  .then((count) => {
    console.log(`🏁 Import completed! ${count} agents added to database.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });