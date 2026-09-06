const fs = require('fs');
const path = require('path');
const { Pool } = require('../../../shopperbe/node_modules/pg');

require('../../../shopperbe/node_modules/dotenv').config({ path: '../../../shopperbe/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  console.log('Running DB migrations for settings...');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      INSERT INTO settings (key, value) VALUES ('referral_amount', '50')
      ON CONFLICT (key) DO NOTHING;
    `);
    console.log('DB settings table ready.');
  } catch(e) {
    console.error('DB Error:', e);
  } finally {
    await pool.end();
  }

  const adminPath = '/Users/hemanthkancharla/shopperbe/routes/admin.js';
  let adminContent = fs.readFileSync(adminPath, 'utf8');
  if (!adminContent.includes('/settings')) {
    const adminRoutes = `
// GET /api/admin/settings
router.get('/settings', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(r => settings[r.key] = r.value);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/settings
router.post('/settings', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { key, value } = req.body;
    await pool.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP',
      [key, value]
    );
    res.json({ success: true, key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
`;
    adminContent = adminContent.replace('module.exports = router;', adminRoutes + '\nmodule.exports = router;');
    fs.writeFileSync(adminPath, adminContent);
    console.log('Admin routes patched with /settings');
  }

  const generalPath = '/Users/hemanthkancharla/shopperbe/routes/general.js';
  let generalContent = fs.readFileSync(generalPath, 'utf8');
  if (!generalContent.includes('/settings/referral_amount')) {
    const generalRoutes = `
// GET /api/general/settings/referral_amount
router.get('/settings/referral_amount', async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM settings WHERE key = 'referral_amount'");
    if (result.rows.length > 0) {
      res.json({ amount: parseInt(result.rows[0].value) || 50 });
    } else {
      res.json({ amount: 50 });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
`;
    generalContent = generalContent.replace('module.exports = router;', generalRoutes + '\nmodule.exports = router;');
    fs.writeFileSync(generalPath, generalContent);
    console.log('General routes patched with /settings/referral_amount');
  }

  const authPath = '/Users/hemanthkancharla/shopperbe/routes/auth.js';
  let authContent = fs.readFileSync(authPath, 'utf8');
  
  if (authContent.includes('COALESCE(wallet_balance, 0) + 50')) {
    // Let's just use string replace for simplicity
    authContent = authContent.replace(
      "await pool.query('UPDATE vendors SET wallet_balance = COALESCE(wallet_balance, 0) + 50 WHERE referral_code=$1', [referredBy]);",
      `const refResV = await pool.query("SELECT value FROM settings WHERE key = 'referral_amount'");
           const refAmountV = refResV.rows.length > 0 ? parseInt(refResV.rows[0].value) : 50;
           await pool.query('UPDATE vendors SET wallet_balance = COALESCE(wallet_balance, 0) + $2 WHERE referral_code=$1', [referredBy, refAmountV]);`
    );
    authContent = authContent.replace(
      "await pool.query('UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + 50 WHERE referral_code=$1', [referredBy]);",
      `const refResU = await pool.query("SELECT value FROM settings WHERE key = 'referral_amount'");
           const refAmountU = refResU.rows.length > 0 ? parseInt(refResU.rows[0].value) : 50;
           await pool.query('UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $2 WHERE referral_code=$1', [referredBy, refAmountU]);`
    );
    fs.writeFileSync(authPath, authContent);
    console.log('Auth routes patched for dynamic referral amount');
  } else {
    console.log('Auth routes not patched - maybe already done or pattern not found');
  }
}

run();
