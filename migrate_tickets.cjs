const { Client } = require('pg');
require('dotenv').config({ path: '/Users/hemanthkancharla/shopperbe/.env' });

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS vendor_support_tickets (
      id VARCHAR(50) PRIMARY KEY,
      vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log("Table vendor_support_tickets created successfully.");
  await client.end();
}

migrate().catch(console.error);
