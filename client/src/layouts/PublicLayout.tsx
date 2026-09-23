import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DemoSwitcher } from '../components/common/DemoSwitcher';
import { EmergencyModal } from '../components/booking/EmergencyModal';

export const PublicLayout: React.FC = () => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onOpenEmergencyModal={() => setIsEmergencyOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DemoSwitcher />
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
};

export const WorkerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DemoSwitcher />
    </div>
  );
};
