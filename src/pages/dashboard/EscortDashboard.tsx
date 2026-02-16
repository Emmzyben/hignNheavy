import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AvailableBookings from "@/components/dashboard/escort/AvailableBookings";
import VehiclesManagement from "@/components/dashboard/escort/VehiclesManagement";


import EscortWallet from "@/components/dashboard/escort/EscortWallet";
import MessagingSection from "@/components/dashboard/MessagingSection";
import ProviderReviews from "@/components/dashboard/ProviderReviews";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type TabType = 'available' | 'vehicles' | 'wallet' | 'messages' | 'reviews';

const EscortDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<TabType>(
    (searchParams.get("section") as TabType) || "available"
  );
  const [chatContext, setChatContext] = useState<{ bookingId: string | null; participantId: string } | null>(null);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section as TabType);
    }
  }, [searchParams]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section as TabType);
    setSearchParams({ section });
  };

  const handleStartChat = (participantId: string, bookingId: string | null = null) => {
    setChatContext({ bookingId, participantId });
    setActiveSection("messages");
    setSearchParams({ section: "messages" });
  };

  const renderContent = (): JSX.Element => {
    switch (activeSection) {
      case "available":
        return <AvailableBookings onMessage={handleStartChat} />;
      case "vehicles":
        return <VehiclesManagement />;


      case "wallet":
        return <EscortWallet />;
      case "messages":
        return <MessagingSection
          initialContext={chatContext}
          initialConversationId={searchParams.get("conversationId")}
        />;
      case "reviews":
        return <ProviderReviews />;
      default:
        return <AvailableBookings onMessage={handleStartChat} />;
    }
  };

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      onMessage={handleStartChat}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default EscortDashboard;
