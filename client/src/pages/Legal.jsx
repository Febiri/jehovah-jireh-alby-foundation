import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

function PageShell({ tag, title, intro, children }) {
  return (
    <div>
      <section className="section-navy" style={{ padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            {tag}
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h1>
          {intro && <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.7' }}>{intro}</p>}
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="legal-body">{children}</div>
        </div>
      </section>
    </div>
  );
}

export function Privacy() {
  const { settings } = useContent();
  return (
    <PageShell tag="Privacy" title="Privacy Policy" intro="How we collect, use and protect your information when you donate, contact us, or browse this site.">
      <p><strong>Last updated:</strong> October 2026</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Donation pledges: name (unless anonymous), email or phone, amount, payment method, reference and message.</li>
        <li>Contact messages: name, email, phone, subject and message content.</li>
        <li>Technical data: basic server logs needed for security and reliability.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To record and confirm pledges, issue references, and respond to enquiries.</li>
        <li>To operate outreach programs and improve our services.</li>
        <li>We do not sell personal data. Donor contact details are visible only to authorized administrators.</li>
      </ul>
      <h2>Children's privacy</h2>
      <p>We publish photos of outreach only with appropriate consent from guardians and partner homes. To request removal of an image, contact <a href={`mailto:${settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}`}>{settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}</a>.</p>
      <h2>Your rights</h2>
      <p>You may request access, correction or deletion of your personal data at any time via the <Link to="/contact">contact page</Link>.</p>
    </PageShell>
  );
}

export function Terms() {
  return (
    <PageShell tag="Terms" title="Terms of Use" intro="The ground rules for using this website and its content.">
      <h2>About this site</h2>
      <p>This website presents the work of the Jehovah Jireh Alby Foundation and records donation pledges. Online payments are not yet processed on this site; pledges are confirmed manually by an administrator.</p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Do not submit false, misleading or unlawful content through our forms.</li>
        <li>Do not attempt to disrupt the site or access administrator areas without authorization.</li>
        <li>Foundation photos and text may be shared with credit for non-commercial charitable awareness; contact us for other uses.</li>
      </ul>
      <h2>Liability</h2>
      <p>Content is provided in good faith. Program dates, needs and bank details may change; confirmed details are communicated directly by the foundation.</p>
    </PageShell>
  );
}

export function Safeguarding() {
  const { settings } = useContent();
  return (
    <PageShell tag="Child Protection" title="Safeguarding & Child Protection" intro="Every child deserves love, safety, education and a future. Protection comes first in everything we publish and do.">
      <h2>Our commitment</h2>
      <ul>
        <li>We prioritize the safety, dignity and privacy of orphans, street children and vulnerable children in all programs.</li>
        <li>Outreach is conducted with partner homes and responsible adults; volunteers follow codes of conduct.</li>
        <li>Photos are shared only with consent and never include sensitive personal details (surnames, exact locations of children, case histories).</li>
      </ul>
      <h2>Report a concern</h2>
      <p>If you have a safeguarding concern about any child, image or activity connected to us, contact us immediately: <a href={`tel:${settings?.phone || '0248072279'}`}>{settings?.phone || '0248072279'}</a> or <Link to="/contact">send a confidential message</Link>. We will act promptly and involve the appropriate authorities where required.</p>
    </PageShell>
  );
}

export function Transparency() {
  return (
    <PageShell tag="Transparency" title="Transparency & Reports" intro="How donations are handled today, and where verified financial summaries will be published.">
      <h2>How giving works right now</h2>
      <ul>
        <li>Online giving is <strong>pledge-based</strong>: you submit a pledge, complete the transfer via Mobile Money or bank, and an administrator marks it <strong>Completed</strong> after verifying receipt.</li>
        <li>Every pledge receives a tracking reference (e.g. JJAF-XXXX). Keep it for follow-up.</li>
        <li>Live payment-gateway integration (Paystack / Hubtel / Flutterwave) is planned; until then no card is charged on this website.</li>
      </ul>
      <h2>Accountability</h2>
      <ul>
        <li>Donations fund orphanage support, food and clothing drives, school supplies and mattresses, medical support and spiritual care.</li>
        <li>Annual activity and financial summaries will be published on this page as audited statements become available.</li>
        <li>For receipts, corporate sponsorship or in-kind donations, <Link to="/contact">contact the foundation</Link> directly.</li>
      </ul>
      <h2>Registration</h2>
      <p>Registered Charitable Foundation · Ghana. Registration certificate and number will be displayed here once the administrator uploads them in Settings.</p>
    </PageShell>
  );
}

export function NotFound() {
  return (
    <div>
      <section className="section-navy" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 className="hero-title" style={{ fontSize: '3rem' }}>Page not found</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>The page you requested does not exist or was moved.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-gold">Go Home</Link>
            <Link to="/contact" className="btn btn-ghost">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
