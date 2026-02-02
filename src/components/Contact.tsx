import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState<null | 'ok' | 'fail'>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSent(null);

    const db = getFirestore();
    const { name, email, message } = formData;

    const esc = (s: string) =>
      s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    try {
      await addDoc(collection(db, 'mail'), {
        to: ['hub.qirim@gmail.com'],
        replyTo: email,
        message: {
          subject: `Q-hub contact: ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          html: `
            <p><b>From:</b> ${esc(name)} &lt;${esc(email)}&gt;</p>
            <p>${esc(message).replace(/\n/g,'<br>')}</p>
          `,
        },
      });

      await addDoc(collection(db, 'contactMessages'), {
        name,
        email,
        message,
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

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('contact.title')}
          </h2>
          <p className="font-notosans text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{t('contact.info.email')}</h4>
                    <p className="text-gray-600">hub.qirim@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{t('contact.info.phone')}</h4>
                    <p className="text-gray-600">+380 95 681 2469</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{t('contact.info.address')}</h4>
                    <p className="text-gray-600 max-w-[220px]">
                      Q-hub<br />
                      {t('footer.contact.address')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* Success screen */}
            {sent === 'ok' ? (
              <div className="text-center space-y-4 py-10">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('contact.thanks.title') || 'Thank you!'}
                </h3>
                <p className="text-gray-600">
                  {t('contact.thanks.body') || 'Your message has been sent. We will get back to you soon.'}
                </p>
                <button
                  onClick={() => setSent(null)}
                  className="mt-4 inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {t('contact.thanks.send_another') || 'Send another message'}
                </button>
              </div>
            ) : (
              <>
                {/* Error banner */}
                {sent === 'fail' && (
                  <div className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {t('contact.error.title') || 'Failed to send'}
                      </p>
                      <p className="text-sm">
                        {t('contact.error.body') || 'Please try again a bit later.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center mb-6">
                  <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">{t('contact.form.send_message')}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('contact.form.placeholder_name')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('contact.form.placeholder_email')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.form.placeholder_message')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical disabled:bg-gray-100"
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:hover:bg-orange-500 disabled:opacity-70 text-white px-8 py-4 rounded-lg font-semibold transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('contact.form.sending') || 'Sending…'}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        {t('contact.form.submit')}
                      </>
                    )}
                  </button>
                </form>

                <p className="text-sm text-gray-500 mt-4">
                  {t('contact.form.note')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
