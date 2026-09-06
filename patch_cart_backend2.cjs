const fs = require('fs');

const generalPath = '/Users/hemanthkancharla/shopperbe/routes/general.js';
let content = fs.readFileSync(generalPath, 'utf8');

// Replace variant storing logic
content = content.replace(
  /const { product_id, variant, qty = 1 } = req.body;/g,
  "const { product_id, variant, qty = 1 } = req.body;\n    const variantStr = typeof variant === 'object' ? JSON.stringify(variant) : variant || '';"
);
content = content.replace(
  /variant \|\| ''/g,
  "variantStr"
);
content = content.replace(
  /const { product_id, variant, qty } = req.body;/g,
  "const { product_id, variant, qty } = req.body;\n    const variantStr = typeof variant === 'object' ? JSON.stringify(variant) : variant || '';"
);

// Replace variant and image parsing logic in GET /cart
content = content.replace(
  /variant: row.variant,/g,
  "variant: (() => {\n        if (typeof row.variant === 'string' && row.variant.startsWith('{')) {\n          try { return JSON.parse(row.variant); } catch(e) {}\n        }\n        return row.variant;\n      })(),"
);

content = content.replace(
  /images: row.images,/g,
  "images: (() => {\n        let imgs = row.images;\n        if (typeof imgs === 'string' && imgs.startsWith('[')) {\n          try { imgs = JSON.parse(imgs); } catch(e) {}\n        }\n        return Array.isArray(imgs) ? imgs : [];\n      })(),"
);

// also fix image_url parsing if it's a JSON array
content = content.replace(
  /image_url: row.image_url,/g,
  "image_url: (() => {\n        let url = row.image_url;\n        if (typeof url === 'string' && url.startsWith('[')) {\n          try { \n            const arr = JSON.parse(url);\n            if (Array.isArray(arr) && arr.length > 0) return arr[0];\n          } catch(e) {}\n        }\n        return url;\n      })(),"
);

fs.writeFileSync(generalPath, content);
console.log('Fixed general.js');
