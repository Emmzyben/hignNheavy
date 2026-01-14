import { useState } from "react";
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
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "shippers":
        return <ManageShippers />;
      case "carriers":
        return <ManageCarriers />;
      case "escorts":
        return <ManageEscorts />;
      case "quotes":
        return <ManageQuotes />;
      case "bookings":
        return <ManageBookings />;
      case "payouts":
        return <ManagePayouts />;
      case "messages":
        return <AdminMessages />;
      default:
        return <OverviewSection setActiveSection={(s: any) => setActiveSection(s as AdminSection)} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={(section) => setActiveSection(section as AdminSection)}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
