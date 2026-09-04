const { Client } = require('pg');
require('dotenv').config({ path: '/Users/hemanthkancharla/shopperbe/.env' });

async function fix() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    await client.query('TRUNCATE TABLE vendor_support_tickets;');
    await client.query('ALTER TABLE vendor_support_tickets DROP COLUMN id CASCADE;');
    await client.query('ALTER TABLE vendor_support_tickets ADD COLUMN id SERIAL PRIMARY KEY;');
    console.log("Database table altered to use SERIAL id (auto-incrementing from 1).");
  } catch(e) {
    console.error("DB Error:", e.message);
  }
  await client.end();
}

fix();
