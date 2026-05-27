const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 5000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/orders', async (req, res) => {
  const { email, alt_email, phone, product } = req.body;
  if (!email || !phone) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const result = await pool.query(
      'INSERT INTO orders (email, alt_email, phone, product) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, alt_email || null, phone, product || 'يوتيوب بريميوم']
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ success: true, token: Buffer.from(`admin:${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
  }
});

app.get('/api/orders', async (req, res) => {
  const auth = req.headers['x-admin-token'];
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query(
      'SELECT id, email, alt_email, phone, product, created_at FROM orders ORDER BY created_at DESC'
    );
    res.json({ success: true, orders: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const auth = req.headers['x-admin-token'];
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
