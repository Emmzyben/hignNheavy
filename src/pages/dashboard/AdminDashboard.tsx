import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ManageShippers from "@/components/dashboard/admin/ManageShippers";
import ManageCarriers from "@/components/dashboard/admin/ManageCarriers";
import ManageEscorts from "@/components/dashboard/admin/ManageEscorts";
import ManageBookings from "@/components/dashboard/admin/ManageBookings";
import ManagePayouts from "@/components/dashboard/admin/ManagePayouts";
import OverviewSection from "@/components/dashboard/admin/OverviewSection";
import AdminMessages from "@/components/dashboard/admin/AdminMessages";
import ManageQuotes from "@/components/dashboard/admin/ManageQuotes";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type AdminSection = "overview" | "shippers" | "carriers" | "escorts" | "bookings" | "payouts" | "messages" | "quotes";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<AdminSection>(
    (searchParams.get("section") as AdminSection) || "overview"
  );
  const [chatContext, setChatContext] = useState<{ bookingId: string | null; participantId: string } | null>(null);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section as AdminSection);
    }
  }, [searchParams]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section as AdminSection);
    setSearchParams({ section });
  };

  const handleStartChat = (participantId: string, bookingId: string | null = null) => {
    setChatContext({ bookingId, participantId });
    setActiveSection("messages");
    setSearchParams({ section: "messages" });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "shippers":
        return <ManageShippers onMessage={handleStartChat} />;
      case "carriers":
        return <ManageCarriers onMessage={handleStartChat} />;
      case "escorts":
        return <ManageEscorts onMessage={handleStartChat} />;
      case "quotes":
        return <ManageQuotes />;
      case "bookings":
        return <ManageBookings />;
      case "payouts":
        return <ManagePayouts />;
      case "messages":
        return <AdminMessages
          initialContext={chatContext}
          initialConversationId={searchParams.get("conversationId")}
        />; // Standard prop passing

      default:
        return <OverviewSection setActiveSection={(s: any) => setActiveSection(s as AdminSection)} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
