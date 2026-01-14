import { useState } from "react";
import BookingsList from "@/components/dashboard/BookingsList";
import NewBooking from "@/components/dashboard/NewBooking";
import ReviewBooking from "@/components/dashboard/ReviewBooking";
import PaymentSection from "@/components/dashboard/PaymentSection";
import MessagingSection from "@/components/dashboard/MessagingSection";
import TrackingSection from "@/components/dashboard/TrackingSection";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type DashboardView = "bookings" | "new-booking" | "reviews" | "payments" | "messages" | "tracking";

const ShipperDashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>("bookings");

  const renderContent = () => {
    switch (activeView) {
      case "bookings":
        return <BookingsList onTrack={() => setActiveView("tracking")} onMessage={() => setActiveView("messages")} />;
      case "new-booking":
        return <NewBooking />;
      case "reviews":
        return <ReviewBooking />;
      case "payments":
        return <PaymentSection />;
      case "messages":
        return <MessagingSection />;
      case "tracking":
        return <TrackingSection />;
      default:
        return <BookingsList onTrack={() => setActiveView("tracking")} onMessage={() => setActiveView("messages")} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeView} onSectionChange={(section) => setActiveView(section as DashboardView)}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default ShipperDashboard;
