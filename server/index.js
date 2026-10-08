require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { generateToken, authenticateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      return cb(null, true);
    }
    cb(new Error('Only valid image files (JPG, PNG, WebP, SVG, GIF) are allowed.'));
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
    list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
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
    list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }
  if (featured === 'true') {
    list = list.filter(g => g.featured);
  }
  res.json({ success: true, data: list });
});

// Submit Donation
app.post('/api/donations', (req, res) => {
  try {
    const { donor_name, email, phone, amount, currency, frequency, payment_method, message, is_anonymous } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid donation amount is required.' });
    }

    const donation = db.addDonation({
      donor_name,
      email,
      phone,
      amount,
      currency: currency || 'GHS',
      frequency: frequency || 'one-time',
      payment_method: payment_method || 'Mobile Money',
      payment_status: 'Completed',
      message,
      is_anonymous: Boolean(is_anonymous)
    });

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully. Thank you for supporting the Jehovah Jireh Alby Foundation!',
      data: donation
    });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ success: false, error: 'Server error processing donation.' });
  }
});

// Submit Contact Inquiry
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const newMsg = db.addMessage({
      name,
      email,
      phone,
      subject,
      message
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

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = db.findAdminByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid email or password credentials.' });
  }

  const token = generateToken(user);
  db.logActivity('Admin Login', `Administrator logged in: ${user.email}`);

  res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findAdminByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Both current and new passwords are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, error: 'New password must be at least 8 characters.' });
  }

  const user = db.findAdminByEmail(req.user.email);
  if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.updateAdminPassword(user.id, newHash);
  db.logActivity('Password Changed', `Admin password changed for ${user.email}`);

  res.json({ success: true, message: 'Password updated successfully.' });
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

// Manage Settings
app.put('/api/settings', authenticateToken, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, data: updated, message: 'Settings saved successfully.' });
});

// Manage What We Do
app.put('/api/what-we-do', authenticateToken, (req, res) => {
  const updated = db.updateWhatWeDo(req.body);
  res.json({ success: true, data: updated, message: 'Activities updated successfully.' });
});

// Manage Projects
app.post('/api/projects', authenticateToken, (req, res) => {
  const newProject = db.addProject(req.body);
  res.status(201).json({ success: true, data: newProject, message: 'Project created successfully.' });
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }
  res.json({ success: true, data: updated, message: 'Project updated successfully.' });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const ok = db.deleteProject(req.params.id);
  res.json({ success: ok, message: 'Project deleted successfully.' });
});

// Manage Gallery
app.post('/api/gallery', authenticateToken, (req, res) => {
  const newItem = db.addGalleryItem(req.body);
  res.status(201).json({ success: true, data: newItem, message: 'Gallery item added successfully.' });
});

app.put('/api/gallery/:id', authenticateToken, (req, res) => {
  const updated = db.updateGalleryItem(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Gallery item not found.' });
  }
  res.json({ success: true, data: updated, message: 'Gallery item updated successfully.' });
});

app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  const ok = db.deleteGalleryItem(req.params.id);
  res.json({ success: ok, message: 'Gallery item deleted successfully.' });
});

// Manage Donations
app.get('/api/donations', authenticateToken, (req, res) => {
  let list = db.getDonations();
  const { status, currency, method, search } = req.query;

  if (status) {
    list = list.filter(d => d.payment_status.toLowerCase() === status.toLowerCase());
  }
  if (currency) {
    list = list.filter(d => d.currency.toLowerCase() === currency.toLowerCase());
  }
  if (method) {
    list = list.filter(d => d.payment_method.toLowerCase() === method.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d =>
      d.donor_name.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.transaction_ref.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: list });
});

// Manage Messages
app.get('/api/messages', authenticateToken, (req, res) => {
  let list = db.getMessages();
  const { status } = req.query;
  if (status) {
    list = list.filter(m => m.status.toLowerCase() === status.toLowerCase());
  }
  res.json({ success: true, data: list });
});

app.patch('/api/messages/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  const updated = db.updateMessageStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Message not found.' });
  }
  res.json({ success: true, data: updated, message: `Message marked as ${status}.` });
});

app.delete('/api/messages/:id', authenticateToken, (req, res) => {
  const ok = db.deleteMessage(req.params.id);
  res.json({ success: ok, message: 'Message deleted successfully.' });
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


app.listen(PORT, () => {
  console.log(`Jehovah Jireh Alby Foundation API server running on port ${PORT}`);
});
