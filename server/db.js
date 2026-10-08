const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin2026Secure!', salt);

  return {
    admin_users: [
      {
        id: 1,
        name: 'Foundation Administrator',
        email: 'admin@jjafoundation.org',
        password_hash: adminPasswordHash,
        role: 'superadmin',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Alby Executive',
        email: 'Jehovahjirehalbyfoundation@gmail.com',
        password_hash: adminPasswordHash,
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ],
    settings: {
      foundation_name: 'Jehovah jireh Alby foundation',
      display_title: 'JEHOVAH JIREH ALBY FOUNDATION',
      description: 'Jehovah jireh Alby foundation is a Christian charitable foundation, committed to caring for orphans, street children,vulnerable children and the needy. We believe every child deserves love, hope , education and a future.',
      mission: 'to provide food, shelter, education, medical support and spiritual guidance to orphaned and less privileged children in Ghana.',
      vision: 'To see every vulnerable child smile, thrive, and know that God provides.',
      motto: 'the lord will provide',
      scripture: 'Genesis 22:14',
      phone: '0248072279',
      email: 'Jehovahjirehalbyfoundation@gmail.com',
      tiktok: '@jjaf_ghana',
      instagram: 'Jehovah jireh Alby Foundation',
      snapchat: 'jjaf.foundation',
      momo_network: 'MTN Mobile Money / Telecel Cash / AT Money',
      momo_number: '0248072279',
      momo_account_name: 'Jehovah Jireh Alby Foundation',
      momo_instructions: 'Official Mobile Money credentials can be updated from the Admin Settings. To send your support, transfer directly to the foundation number and enter your name as reference.',
      bank_name: 'Available upon request / Configurable in Admin',
      bank_account_name: 'Jehovah Jireh Alby Foundation',
      bank_account_number: 'Contact Administration for official swift & bank routing',
      bank_branch: 'Kumasi / Accra, Ghana',
      bank_instructions: 'Bank transfer information can be configured by the administrator once the official foundation corporate account is finalized.',
      custom_logo_url: '',
      stats_public_visible: false,
      stat_children_supported: 0,
      stat_orphanages_supported: 0,
      stat_projects_completed: 1,
      stat_donations_received: 0,
      seo_meta_title: 'Jehovah Jireh Alby Foundation | Caring for Children & Communities',
      seo_meta_description: 'Jehovah jireh Alby foundation is a Christian charitable foundation, committed to caring for orphans, street children, vulnerable children and the needy in Ghana.',
      updated_at: new Date().toISOString()
    },
    what_we_do: [
      {
        id: 1,
        title: 'Donation to orphanage homes',
        subtitle: 'Cherubs and other',
        description: 'Providing tangible support, essential care packages, and long-term partnership with orphanage homes across Ghana including Cherubs orphanage home.',
        icon: 'Home',
        image: '/images/orphanage-care.jpg'
      },
      {
        id: 2,
        title: 'Food and clothing Drives',
        subtitle: 'Essential Living Supplies',
        description: 'Organizing compassionate community food and clothing distribution drives to ensure no child goes hungry or without dignified attire.',
        icon: 'Shirt',
        image: '/images/food-clothing.jpg'
      },
      {
        id: 3,
        title: 'School supplies and mattresses for children and needy',
        subtitle: 'Education & Restful Comfort',
        description: 'Equipping vulnerable children with textbooks, backpacks, stationery, and quality sleeping mattresses to foster academic growth and healthy rest.',
        icon: 'BookOpen',
        image: '/images/school-supplies.jpg'
      },
      {
        id: 4,
        title: 'Medical and health support',
        subtitle: 'Healthcare & Well-being',
        description: 'Facilitating medical screenings, essential medications, health insurance assistance, and hygiene kits for children in need.',
        icon: 'HeartPulse',
        image: '/images/medical-support.jpg'
      },
      {
        id: 5,
        title: 'Spiritual encouragement',
        subtitle: 'Faith, Hope & Prayer',
        description: 'Sharing Christian love, uplifting messages, biblical counsel, and reminding every vulnerable child that the Lord will provide (Genesis 22:14).',
        icon: 'Sun',
        image: '/images/spiritual-care.jpg'
      }
    ],
    projects: [
      {
        id: 1,
        title: 'Charity Donation to cherubs orphanage home- 30th September 2026',
        description: 'A compassionate mission to deliver food supplies, mattresses, clothing, school materials, and spiritual encouragement to the children at Cherubs Orphanage Home.',
        date: '2026-09-30',
        time: 'Wednesday: morning 9am',
        location: 'Santasi Apire',
        image: '/images/cherubs-outreach.jpg',
        additional_images: ['/images/cherubs-1.jpg', '/images/cherubs-2.jpg'],
        status_mode: 'auto', // 'auto', 'upcoming', 'current', 'completed'
        status: 'completed', // dynamically resolved
        featured: true,
        created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Back-to-School Books & Educational Supplies Distribution',
        description: 'Equipping underprivileged students and orphans with essential notebooks, stationery, uniforms, and learning kits for the academic term.',
        date: '2026-10-24',
        time: 'Saturday: 10:00 AM',
        location: 'Kumasi Metropolitan Area',
        image: '/images/school-supplies.jpg',
        additional_images: [],
        status_mode: 'auto',
        status: 'upcoming',
        featured: false,
        created_at: new Date('2026-09-15T09:00:00Z').toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Community Food Basket & Nutrition Outreach',
        description: 'Delivering nutritional staples, clean grains, and fresh provisions to vulnerable families and street children in need of food security.',
        date: '2026-11-14',
        time: 'Saturday: 9:00 AM',
        location: 'Ashanti Region, Ghana',
        image: '/images/food-clothing.jpg',
        additional_images: [],
        status_mode: 'auto',
        status: 'upcoming',
        featured: false,
        created_at: new Date('2026-09-20T10:00:00Z').toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    gallery: [
      {
        id: 1,
        title: 'Cherubs Orphanage Outreach',
        caption: 'Joy and fellowship during our charitable outreach to Cherubs Orphanage Home in Santasi Apire.',
        category: 'Orphanage Visits',
        image: '/images/cherubs-outreach.jpg',
        featured: true,
        created_at: new Date('2026-09-30T10:00:00Z').toISOString()
      },
      {
        id: 2,
        title: 'School Supplies and Educational Kits',
        caption: 'Distributing school supplies and learning materials to empower bright young minds with hope and education.',
        category: 'Children & Education',
        image: '/images/school-supplies.jpg',
        featured: true,
        created_at: new Date('2026-09-22T11:00:00Z').toISOString()
      },
      {
        id: 3,
        title: 'Food & Clothing Drive Provisions',
        caption: 'Packing and distributing wholesome food and clean clothing packages for needy families and children.',
        category: 'Food & Clothing Drives',
        image: '/images/food-clothing.jpg',
        featured: true,
        created_at: new Date('2026-09-25T14:00:00Z').toISOString()
      },
      {
        id: 4,
        title: 'Medical Health Support & Screenings',
        caption: 'Coordinating basic healthcare checkups and wellness supplies for vulnerable children.',
        category: 'Healthcare',
        image: '/images/medical-support.jpg',
        featured: true,
        created_at: new Date('2026-09-18T09:30:00Z').toISOString()
      },
      {
        id: 5,
        title: 'Spiritual Encouragement & Bible Study',
        caption: 'Uplifting hearts with prayer, singing, and scripture reminding each child that the Lord will provide.',
        category: 'Spiritual Guidance',
        image: '/images/spiritual-care.jpg',
        featured: true,
        created_at: new Date('2026-09-12T16:00:00Z').toISOString()
      },
      {
        id: 6,
        title: 'Mattress & Bedding Delivery',
        caption: 'Delivering comfortable sleeping mattresses to ensure orphaned children have peaceful, dignified rest.',
        category: 'Community Outreach',
        image: '/images/mattress-donation.jpg',
        featured: true,
        created_at: new Date('2026-09-08T13:00:00Z').toISOString()
      }
    ],
    donations: [
      {
        id: 1,
        donor_name: 'Grace Mensah',
        email: 'grace.mensah@gmail.com',
        phone: '0244123456',
        amount: 250,
        currency: 'GHS',
        frequency: 'one-time',
        payment_method: 'Mobile Money',
        payment_status: 'Completed',
        transaction_ref: 'MM-GH-89421',
        message: 'God bless the work you do for Cherubs Orphanage children!',
        is_anonymous: false,
        created_at: new Date('2026-09-28T14:32:00Z').toISOString()
      },
      {
        id: 2,
        donor_name: 'Emmanuel Osei',
        email: 'e.osei@yahoo.com',
        phone: '0501987654',
        amount: 500,
        currency: 'GHS',
        frequency: 'monthly',
        payment_method: 'Bank Transfer',
        payment_status: 'Completed',
        transaction_ref: 'BT-GH-10928',
        message: 'Monthly seed for school supplies and mattresses.',
        is_anonymous: false,
        created_at: new Date('2026-09-29T11:15:00Z').toISOString()
      },
      {
        id: 3,
        donor_name: 'Anonymous Supporter',
        email: 'anonymous@jjaf.org',
        phone: '—',
        amount: 100,
        currency: 'USD',
        frequency: 'one-time',
        payment_method: 'Card',
        payment_status: 'Completed',
        transaction_ref: 'STRIPE-SIM-5481',
        message: 'Praying for the children and staff.',
        is_anonymous: true,
        created_at: new Date('2026-09-30T16:45:00Z').toISOString()
      }
    ],
    messages: [
      {
        id: 1,
        name: 'Pastor Samuel K. Addo',
        email: 'pastor.addo@gmail.com',
        phone: '0207891234',
        subject: 'Partnership in Spiritual Encouragement and Children Outreach',
        message: 'Greetings in the name of the Lord. We were deeply moved by your foundation motto "the lord will provide". We would love to collaborate on your upcoming food drive and donate children bibles.',
        status: 'unread',
        created_at: new Date('2026-09-30T17:10:00Z').toISOString()
      },
      {
        id: 2,
        name: 'Akua Boateng',
        email: 'akua.boateng@outlook.com',
        phone: '0249876543',
        subject: 'Volunteering for Cherubs Orphanage Donation',
        message: 'Hello, I live near Santasi Apire and would love to join your team as a volunteer for your next visit. How can I get involved?',
        status: 'read',
        created_at: new Date('2026-09-29T09:20:00Z').toISOString()
      }
    ],
    activity_logs: [
      {
        id: 1,
        action: 'System Initialized',
        details: 'Jehovah Jireh Alby Foundation CMS loaded with official foundation wording and records.',
        timestamp: new Date().toISOString()
      }
    ]
  };
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      this.data = initial;
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, re-initializing:', err);
        this.data = getInitialData();
        this.save();
      }
    }
  }

  save() {
    try {
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  // Helper to dynamically calculate project status based on date
  resolveProjectStatus(project) {
    if (project.status_mode && project.status_mode !== 'auto') {
      return project.status_mode;
    }
    // Compare project date with today (2026-10-01)
    if (!project.date) return project.status || 'upcoming';
    const projectDate = new Date(project.date);
    const today = new Date();
    // Reset time for fair date-only comparison
    projectDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (projectDate < today) {
      return 'completed';
    } else if (projectDate.getTime() === today.getTime()) {
      return 'current';
    } else {
      return 'upcoming';
    }
  }

  getProjects() {
    return (this.data.projects || []).map(p => ({
      ...p,
      status: this.resolveProjectStatus(p)
    }));
  }

  getProjectById(id) {
    const p = (this.data.projects || []).find(item => item.id === Number(id));
    if (!p) return null;
    return {
      ...p,
      status: this.resolveProjectStatus(p)
    };
  }

  addProject(projectData) {
    const nextId = (this.data.projects.reduce((max, p) => Math.max(max, p.id || 0), 0) || 0) + 1;
    const newProject = {
      id: nextId,
      title: projectData.title || '',
      description: projectData.description || '',
      date: projectData.date || '',
      time: projectData.time || '',
      location: projectData.location || '',
      image: projectData.image || '/images/cherubs-outreach.jpg',
      additional_images: projectData.additional_images || [],
      status_mode: projectData.status_mode || 'auto',
      featured: Boolean(projectData.featured),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.projects.unshift(newProject);
    this.logActivity('Project Created', `Added project: "${newProject.title}"`);
    this.save();
    return { ...newProject, status: this.resolveProjectStatus(newProject) };
  }

  updateProject(id, updateData) {
    const index = this.data.projects.findIndex(p => p.id === Number(id));
    if (index === -1) return null;
    const existing = this.data.projects[index];
    const updated = {
      ...existing,
      ...updateData,
      id: existing.id,
      updated_at: new Date().toISOString()
    };
    this.data.projects[index] = updated;
    this.logActivity('Project Updated', `Updated project: "${updated.title}"`);
    this.save();
    return { ...updated, status: this.resolveProjectStatus(updated) };
  }

  deleteProject(id) {
    const p = this.getProjectById(id);
    this.data.projects = this.data.projects.filter(item => item.id !== Number(id));
    if (p) {
      this.logActivity('Project Deleted', `Removed project: "${p.title}"`);
    }
    this.save();
    return true;
  }

  getGallery() {
    return this.data.gallery || [];
  }

  addGalleryItem(item) {
    const nextId = (this.data.gallery.reduce((max, g) => Math.max(max, g.id || 0), 0) || 0) + 1;
    const newItem = {
      id: nextId,
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || 'General',
      image: item.image,
      featured: Boolean(item.featured),
      created_at: new Date().toISOString()
    };
    this.data.gallery.unshift(newItem);
    this.logActivity('Gallery Item Added', `Uploaded photo to album "${newItem.category}"`);
    this.save();
    return newItem;
  }

  updateGalleryItem(id, updateData) {
    const index = this.data.gallery.findIndex(g => g.id === Number(id));
    if (index === -1) return null;
    const existing = this.data.gallery[index];
    this.data.gallery[index] = { ...existing, ...updateData, id: existing.id };
    this.logActivity('Gallery Item Updated', `Updated photo id #${id}`);
    this.save();
    return this.data.gallery[index];
  }

  deleteGalleryItem(id) {
    this.data.gallery = this.data.gallery.filter(item => item.id !== Number(id));
    this.logActivity('Gallery Item Deleted', `Deleted photo id #${id}`);
    this.save();
    return true;
  }

  getDonations() {
    return this.data.donations || [];
  }

  addDonation(donationData) {
    const nextId = (this.data.donations.reduce((max, d) => Math.max(max, d.id || 0), 0) || 0) + 1;
    const ref = donationData.transaction_ref || `JJAF-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation = {
      id: nextId,
      donor_name: donationData.is_anonymous ? 'Anonymous Supporter' : (donationData.donor_name || 'Supporter'),
      email: donationData.email || '',
      phone: donationData.phone || '',
      amount: Number(donationData.amount) || 0,
      currency: donationData.currency || 'GHS',
      frequency: donationData.frequency || 'one-time',
      payment_method: donationData.payment_method || 'Mobile Money',
      payment_status: donationData.payment_status || 'Completed',
      transaction_ref: ref,
      message: donationData.message || '',
      is_anonymous: Boolean(donationData.is_anonymous),
      created_at: new Date().toISOString()
    };
    this.data.donations.unshift(newDonation);
    this.logActivity('Donation Received', `Received ${newDonation.currency} ${newDonation.amount} via ${newDonation.payment_method}`);
    this.save();
    return newDonation;
  }

  getMessages() {
    return this.data.messages || [];
  }

  addMessage(msgData) {
    const nextId = (this.data.messages.reduce((max, m) => Math.max(max, m.id || 0), 0) || 0) + 1;
    const newMsg = {
      id: nextId,
      name: msgData.name || '',
      email: msgData.email || '',
      phone: msgData.phone || '',
      subject: msgData.subject || 'General Inquiry',
      message: msgData.message || '',
      status: 'unread',
      created_at: new Date().toISOString()
    };
    this.data.messages.unshift(newMsg);
    this.logActivity('Contact Inquiry', `New message from ${newMsg.name}: "${newMsg.subject}"`);
    this.save();
    return newMsg;
  }

  updateMessageStatus(id, status) {
    const msg = this.data.messages.find(m => m.id === Number(id));
    if (msg) {
      msg.status = status;
      this.save();
      return msg;
    }
    return null;
  }

  deleteMessage(id) {
    this.data.messages = this.data.messages.filter(m => m.id !== Number(id));
    this.save();
    return true;
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
      updated_at: new Date().toISOString()
    };
    this.logActivity('Settings Updated', 'Foundation website settings and content updated');
    this.save();
    return this.data.settings;
  }

  getWhatWeDo() {
    return this.data.what_we_do;
  }

  updateWhatWeDo(items) {
    this.data.what_we_do = items;
    this.save();
    return this.data.what_we_do;
  }

  getActivityLogs() {
    return (this.data.activity_logs || []).slice(0, 50);
  }

  logActivity(action, details) {
    if (!this.data.activity_logs) this.data.activity_logs = [];
    const nextId = (this.data.activity_logs.reduce((max, l) => Math.max(max, l.id || 0), 0) || 0) + 1;
    this.data.activity_logs.unshift({
      id: nextId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    if (this.data.activity_logs.length > 100) {
      this.data.activity_logs = this.data.activity_logs.slice(0, 100);
    }
  }

  findAdminByEmail(email) {
    return (this.data.admin_users || []).find(
      u => u.email.toLowerCase() === (email || '').toLowerCase()
    );
  }

  updateAdminPassword(adminId, newHashedPassword) {
    const user = (this.data.admin_users || []).find(u => u.id === Number(adminId));
    if (user) {
      user.password_hash = newHashedPassword;
      this.save();
      return true;
    }
    return false;
  }
}

module.exports = new Database();
