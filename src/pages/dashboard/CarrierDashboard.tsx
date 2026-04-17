import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import AvailableBookings from '@/components/dashboard/carrier/AvailableBookings';
import DriversManagement from '@/components/dashboard/carrier/DriversManagement';
import EquipmentManagement from '@/components/dashboard/carrier/EquipmentManagement';


import CarrierWallet from '@/components/dashboard/carrier/CarrierWallet';
import MessagingSection from '@/components/dashboard/MessagingSection';
import ProviderReviews from '@/components/dashboard/ProviderReviews';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/lib/api';

type TabType = 'bookings' | 'drivers' | 'equipment' | 'wallet' | 'messages' | 'reviews';

const CarrierDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get("section") as TabType) || 'bookings'
  );
  const [chatContext, setChatContext] = useState<{ bookingId: string | null; participantId: string } | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardResources();
  }, []);

  const fetchDashboardResources = async () => {
    setLoading(true);
    try {
      const [driversRes, equipmentRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/vehicles')
      ]);
      if (driversRes.data.success) setDrivers(driversRes.data.data);
      if (equipmentRes.data.success) setEquipment(equipmentRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveTab(section as TabType);
    }
  }, [searchParams]);

  const handleSectionChange = (section: string) => {
    setActiveTab(section as TabType);
    setSearchParams({ section });
  };

  const handleStartChat = (participantId: string, bookingId: string | null = null) => {
    setChatContext({ bookingId, participantId });
    setActiveTab('messages');
    setSearchParams({ section: "messages" });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <AvailableBookings 
          onMessage={handleStartChat} 
          initialDrivers={drivers} 
          initialEquipment={equipment} 
        />;
      case 'drivers':
        return <DriversManagement 
          initialDrivers={drivers} 
          onRefresh={fetchDashboardResources} 
        />;
      case 'equipment':
        return <EquipmentManagement 
          initialEquipment={equipment} 
          onRefresh={fetchDashboardResources} 
        />;


      case 'wallet':
        return <CarrierWallet />;
      case 'messages':
        return <MessagingSection
          initialContext={chatContext}
          initialConversationId={searchParams.get("conversationId")}
        />;
      case 'reviews':
        return <ProviderReviews />;
      default:
        return <AvailableBookings 
          onMessage={handleStartChat} 
          initialDrivers={drivers} 
          initialEquipment={equipment} 
        />;
    }
  };

  return (
    <DashboardLayout
      activeSection={activeTab}
      onSectionChange={handleSectionChange}
      onMessage={handleStartChat}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default CarrierDashboard;
