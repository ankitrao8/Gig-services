import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, IndianRupee, Award, User, IdCard } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const WorkerMobileBottomNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/worker/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/worker/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/worker/earnings', label: 'Earnings', icon: IndianRupee },
    { to: '/worker/skills', label: 'Skills', icon: Award },
    { to: '/worker/id-card', label: 'ID Card', icon: IdCard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2 px-3 shadow-lg flex justify-around items-center">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition touch-manipulation min-w-[56px] ${
              isActive
                ? 'text-coop-700 font-bold bg-coop-50'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`
          }
        >
          <item.icon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
