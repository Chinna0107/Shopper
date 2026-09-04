const fs = require('fs');

const vendorPath = '/Users/hemanthkancharla/shopperbe/routes/vendor.js';
let vendorContent = fs.readFileSync(vendorPath, 'utf8');

const vendorOldEmail = `to: vendorRes.rows[0].email,`;
const vendorNewEmail = `to: vendorRes.rows[0].email + (process.env.EMAIL_USER ? ',' + process.env.EMAIL_USER : ''),`;

if (vendorContent.includes(vendorOldEmail)) {
  vendorContent = vendorContent.replace(vendorOldEmail, vendorNewEmail);
  fs.writeFileSync(vendorPath, vendorContent);
  console.log("Updated vendor.js to send email to admin too");
} else {
  console.log("Could not find vendorOldEmail in vendor.js");
}

const adminPath = '/Users/hemanthkancharla/shopperbe/routes/admin.js';
let adminContent = fs.readFileSync(adminPath, 'utf8');

const adminOldEmail = `to: vendorRes.rows[0].email,`;
const adminNewEmail = `to: vendorRes.rows[0].email + (process.env.EMAIL_USER ? ',' + process.env.EMAIL_USER : ''),`;

if (adminContent.includes(adminOldEmail)) {
  adminContent = adminContent.replace(adminOldEmail, adminNewEmail);
  fs.writeFileSync(adminPath, adminContent);
  console.log("Updated admin.js to send email to admin too");
} else {
  console.log("Could not find adminOldEmail in admin.js");
}
