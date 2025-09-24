import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const { t } = useTranslation();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setErrorMsg(null);
    setSending(true);

    const { name, email, message } = formData;
    const esc = (s: string) =>
      s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    try {
      // Триггер письма для расширения
      await addDoc(collection(db, 'mail'), {
        to: ['hub.qirim@gmail.com'],
        replyTo: email,
        message: {
          subject: `Q-hub contact: ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          html: `<p><b>From:</b> ${esc(name)} &lt;${esc(email)}&gt;</p><p>${esc(message).replace(/\n/g,'<br>')}</p>`,
        },
      });

      // Лог во вторую коллекцию
      await addDoc(collection(db, 'contactMessages'), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
        source: 'website',
      });

      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(t('contact.form.error') || 'Не удалось отправить. Попробуйте позже.');
    } finally {
      setSending(false);
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

        {/* Спасибо-экран */}
        {sent ? (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-10 text-center">
            <div className="mb-4 text-3xl">🎉</div>
            <h3 className="text-2xl font-bold mb-2">
              {t('contact.thanks.title') || 'Дякуємо! / Thank you!'}
            </h3>
            <p className="text-gray-600">
              {t('contact.thanks.text') || 'Ми отримали ваше повідомлення і зв’яжемося з вами найближчим часом.'}
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {t('contact.thanks.send_another') || 'Надіслати ще одне'}
            </button>
          </div>
        ) : (
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
                      <p className="text-gray-600">
                        Q-hub<br />
                        вул. Олени Пчілки, буд. 6-а, кв. 69,<br />
                        Київ, Україна 02081
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {/* Error banner */}
              {errorMsg && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('contact.form.send_message')}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      disabled={sending}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.form.placeholder_name')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                      disabled={sending}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.form.placeholder_email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                    disabled={sending}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.placeholder_message')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical disabled:bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold transition inline-flex items-center justify-center"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t('contact.form.sending') || 'Надсилаємо…'}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>

              <p className="text-sm text-gray-500 mt-4">{t('contact.form.note')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
