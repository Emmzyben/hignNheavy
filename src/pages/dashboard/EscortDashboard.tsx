import { useState } from "react";
import AvailableBookings from "@/components/dashboard/escort/AvailableBookings";
import VehiclesManagement from "@/components/dashboard/escort/VehiclesManagement";
import PricingSettings from "@/components/dashboard/escort/PricingSettings";
import EscortPayouts from "@/components/dashboard/escort/EscortPayouts";
import EscortWallet from "@/components/dashboard/escort/EscortWallet";
import EscortMessaging from "@/components/dashboard/escort/EscortMessaging";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type TabType = 'available' | 'vehicles' | 'pricing' | 'payouts' | 'wallet' | 'messages';

const EscortDashboard = () => {
  const [activeSection, setActiveSection] = useState<TabType>("available");

  const renderContent = () => {
    switch (activeSection) {
      case "available":
        return <AvailableBookings />;
      case "vehicles":
        return <VehiclesManagement />;
      case "pricing":
        return <PricingSettings />;
      case "payouts":
        return <EscortPayouts />;
      case "wallet":
        return <EscortWallet />;
      case "messages":
        return <EscortMessaging />;
      default:
        return <AvailableBookings />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={(section) => setActiveSection(section as TabType)}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default EscortDashboard;
