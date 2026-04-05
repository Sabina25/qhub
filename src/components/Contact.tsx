import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Q = {
  teal: '#4db8b8', teal2: '#2d7d9a',
  text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)',
  faint: 'rgba(200,230,230,0.38)',
  bg: '#080c14',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: '0.5px solid rgba(77,184,184,0.25)',
  background: 'rgba(255,255,255,0.05)',
  color: Q.text,
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: Q.faint,
  marginBottom: 8,
  display: 'block',
};

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState<null | 'ok' | 'fail'>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSent(null);
    const db = getFirestore();
    const { name, email, message } = formData;
    const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    try {
      await addDoc(collection(db, 'mail'), {
        to: ['hub.qirim@gmail.com'],
        replyTo: email,
        message: {
          subject: `Q-hub contact: ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          html: `<p><b>From:</b> ${esc(name)} &lt;${esc(email)}&gt;</p><p>${esc(message).replace(/\n/g,'<br>')}</p>`,
        },
      });
      await addDoc(collection(db, 'contactMessages'), {
        name, email, message,
        createdAt: serverTimestamp(),
        source: 'website',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSent('ok');
    } catch (err) {
      console.error(err);
      setSent('fail');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (name: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focused === name ? Q.teal : 'rgba(77,184,184,0.2)',
    boxShadow: focused === name ? `0 0 0 2px rgba(77,184,184,0.12)` : 'none',
  });

  const contactItems = [
    { Icon: Mail,   label: t('contact.info.email'),   value: 'hub.qirim@gmail.com',   href: 'mailto:hub.qirim@gmail.com' },
    { Icon: Phone,  label: t('contact.info.phone'),   value: '+380 95 681 2469',        href: 'tel:+380956812469' },
    { Icon: MapPin, label: t('contact.info.address'), value: `Q-hub · ${t('footer.contact.address')}`, href: undefined },
  ];

  return (
    <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">

      {/* Heading */}
      <div className="text-center mb-10">
        
        <h2 className="font-raleway font-semibold text-3xl sm:text-4xl md:text-5xl mb-4" style={{ color: Q.text }}>
          {t('contact.title')}
        </h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 14px' }} />
        <p className="text-lg max-w-2xl mx-auto" style={{ color: Q.muted }}>{t('contact.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ── Left: info + contact items ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Info card */}
          <div style={{ borderRadius: 16, padding: '28px 28px', background: 'rgba(77,184,184,0.06)', border: '0.5px solid rgba(77,184,184,0.22)', flex: 1 }}>
            <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, marginBottom: 16 }} />
            <h3 className="font-raleway font-semibold text-xl mb-3" style={{ color: Q.text }}>
              {t('contact.info.title')}
            </h3>
        

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {contactItems.map(({ Icon, label, value, href }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(77,184,184,0.1)', border: '0.5px solid rgba(77,184,184,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 17, height: 17, color: Q.teal }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: Q.faint, marginBottom: 3 }}>
                      {label}
                    </p>
                    {href ? (
                      <a href={href} style={{ fontSize: 14, color: Q.text, textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = Q.teal)}
                        onMouseLeave={e => (e.currentTarget.style.color = Q.text)}>
                        {value}
                      </a>
                    ) : (
                      <p style={{ fontSize: 14, color: Q.text }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teal accent strip */}
          <div style={{ borderRadius: 12, padding: '16px 22px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(77,184,184,0.1)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <MessageSquare style={{ width: 18, height: 18, color: Q.teal, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: Q.muted, lineHeight: 1.5 }}>
              {t('contact.form.note') || 'Зазвичай відповідаємо протягом 24 годин'}
            </p>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div style={{ borderRadius: 16, padding: '28px 28px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(77,184,184,0.15)' }}>

          {/* Success */}
          {sent === 'ok' ? (
            <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(77,184,184,0.12)', border: '0.5px solid rgba(77,184,184,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle style={{ width: 26, height: 26, color: Q.teal }} />
              </div>
              <h3 className="font-raleway font-semibold text-2xl" style={{ color: Q.text }}>
                {t('contact.thanks.title') || 'Дякуємо!'}
              </h3>
              <p style={{ fontSize: 14, color: Q.muted, maxWidth: 300 }}>
                {t('contact.thanks.body') || 'Ваше повідомлення надіслано. Ми зв\'яжемося з вами найближчим часом.'}
              </p>
              <button onClick={() => setSent(null)}
                style={{ marginTop: 8, padding: '10px 24px', borderRadius: 30, border: `0.5px solid rgba(77,184,184,0.4)`, background: 'transparent', color: Q.teal, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,184,184,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {t('contact.thanks.send_another') || 'Надіслати ще'}
              </button>
            </div>
          ) : (
            <>
              {/* Error */}
              {sent === 'fail' && (
                <div style={{ marginBottom: 20, display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,100,100,0.25)' }}>
                  <AlertCircle style={{ width: 18, height: 18, color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>{t('contact.error.title') || 'Помилка'}</p>
                    <p style={{ fontSize: 12, color: 'rgba(248,113,113,0.7)' }}>{t('contact.error.body') || 'Спробуйте пізніше.'}</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2 }} />
                <h3 className="font-raleway font-semibold text-xl" style={{ color: Q.text }}>
                  {t('contact.form.send_message')}
                </h3>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" style={labelStyle}>{t('contact.form.name')}</label>
                    <input type="text" id="name" name="name" required
                      value={formData.name} onChange={handleChange}
                      placeholder={t('contact.form.placeholder_name')}
                      style={getInputStyle('name')} disabled={isSubmitting}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>{t('contact.form.email')}</label>
                    <input type="email" id="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder={t('contact.form.placeholder_email')}
                      style={getInputStyle('email')} disabled={isSubmitting}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>{t('contact.form.message')}</label>
                  <textarea id="message" name="message" required rows={5}
                    value={formData.message} onChange={handleChange}
                    placeholder={t('contact.form.placeholder_message')}
                    style={{ ...getInputStyle('message'), resize: 'vertical', minHeight: 120 }}
                    disabled={isSubmitting}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} />
                </div>

                <button type="submit" disabled={isSubmitting}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px 28px', borderRadius: 30,
                    background: isSubmitting ? 'rgba(249,115,22,0.6)' : '#f97316',
                    border: 'none', color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {isSubmitting ? (
                    <><Loader2 style={{ width: 17, height: 17, animation: 'spin 1s linear infinite' }} />{t('contact.form.sending') || 'Надсилаємо…'}</>
                  ) : (
                    <><Send style={{ width: 17, height: 17 }} />{t('contact.form.submit')}</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
