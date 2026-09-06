const fs = require('fs');
const { Pool } = require('../../../shopperbe/node_modules/pg');
require('../../../shopperbe/node_modules/dotenv').config({ path: '../../../shopperbe/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  console.log('Running DB migrations for cart...');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        variant VARCHAR(255),
        qty INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, variant)
      );
    `);
    console.log('DB cart_items table ready.');
  } catch(e) {
    console.error('DB Error:', e);
  } finally {
    await pool.end();
  }

  const generalPath = '/Users/hemanthkancharla/shopperbe/routes/general.js';
  let generalContent = fs.readFileSync(generalPath, 'utf8');
  
  if (!generalContent.includes('const { authMiddleware }')) {
    generalContent = "const { authMiddleware } = require('./auth');\n" + generalContent;
  }

  if (!generalContent.includes('/cart')) {
    const cartRoutes = `
// GET /api/general/cart
router.get('/cart', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      \`SELECT c.id as cart_item_id, c.product_id, c.variant, c.qty,
              p.name, p.price, p.mrp, p.image_url, p.images, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at ASC\`,
      [req.userId]
    );
    // Format to match frontend structure: { product: {...}, variant, qty }
    const items = result.rows.map(row => ({
      cart_item_id: row.cart_item_id,
      product: {
        id: row.product_id,
        name: row.name,
        price: row.price,
        mrp: row.mrp,
        image_url: row.image_url,
        images: row.images,
        stock: row.stock
      },
      variant: row.variant,
      qty: row.qty
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/general/cart
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { product_id, variant, qty = 1 } = req.body;
    
    // Check if item exists
    const existing = await pool.query(
      'SELECT id, qty FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant = $3',
      [req.userId, product_id, variant || '']
    );
    
    if (existing.rows.length > 0) {
      // Update quantity
      const newQty = existing.rows[0].qty + qty;
      await pool.query('UPDATE cart_items SET qty = $1 WHERE id = $2', [newQty, existing.rows[0].id]);
    } else {
      // Insert new
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, variant, qty) VALUES ($1, $2, $3, $4)',
        [req.userId, product_id, variant || '', qty]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/general/cart
router.put('/cart', authMiddleware, async (req, res) => {
  try {
    const { product_id, variant, qty } = req.body;
    if (qty <= 0) {
      await pool.query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant = $3',
        [req.userId, product_id, variant || '']
      );
    } else {
      await pool.query(
        'UPDATE cart_items SET qty = $1 WHERE user_id = $2 AND product_id = $3 AND variant = $4',
        [qty, req.userId, product_id, variant || '']
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/general/cart
router.delete('/cart', authMiddleware, async (req, res) => {
  try {
    const { product_id, variant } = req.body;
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant = $3',
      [req.userId, product_id, variant || '']
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/general/cart/clear
router.delete('/cart/clear', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
`;
    generalContent = generalContent.replace('module.exports = router;', cartRoutes + '\nmodule.exports = router;');
    fs.writeFileSync(generalPath, generalContent);
    console.log('General routes patched with /cart endpoints');
  } else {
    console.log('Cart routes already exist in general.js');
  }
}

run();
