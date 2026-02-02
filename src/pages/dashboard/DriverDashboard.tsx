import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MessagingSection from '@/components/dashboard/MessagingSection';

// We'll import specialized dashboard components
import AvailableLoads from '@/components/dashboard/driver/AvailableLoads';
import MyTrips from '@/components/dashboard/driver/MyTrips';
import ActiveTrip from '@/components/dashboard/driver/ActiveTrip';
import DriverProfile from '@/components/dashboard/driver/DriverProfile';

type TabType = 'requests' | 'trips' | 'active' | 'messages' | 'profile';

const DriverDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabType>(
        (searchParams.get("section") as TabType) || 'requests'
    );
    const [chatContext, setChatContext] = useState<{ bookingId: string | null; participantId: string } | null>(null);

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
            case 'requests':
                return <AvailableLoads />;
            case 'trips':
                return <MyTrips />;
            case 'active':
                return <ActiveTrip onMessage={handleStartChat} />;
            case 'messages':
                return <MessagingSection
                    initialContext={chatContext}
                    initialConversationId={searchParams.get("conversationId")}
                />;
            case 'profile':
                return <DriverProfile />;
            default:
                return <AvailableLoads />;
        }
    };

    return (
        <DashboardLayout
            activeSection={activeTab}
            onSectionChange={handleSectionChange}
            onMessage={handleStartChat}
        >
            <div className="max-w-2xl mx-auto">
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

export default DriverDashboard;
