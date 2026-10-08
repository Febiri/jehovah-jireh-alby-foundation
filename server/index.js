require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { generateToken, authenticateToken, requireRole, validateNewPassword } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // SPA + inline styles; enable strict CSP when assets are versioned
}));

// CORS — restrict in production via CORS_ORIGINS="https://example.org,https://www.example.org"
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: 600
}));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// Rate limits
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: 'draft-8', legacyHeaders: false });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' } });
const writeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false });
app.use('/api/', generalLimiter);

// Shared validation helpers
const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 320;
const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
const safeLower = (v) => String(v ?? '').toLowerCase();
function paginate(list, req, maxLimit = 100) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const start = (page - 1) * limit;
  return { page, limit, total: list.length, data: list.slice(start, start + limit) };
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'jjaf-api', time: new Date().toISOString() });
});

// Static uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Require BOTH extension AND mimetype to match (AND, not OR).
    // SVG/GIF excluded: SVG can carry scripts, GIFs add weight with no CMS need.
    const allowedExt = new Set(['jpg', 'jpeg', 'png', 'webp']);
    const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = String(file.mimetype || '').toLowerCase();
    if (allowedExt.has(ext) && allowedMime.has(mime)) {
      return cb(null, true);
    }
    cb(new Error('Only JPG, PNG or WebP images are allowed (max 5MB).'));
  }
});

/* ================================================================
   PUBLIC API ENDPOINTS
   ================================================================ */

// Settings & Foundation info
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, data: settings });
});

// What We Do programs
app.get('/api/what-we-do', (req, res) => {
  const list = db.getWhatWeDo();
  res.json({ success: true, data: list });
});

// Projects
app.get('/api/projects', (req, res) => {
  let list = db.getProjects();
  const { status, featured } = req.query;

  if (status) {
    list = list.filter(p => safeLower(p.status) === safeLower(status));
  }
  if (featured === 'true') {
    list = list.filter(p => p.featured);
  }
  res.json({ success: true, data: list });
});

app.get('/api/projects/:id', (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

// Gallery
app.get('/api/gallery', (req, res) => {
  let list = db.getGallery();
  const { category, featured } = req.query;

  if (category && category !== 'All') {
    list = list.filter(g => safeLower(g.category) === safeLower(category));
  }
  if (featured === 'true') {
    list = list.filter(g => g.featured);
  }
  res.json({ success: true, data: list });
});

// Submit Donation Pledge (no live gateway yet — all entries are Pending until admin confirms receipt)
app.post('/api/donations', writeLimiter, (req, res) => {
  try {
    const { donor_name, email, phone, amount, currency, frequency, payment_method, message, is_anonymous } = req.body;

    const finalAmount = Number(amount);
    if (!Number.isFinite(finalAmount) || finalAmount < 1 || finalAmount > 10000000) {
      return res.status(400).json({ success: false, error: 'Donation amount must be between 1 and 10,000,000.' });
    }
    if (currency !== undefined && !['GHS', 'USD'].includes(currency)) {
      return res.status(400).json({ success: false, error: 'Currency must be GHS or USD.' });
    }
    if (frequency !== undefined && !['one-time', 'monthly'].includes(frequency)) {
      return res.status(400).json({ success: false, error: 'Frequency must be one-time or monthly.' });
    }
    if (payment_method !== undefined && !['Mobile Money', 'Bank Transfer', 'Card'].includes(payment_method)) {
      return res.status(400).json({ success: false, error: 'Invalid payment method.' });
    }
    const anon = Boolean(is_anonymous);
    if (!anon && !str(donor_name, 200)) {
      return res.status(400).json({ success: false, error: 'Donor name is required unless donating anonymously.' });
    }
    if (email && !isEmail(email)) {
      return res.status(400).json({ success: false, error: 'Email address is invalid.' });
    }
    if (!email && !str(phone, 40)) {
      return res.status(400).json({ success: false, error: 'Provide an email or phone number for receipt confirmation.' });
    }

    const donation = db.addDonation({
      donor_name: str(donor_name, 200),
      email: str(email, 320),
      phone: str(phone, 40),
      amount: Math.round(finalAmount * 100) / 100,
      currency: currency || 'GHS',
      frequency: frequency || 'one-time',
      payment_method: payment_method || 'Mobile Money',
      payment_status: 'Pending',
      message: str(message, 2000),
      is_anonymous: anon
    });

    res.status(201).json({
      success: true,
      message: 'Pledge recorded as Pending. Please complete the transfer using the instructions shown; an administrator will confirm receipt.',
      data: donation
    });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ success: false, error: 'Server error processing donation.' });
  }
});

// Submit Contact Inquiry
app.post('/api/contact', writeLimiter, (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!str(name, 200) || !str(message, 5000)) {
      return res.status(400).json({ success: false, error: 'Name and message are required.' });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const newMsg = db.addMessage({
      name: str(name, 200),
      email: str(email, 320),
      phone: str(phone, 40),
      subject: str(subject || 'General Inquiry', 200),
      message: str(message, 5000)
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received by the Jehovah Jireh Alby Foundation team.',
      data: newMsg
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ success: false, error: 'Server error saving contact message.' });
  }
});

/* ================================================================
   ADMIN AUTHENTICATION
   ================================================================ */

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = db.findAdminByEmail(String(email).trim());
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
  }

  if (db.isLocked(user)) {
    return res.status(429).json({ success: false, error: 'Account temporarily locked after failed attempts. Try again in 15 minutes.' });
  }

  const isMatch = bcrypt.compareSync(String(password), user.password_hash);
  if (!isMatch) {
    db.recordFailedLogin(user);
    db.logActivity('Failed Login', `Failed login attempt for ${user.email}`, true);
    return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
  }

  db.resetLoginAttempts(user);
  const token = generateToken(user);
  db.logActivity('Admin Login', `Administrator logged in: ${user.email}`, true);

  res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      must_change_password: Boolean(user.must_change_password)
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findAdminByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }
  if ((user.token_version || 0) !== (req.user.tv || 0)) {
    return res.status(403).json({ success: false, error: 'Session revoked. Please log in again.' });
  }
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      must_change_password: Boolean(user.must_change_password)
    }
  });
});

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Both current and new passwords are required.' });
  }
  const policyError = validateNewPassword(newPassword);
  if (policyError) {
    return res.status(400).json({ success: false, error: policyError });
  }

  const user = db.findAdminByEmail(req.user.email);
  if (!user || !bcrypt.compareSync(String(currentPassword), user.password_hash)) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
  }
  if (bcrypt.compareSync(String(newPassword), user.password_hash)) {
    return res.status(400).json({ success: false, error: 'New password must differ from the current password.' });
  }

  const newHash = bcrypt.hashSync(String(newPassword), 12);
  db.updateAdminPassword(user.id, newHash);
  db.logActivity('Password Changed', `Admin password changed for ${user.email}`, true);

  res.json({ success: true, message: 'Password updated successfully. Please log in again.' });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  db.logActivity('Admin Logout', `Administrator logged out: ${req.user.email}`, true);
  res.json({ success: true, message: 'Logged out. Discard the token client-side.' });
});

/* ================================================================
   PROTECTED ADMIN CMS ENDPOINTS
   ================================================================ */

// File Upload endpoint
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// Admin Dashboard Overview Stats
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  const projects = db.getProjects();
  const gallery = db.getGallery();
  const donations = db.getDonations();
  const messages = db.getMessages();
  const activityLogs = db.getActivityLogs();

  const upcomingProjects = projects.filter(p => p.status === 'upcoming').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const currentProjects = projects.filter(p => p.status === 'current').length;

  const totalDonationGHS = donations
    .filter(d => d.currency === 'GHS')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const totalDonationUSD = donations
    .filter(d => d.currency === 'USD')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  res.json({
    success: true,
    data: {
      totalProjects: projects.length,
      upcomingProjects,
      completedProjects,
      currentProjects,
      totalGallery: gallery.length,
      totalDonationsCount: donations.length,
      totalDonationGHS,
      totalDonationUSD,
      totalMessages: messages.length,
      unreadMessages,
      activityLogs
    }
  });
});

// Manage Settings (superadmin only — controls public identity + payment details)
app.put('/api/settings', authenticateToken, requireRole('superadmin'), (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ success: false, error: 'Invalid settings payload.' });
  }
  const updated = db.updateSettings(req.body);
  res.json({ success: true, data: updated, message: 'Settings saved successfully.' });
});

// Manage What We Do (superadmin only — replaces public program list)
app.put('/api/what-we-do', authenticateToken, requireRole('superadmin'), (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ success: false, error: 'Activities payload must be an array.' });
  }
  const updated = db.updateWhatWeDo(req.body);
  if (!updated) return res.status(400).json({ success: false, error: 'Invalid activities payload (max 20 items).' });
  res.json({ success: true, data: updated, message: 'Activities updated successfully.' });
});

// Manage Projects
app.post('/api/projects', authenticateToken, (req, res) => {
  const { title, description } = req.body || {};
  if (!str(title, 200) || !str(description, 5000)) {
    return res.status(400).json({ success: false, error: 'Project title and description are required.' });
  }
  const payload = {
    title: str(title, 200),
    description: str(description, 5000),
    date: str(req.body.date, 50),
    time: str(req.body.time, 100),
    location: str(req.body.location, 300),
    image: str(req.body.image, 500),
    additional_images: Array.isArray(req.body.additional_images) ? req.body.additional_images.filter(u => typeof u === 'string').slice(0, 20) : [],
    status_mode: ['auto', 'upcoming', 'current', 'completed'].includes(req.body.status_mode) ? req.body.status_mode : 'auto',
    featured: Boolean(req.body.featured)
  };
  const newProject = db.addProject(payload);
  res.status(201).json({ success: true, data: newProject, message: 'Project created successfully.' });
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const updated = db.updateProject(req.params.id, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }
  res.json({ success: true, data: updated, message: 'Project updated successfully.' });
});

app.delete('/api/projects/:id', authenticateToken, requireRole('superadmin'), (req, res) => {
  const ok = db.deleteProject(req.params.id);
  res.json({ success: ok, message: 'Project deleted successfully.' });
});

// Manage Gallery
app.post('/api/gallery', authenticateToken, (req, res) => {
  const { image, title } = req.body || {};
  if (!str(image, 500)) {
    return res.status(400).json({ success: false, error: 'Gallery image URL is required.' });
  }
  const newItem = db.addGalleryItem({
    title: str(title, 200),
    caption: str(req.body.caption, 2000),
    category: str(req.body.category || 'General', 100),
    image: str(image, 500),
    featured: Boolean(req.body.featured)
  });
  res.status(201).json({ success: true, data: newItem, message: 'Gallery item added successfully.' });
});

app.put('/api/gallery/:id', authenticateToken, (req, res) => {
  const updated = db.updateGalleryItem(req.params.id, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Gallery item not found.' });
  }
  res.json({ success: true, data: updated, message: 'Gallery item updated successfully.' });
});

app.delete('/api/gallery/:id', authenticateToken, requireRole('superadmin'), (req, res) => {
  const ok = db.deleteGalleryItem(req.params.id);
  res.json({ success: ok, message: 'Gallery item deleted successfully.' });
});

// Manage Donations
app.get('/api/donations', authenticateToken, (req, res) => {
  let list = db.getDonations();
  const { status, currency, method, search } = req.query;

  if (status) {
    list = list.filter(d => safeLower(d.payment_status) === safeLower(status));
  }
  if (currency) {
    list = list.filter(d => safeLower(d.currency) === safeLower(currency));
  }
  if (method) {
    list = list.filter(d => safeLower(d.payment_method) === safeLower(method));
  }
  if (search) {
    const q = safeLower(search);
    list = list.filter(d =>
      safeLower(d.donor_name).includes(q) ||
      safeLower(d.email).includes(q) ||
      safeLower(d.transaction_ref).includes(q)
    );
  }

  const result = paginate(list, req);
  res.json({ success: true, ...result });
});

// Confirm / update a pledge status (admin verifies manual MoMo/bank receipt)
app.patch('/api/donations/:id', authenticateToken, (req, res) => {
  const { status } = req.body || {};
  const updated = db.confirmDonation(req.params.id, status);
  if (!updated) return res.status(400).json({ success: false, error: 'Invalid donation id or status (Pending/Completed/Failed).' });
  res.json({ success: true, data: updated, message: `Donation marked as ${status}.` });
});

// Manage Messages
app.get('/api/messages', authenticateToken, (req, res) => {
  let list = db.getMessages();
  const { status } = req.query;
  if (status) {
    list = list.filter(m => safeLower(m.status) === safeLower(status));
  }
  const result = paginate(list, req);
  res.json({ success: true, ...result });
});

app.patch('/api/messages/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updated = db.updateMessageStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Message not found.' });
  }
  res.json({ success: true, data: updated, message: `Message marked as ${status}.` });
});

app.delete('/api/messages/:id', authenticateToken, requireRole('superadmin'), (req, res) => {
  const ok = db.deleteMessage(req.params.id);
  res.json({ success: ok, message: 'Message deleted successfully.' });
});

// Backup / export (superadmin) — download a JSON snapshot; store offsite regularly
app.get('/api/admin/export', authenticateToken, requireRole('superadmin'), (req, res) => {
  res.setHeader('Content-Disposition', `attachment; filename="jjaf-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json({ success: true, exported_at: new Date().toISOString(), data: db.exportSnapshot() });
});

// Also serve client/public directly (for images, logo, og-image, etc.)
const CLIENT_PUBLIC_DIR = path.join(__dirname, '../client/public');
if (fs.existsSync(CLIENT_PUBLIC_DIR)) {
  app.use(express.static(CLIENT_PUBLIC_DIR));
}

// Production client serving (built bundle)
const CLIENT_BUILD_DIR = path.join(__dirname, '../client/dist');
if (fs.existsSync(CLIENT_BUILD_DIR)) {
  app.use(express.static(CLIENT_BUILD_DIR));
  // SPA fallback — only for real page navigations (not API or asset requests)
  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/uploads') &&
      !req.path.match(/\.(js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|json|txt|map)$/)
    ) {
      const indexPath = path.join(CLIENT_BUILD_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile('index.html', { root: CLIENT_BUILD_DIR });
      }
    }
    next();
  });
}


// Centralized error handler — consistent shape, no stack leaks in production
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Payload too large.' });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.code === 'LIMIT_FILE_SIZE' ? 'Image exceeds 5MB limit.' : 'Upload failed.' });
  }
  if (err && /Only JPG, PNG or WebP/.test(err.message || '')) {
    return res.status(400).json({ success: false, error: err.message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});


app.listen(PORT, () => {
  console.log(`Jehovah Jireh Alby Foundation API server running on port ${PORT}`);
});
