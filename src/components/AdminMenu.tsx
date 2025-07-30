import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Add New News',
      route: '/admin/add-news',
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    },
    {
      label: 'Add New Project',
      route: '/admin/add-project',
      color: 'bg-green-100 text-green-800 hover:bg-green-200',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="font-raleway text-4xl font-bold text-center text-gray-900 mb-12">
          Admin Panel
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`cursor-pointer rounded-2xl shadow-md transition-all duration-300 p-6 ${item.color}`}
              onClick={() => navigate(item.route)}
            >
              <div className="flex items-center gap-4">
                <PlusCircle className="w-8 h-8" />
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
