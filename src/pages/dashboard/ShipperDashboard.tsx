import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookingsList from "@/components/dashboard/BookingsList";
import NewBooking from "@/components/dashboard/NewBooking";
import ReviewBooking from "@/components/dashboard/ReviewBooking";
import PaymentSection from "@/components/dashboard/PaymentSection";
import MessagingSection from "@/components/dashboard/MessagingSection";
import TrackingSection from "@/components/dashboard/TrackingSection";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type DashboardView = "bookings" | "new-booking" | "reviews" | "payments" | "messages" | "tracking";

const ShipperDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<DashboardView>(
    (searchParams.get("section") as DashboardView) || "bookings"
  );
  const [chatContext, setChatContext] = useState<{ bookingId: string | null; participantId: string } | null>(null);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveView(section as DashboardView);
    }
  }, [searchParams]);

  const handleSectionChange = (section: string) => {
    setActiveView(section as DashboardView);
    setSearchParams({ section });
  };

  const handleStartChat = (participantId: string, bookingId: string | null = null) => {
    setChatContext({ bookingId, participantId });
    setActiveView("messages");
    setSearchParams({ section: "messages" });
  };

  const handleTrack = (bookingId?: string) => {
    setActiveView("tracking");
    if (bookingId) {
      setSearchParams({ section: "tracking", bookingId });
    } else {
      setSearchParams({ section: "tracking" });
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "bookings":
        return <BookingsList
          onTrack={handleTrack}
          onMessage={handleStartChat}
          onReview={() => setActiveView("reviews")}
        />;
      case "new-booking":
        return <NewBooking />;
      case "reviews":
        return <ReviewBooking />;
      case "payments":
        return <PaymentSection />;
      case "messages":
        return <MessagingSection
          initialContext={chatContext}
          initialConversationId={searchParams.get("conversationId")}
        />;
      case "tracking":
        return <TrackingSection initialBookingId={searchParams.get("bookingId")} />;
      default:
        return <BookingsList onTrack={handleTrack} onMessage={handleStartChat} />;
    }
  };

  return (
    <DashboardLayout
      activeSection={activeView}
      onSectionChange={handleSectionChange}
      onMessage={handleStartChat}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default ShipperDashboard;
