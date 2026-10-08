import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import confetti from 'canvas-confetti';
import {
  Heart,
  Smartphone,
  Landmark,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

export default function Donate() {
  const { settings, refreshContent } = useContent();

  const [frequency, setFrequency] = useState('one-time'); // 'one-time' or 'monthly'
  const [currency, setCurrency] = useState('GHS'); // 'GHS' or 'USD'
  const [amount, setAmount] = useState('100');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money'); // 'Mobile Money', 'Bank Transfer', 'Card'

  const [formData, setFormData] = useState({
    donor_name: '',
    email: '',
    phone: '',
    message: '',
    is_anonymous: false
  });

  const [loading, setLoading] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const ghsPresets = ['50', '100', '250', '500', '1000', '2000'];
  const usdPresets = ['15', '25', '50', '100', '250', '500'];
  const activePresets = currency === 'GHS' ? ghsPresets : usdPresets;

  const handlePresetClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val);
    setAmount(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      setErrorMessage('Please enter a valid donation amount.');
      return;
    }

    if (!formData.is_anonymous && !formData.donor_name.trim()) {
      setErrorMessage('Please provide your name or check the anonymous donation option.');
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage('Please provide an email or phone number for receipt confirmation.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          email: formData.email,
          phone: formData.phone,
          amount: finalAmount,
          currency,
          frequency,
          payment_method: paymentMethod,
          message: formData.message,
          is_anonymous: formData.is_anonymous
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedDonation(data.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        refreshContent();
      } else {
        setErrorMessage(data.error || 'Failed to submit donation.');
      }
    } catch (err) {
      setErrorMessage('Network error while processing donation record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="section-navy" style={{ padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-300)', borderColor: 'rgba(212, 175, 55, 0.35)' }}>
            Support Our Mission
          </span>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>
            Donate to Jehovah Jireh Alby Foundation
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            “{settings?.motto || 'the lord will provide'}” — {settings?.scripture || 'Genesis 22:14'}. Your partnership provides food, shelter, mattresses, education, and health to orphaned and vulnerable children in Ghana.
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="section">
        <div className="container">
          {submittedDonation ? (
            /* Success Receipt Card */
            <div style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--white)', padding: '3.5rem 2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(212, 175, 55, 0.4)', boxShadow: 'var(--shadow-xl)', textAlign: 'center' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-full)', background: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid var(--emerald-600)' }}>
                <CheckCircle2 size={40} />
              </div>

              <h2 className="font-heading" style={{ fontSize: '2rem', color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
                Thank You for Sowing into Hope!
              </h2>

              <p style={{ fontSize: '1.1rem', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '2rem' }}>
                Your generous gift of <strong>{submittedDonation.currency} {submittedDonation.amount.toLocaleString()}</strong> has been recorded. May God abundantly bless and replenish you as you bless vulnerable children.
              </p>

              {/* Receipt Summary Box */}
              <div style={{ background: 'var(--bg-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '2rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                  <strong style={{ color: 'var(--navy-900)' }}>{submittedDonation.transaction_ref}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Donor:</span>
                  <span style={{ color: 'var(--navy-900)', fontWeight: 600 }}>{submittedDonation.donor_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Selected Payment Method:</span>
                  <span style={{ color: 'var(--navy-900)', fontWeight: 600 }}>{submittedDonation.payment_method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Frequency:</span>
                  <span style={{ textTransform: 'capitalize', color: 'var(--navy-900)', fontWeight: 600 }}>{submittedDonation.frequency}</span>
                </div>
              </div>

              {/* Payment Specific Instructions */}
              {submittedDonation.payment_method === 'Mobile Money' && (
                <div style={{ background: 'var(--gold-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-200)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>Next Step: Complete via Mobile Money</div>
                  <p style={{ color: 'var(--text-body)', marginBottom: '0.5rem' }}>{settings?.momo_instructions}</p>
                  <div><strong>Network:</strong> {settings?.momo_network}</div>
                  <div><strong>Official Number:</strong> {settings?.momo_number || '0248072279'}</div>
                  <div><strong>Account Name:</strong> {settings?.momo_account_name}</div>
                  <div><strong>Reference:</strong> {submittedDonation.transaction_ref}</div>
                </div>
              )}

              {submittedDonation.payment_method === 'Bank Transfer' && (
                <div style={{ background: 'var(--navy-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--navy-100)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>Bank Transfer Details</div>
                  <p style={{ color: 'var(--text-body)', marginBottom: '0.5rem' }}>{settings?.bank_instructions}</p>
                  <div><strong>Account Name:</strong> {settings?.bank_account_name}</div>
                  <div><strong>Bank / Details:</strong> {settings?.bank_name}</div>
                  <div><strong>Reference:</strong> {submittedDonation.transaction_ref}</div>
                </div>
              )}

              <button
                className="btn btn-navy"
                onClick={() => {
                  setSubmittedDonation(null);
                  setFormData({ donor_name: '', email: '', phone: '', message: '', is_anonymous: false });
                }}
              >
                Make Another Gift
              </button>
            </div>
          ) : (
            /* Donation Form Grid */
            <div className="donation-page-grid">
              {/* Left Column: Form */}
              <div className="donation-form-card">
                <h2 className="font-heading" style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                  Choose Your Contribution
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                  Select frequency, currency, and amount. Every Cedi or Dollar reaches children in need.
                </p>

                {errorMessage && (
                  <div style={{ padding: '0.85rem 1rem', background: 'var(--rose-50)', border: '1px solid var(--rose-600)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Frequency Tabs */}
                  <div className="donation-tabs">
                    <button
                      type="button"
                      className={`donation-tab ${frequency === 'one-time' ? 'active' : ''}`}
                      onClick={() => setFrequency('one-time')}
                    >
                      One-Time Gift
                    </button>
                    <button
                      type="button"
                      className={`donation-tab ${frequency === 'monthly' ? 'active' : ''}`}
                      onClick={() => setFrequency('monthly')}
                    >
                      Monthly Partner
                    </button>
                  </div>

                  {/* Currency Picker */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy-900)' }}>Select Currency:</span>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${currency === 'GHS' ? 'btn-navy' : 'btn-ghost'}`}
                        onClick={() => { setCurrency('GHS'); setAmount('100'); setCustomAmount(''); }}
                      >
                        Ghana Cedi (GH₵)
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${currency === 'USD' ? 'btn-navy' : 'btn-ghost'}`}
                        onClick={() => { setCurrency('USD'); setAmount('50'); setCustomAmount(''); }}
                      >
                        US Dollar ($)
                      </button>
                    </div>
                  </div>

                  {/* Amount Presets */}
                  <div className="amount-presets-grid">
                    {activePresets.map((val) => (
                      <button
                        type="button"
                        key={val}
                        className={`amount-preset-btn ${amount === val && !customAmount ? 'active' : ''}`}
                        onClick={() => handlePresetClick(val)}
                      >
                        {currency === 'GHS' ? 'GH₵ ' : '$ '}
                        {val}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="form-group">
                    <label className="form-label">Or Custom Amount ({currency}):</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Enter custom amount in ${currency}`}
                      value={customAmount}
                      onChange={handleCustomChange}
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <label className="form-label" style={{ marginTop: '1.5rem' }}>Payment Method:</label>
                  <div className="payment-method-selector">
                    <div
                      className={`method-choice-card ${paymentMethod === 'Mobile Money' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('Mobile Money')}
                    >
                      <Smartphone size={22} style={{ color: 'var(--gold-600)' }} />
                      <span>Mobile Money</span>
                    </div>

                    <div
                      className={`method-choice-card ${paymentMethod === 'Bank Transfer' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('Bank Transfer')}
                    >
                      <Landmark size={22} style={{ color: 'var(--navy-700)' }} />
                      <span>Bank Transfer</span>
                    </div>

                    <div
                      className={`method-choice-card ${paymentMethod === 'Card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('Card')}
                    >
                      <CreditCard size={22} style={{ color: 'var(--navy-700)' }} />
                      <span>Card / Online</span>
                    </div>
                  </div>

                  {/* Payment Details Note (Ghana-friendly configuration) */}
                  <div className="method-info-box">
                    {paymentMethod === 'Mobile Money' && (
                      <div>
                        <div className="method-info-title">
                          <Smartphone size={16} style={{ color: 'var(--gold-600)' }} />
                          <span>Mobile Money (Ghana)</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                          Official foundation number: <strong>{settings?.phone || '0248072279'}</strong> ({settings?.momo_account_name || 'Jehovah Jireh Alby Foundation'}). Configured for instant mobile money transfers across Ghana networks.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'Bank Transfer' && (
                      <div>
                        <div className="method-info-title">
                          <Landmark size={16} style={{ color: 'var(--navy-700)' }} />
                          <span>Bank Wire / Direct Transfer</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                          Account details are securely maintained by foundation administration. Submitting this form generates a certified tracking receipt for your transfer.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'Card' && (
                      <div>
                        <div className="method-info-title">
                          <Lock size={16} style={{ color: 'var(--gold-600)' }} />
                          <span>Debit / Credit Card Gateway</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                          Structured for direct integration with Paystack / Hubtel / Flutterwave Ghanaian payment providers once the foundation's production API keys are activated.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Donor Info Fields */}
                  <div className="form-group">
                    <label className="form-label">Full Name:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Samuel Mensah"
                      value={formData.donor_name}
                      disabled={formData.is_anonymous}
                      onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address:</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. samuel@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number:</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. 0248072279"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Optional Prayer or Encouragement Message:</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="Write a message of love or prayer for the children..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <label className="form-checkbox-label" style={{ marginBottom: '1.75rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_anonymous}
                      onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    />
                    <span>Make my donation anonymous (do not display my name in public acknowledgements)</span>
                  </label>

                  <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                    style={{ width: '100%' }}
                    disabled={loading}
                  >
                    <Heart size={18} fill="var(--navy-950)" />
                    <span>{loading ? 'Processing...' : `Donate ${currency === 'GHS' ? 'GH₵' : '$'} ${amount || '0'}`}</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--gold-600)' }} />
                    <span>Secure record • Dedicated directly to orphans and needy children in Ghana</span>
                  </div>
                </form>
              </div>

              {/* Right Column: Trust & Impact Narrative */}
              <div>
                <div style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(212, 175, 55, 0.35)', marginBottom: '2rem' }}>
                  <span className="section-tag" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-300)' }}>
                    “{settings?.motto || 'the lord will provide'}”
                  </span>
                  <h3 className="font-heading" style={{ fontSize: '1.65rem', color: 'var(--white)', margin: '1rem 0' }}>
                    Where Your Donation Goes
                  </h3>
                  <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.975rem', marginBottom: '1.5rem' }}>
                    100% of community contributions go directly toward tangible resources for vulnerable children:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--gold-400)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Orphanage Home Donations:</strong> Direct delivery of care packages, food items, toiletries to Cherubs and other homes.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--gold-400)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Food &amp; Clothing Drives:</strong> Ensuring children have clean garments, footwear, and nutritious meals.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--gold-400)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>School Supplies &amp; Mattresses:</strong> Providing backpacks, notebooks, pens, and hygienic mattresses.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--gold-400)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Medical &amp; Spiritual Support:</strong> First-aid supplies, health screenings, and uplifting Christian fellowship.</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-light)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
                  <h4 className="font-heading" style={{ color: 'var(--navy-900)', marginBottom: '0.75rem', fontSize: '1.15rem' }}>
                    Questions About Donating?
                  </h4>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    You can contact the foundation leadership directly by phone or email regarding in-kind donations, corporate sponsorship, or church partnerships.
                  </p>

                  <div style={{ fontSize: '0.9rem', color: 'var(--navy-900)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div><strong>Phone:</strong> {settings?.phone || '0248072279'}</div>
                    <div><strong>Email:</strong> {settings?.email || 'Jehovahjirehalbyfoundation@gmail.com'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
