const fs = require('fs');

const vendorPath = '/Users/hemanthkancharla/shopperbe/routes/vendor.js';
let vendorContent = fs.readFileSync(vendorPath, 'utf8');

// Replace the INSERT statement to remove 'id'
// Old: 'INSERT INTO vendor_support_tickets (id, vendor_id, subject, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [ticket_id, req.vendorId, subject, message, 'open']
// New: 'INSERT INTO vendor_support_tickets (vendor_id, subject, message, status) VALUES ($1, $2, $3, $4) RETURNING *', [req.vendorId, subject, message, 'open']

const oldQuery = `'INSERT INTO vendor_support_tickets (id, vendor_id, subject, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ticket_id, req.vendorId, subject, message, 'open']`;
      
const newQuery = `'INSERT INTO vendor_support_tickets (vendor_id, subject, message, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.vendorId, subject, message, 'open']`;

if (vendorContent.includes(oldQuery)) {
  vendorContent = vendorContent.replace(oldQuery, newQuery);
  fs.writeFileSync(vendorPath, vendorContent);
  console.log("Updated vendor.js INSERT query.");
} else {
  console.log("Could not find the query in vendor.js. Maybe it was already updated.");
}

// In the email sending part, we should also fix the ticket_id reference since it will be auto-generated
// Luckily, 'RETURNING *' gives us result.rows[0].id
const oldEmailFix = `text: 'Your ticket has been created and our team will contact you shortly.\\n\\nTicket ID: ' + ticket_id`;
const newEmailFix = `text: 'Your ticket has been created and our team will contact you shortly.\\n\\nTicket ID: ' + result.rows[0].id`;

if (vendorContent.includes(oldEmailFix)) {
  vendorContent = vendorContent.replace(oldEmailFix, newEmailFix);
  fs.writeFileSync(vendorPath, vendorContent);
  console.log("Updated vendor.js email text.");
}
