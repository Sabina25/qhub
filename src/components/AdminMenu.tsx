import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Globe } from 'lucide-react';

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();

  const openSite = () => {
    window.open('/', '_blank', 'noopener,noreferrer');
  };

  const menuItems = [
    {
      label: 'Add New News',
      route: '/admin/add-news',
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      icon: <PlusCircle className="w-8 h-8" />,
      external: false,
    },
    {
      label: 'Add New Project',
      route: '/admin/add-project',
      color: 'bg-green-100 text-green-800 hover:bg-green-200',
      icon: <PlusCircle className="w-8 h-8" />,
      external: false,
    },
    {
      label: 'Open Website',
      route: '/',
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      icon: <Globe className="w-8 h-8" />,
      external: true,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* top bar with quick link */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-raleway text-4xl font-bold text-gray-900">
            Admin Panel
          </h2>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-gray-800 shadow hover:bg-gray-50 border"
            title="Open website"
          >
            <Globe className="w-5 h-5" />
            <span>Open website</span>
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`cursor-pointer rounded-2xl shadow-md transition-all duration-300 p-6 ${item.color}`}
              onClick={() => (item.external ? openSite() : navigate(item.route))}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="text-xl font-semibold">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminMenu;
