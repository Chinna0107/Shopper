const fs = require('fs');
const path = require('path');

const vendorPath = '/Users/hemanthkancharla/shopperbe/routes/vendor.js';
const adminPath = '/Users/hemanthkancharla/shopperbe/routes/admin.js';

let vendorContent = fs.readFileSync(vendorPath, 'utf8');
if (!vendorContent.includes('/tickets')) {
  const vendorRoutes = `
// GET /api/vendor/tickets
router.get('/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendor_support_tickets WHERE vendor_id = $1 ORDER BY created_at DESC', [req.vendorId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vendor/tickets
router.post('/tickets', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket_id = "TICK-" + Math.floor(Math.random() * 100000);
    const result = await pool.query(
      'INSERT INTO vendor_support_tickets (id, vendor_id, subject, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ticket_id, req.vendorId, subject, message, 'open']
    );

    // Try sending email
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: { user: process.env.SMTP_USER || process.env.EMAIL_USER, pass: process.env.SMTP_PASS || process.env.EMAIL_PASS }
      });
      const vendorRes = await pool.query('SELECT email FROM vendors WHERE id = $1', [req.vendorId]);
      if (vendorRes.rows.length > 0 && process.env.EMAIL_USER) {
        await transporter.sendMail({
          from: '"Swabhivar Shoppers Support" <' + process.env.EMAIL_USER + '>',
          to: vendorRes.rows[0].email,
          subject: 'Your ticket has been created',
          text: 'Your ticket has been created and our team will contact you shortly.\\n\\nTicket ID: ' + ticket_id
        });
      }
    } catch(e) { console.log('Email send failed', e.message); }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
`;
  vendorContent = vendorContent.replace('module.exports = router;', vendorRoutes + '\nmodule.exports = router;');
  fs.writeFileSync(vendorPath, vendorContent);
  console.log('Vendor routes patched');
}

let adminContent = fs.readFileSync(adminPath, 'utf8');
if (!adminContent.includes('/vendor-tickets')) {
  const adminRoutes = `
// GET /api/admin/vendor-tickets
router.get('/vendor-tickets', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT t.*, v.email as vendor_email, v.name as vendor_name FROM vendor_support_tickets t LEFT JOIN vendors v ON t.vendor_id = v.id ORDER BY t.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/vendor-tickets/:id/status
router.put('/vendor-tickets/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE vendor_support_tickets SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    if (result.rows.length > 0 && status === 'closed') {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          auth: { user: process.env.SMTP_USER || process.env.EMAIL_USER, pass: process.env.SMTP_PASS || process.env.EMAIL_PASS }
        });
        const vendorRes = await pool.query('SELECT email FROM vendors WHERE id = $1', [result.rows[0].vendor_id]);
        if (vendorRes.rows.length > 0 && process.env.EMAIL_USER) {
          await transporter.sendMail({
            from: '"Swabhivar Shoppers Support" <' + process.env.EMAIL_USER + '>',
            to: vendorRes.rows[0].email,
            subject: 'Your ticket has been closed',
            text: 'Your support ticket has been marked as closed. Thank you!\\n\\nTicket ID: ' + req.params.id
          });
        }
      } catch(e) { console.log('Email send failed', e.message); }
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
`;
  adminContent = adminContent.replace('module.exports = router;', adminRoutes + '\nmodule.exports = router;');
  fs.writeFileSync(adminPath, adminContent);
  console.log('Admin routes patched');
}
