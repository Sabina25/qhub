import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
                    <p className="text-gray-600">
                      Q-hub<br />
                      вул. Омельяновича-Павленка, 9<br />
                      Київ, Україна
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t('contact.info.hours')}
              </h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>{t('contact.info.mon_fri')}</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('contact.info.sat')}</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('contact.info.sun')}</span>
                  <span>{t('contact.info.closed')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">{t('contact.form.send_message')}</h3>
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
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.placeholder_name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.subject')}
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('contact.form.subject_options.select')}</option>
                  <option value="membership">{t('contact.form.subject_options.membership')}</option>
                  <option value="partnership">{t('contact.form.subject_options.partnership')}</option>
                  <option value="events">{t('contact.form.subject_options.events')}</option>
                  <option value="projects">{t('contact.form.subject_options.projects')}</option>
                  <option value="media">{t('contact.form.subject_options.media')}</option>
                  <option value="other">{t('contact.form.subject_options.other')}</option>
                </select>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition"
              >
                <Send className="h-5 w-5 inline mr-2" />
                {t('contact.form.submit')}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">{t('contact.form.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
