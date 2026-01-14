import { useState } from 'react';
import AvailableBookings from '@/components/dashboard/carrier/AvailableBookings';
import DriversManagement from '@/components/dashboard/carrier/DriversManagement';
import EquipmentManagement from '@/components/dashboard/carrier/EquipmentManagement';
import PricingSettings from '@/components/dashboard/carrier/PricingSettings';
import CarrierPayouts from '@/components/dashboard/carrier/CarrierPayouts';
import CarrierWallet from '@/components/dashboard/carrier/CarrierWallet';
import CarrierMessaging from '@/components/dashboard/carrier/CarrierMessaging';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

type TabType = 'bookings' | 'drivers' | 'equipment' | 'pricing' | 'payouts' | 'wallet' | 'messages';

const CarrierDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('bookings');

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <AvailableBookings />;
      case 'drivers':
        return <DriversManagement />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'pricing':
        return <PricingSettings />;
      case 'payouts':
        return <CarrierPayouts />;
      case 'wallet':
        return <CarrierWallet />;
      case 'messages':
        return <CarrierMessaging />;
      default:
        return <AvailableBookings />;
    }
  };

  return (
    <DashboardLayout activeSection={activeTab} onSectionChange={(section) => setActiveTab(section as TabType)}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default CarrierDashboard;
