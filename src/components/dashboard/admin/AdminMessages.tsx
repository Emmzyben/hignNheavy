import React from "react";
import MessagingSection from "../MessagingSection";

interface AdminMessagesProps {
  initialContext?: { bookingId: string | null; participantId: string } | null;
  initialConversationId?: string | null;
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ initialContext, initialConversationId }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Messages</h1>
        <p className="text-muted-foreground">
          View and respond to messages from shippers, carriers, and escorts
        </p>
      </div>

      <MessagingSection
        initialContext={initialContext}
        initialConversationId={initialConversationId}
      />
    </div>
  );
};

export default AdminMessages;

