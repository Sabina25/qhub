import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, Home, Newspaper, FolderPlus, Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import { IdleWarning } from "./IdleWarning";
import { useIdleLogout } from '../hooks/useIdleLogout';

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Home, end: true },
  { to: "/admin/add-news", label: "Add News", icon: Newspaper },
  { to: "/admin/add-project", label: "Add Project", icon: FolderPlus },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { isWarning, timeLeftMs, markActivity } = useIdleLogout({
    timeoutMs: 60 * 60 * 1000,      
    warnMs: 60 * 1000,              
    onLogout: async () => {
      try {
        await signOut(auth);
      } finally {
        navigate('/login?reason=idle');
      }
    },
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (e) {
      console.error(e);
      alert("Failed to logout");
    }
  };

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 transition
     ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          <span className="font-semibold">Admin</span>
        </div>
        <button
          className="rounded-xl border px-3 py-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside
          className={`${
            open ? "block" : "hidden"
          } md:block border-r bg-white md:sticky md:top-0 md:h-screen`}
        >
          <div className="flex items-center gap-2 px-4 py-4 border-b">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Admin Panel</span>
          </div>

          <nav className="space-y-1 p-3">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={itemClass} onClick={() => setOpen(false)}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 border-t p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="p-4 md:p-8">
          {/* Optional: page header placeholder */}
          {/* <div className="mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div> */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
      <IdleWarning
        visible={isWarning}
        timeLeftMs={timeLeftMs}
        onStay={markActivity}
      />
    </div>
  );
}
