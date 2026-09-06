const fs = require('fs');
const generalPath = '/Users/hemanthkancharla/shopperbe/routes/general.js';
let content = fs.readFileSync(generalPath, 'utf8');

// Replace the DELETE endpoint
content = content.replace(
  /const { product_id, variant } = req.body;[\s\S]*?res\.json\({ success: true }\);/g,
  `const { product_id, variant } = req.body;
    const variantStr = typeof variant === 'object' ? JSON.stringify(variant) : variant || '';
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant = $3',
      [req.user.id, product_id, variantStr]
    );
    res.json({ success: true });`
);

fs.writeFileSync(generalPath, content);
console.log('Fixed DELETE /cart in general.js');
