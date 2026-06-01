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
        <p className="text-muted-foreground font-medium">
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

