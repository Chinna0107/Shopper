const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

if (!code.includes("Store } from 'lucide-react'")) {
  code = code.replace("from 'lucide-react';", ", Store } from 'lucide-react';");
  fs.writeFileSync('src/pages/HomePage.jsx', code);
}
