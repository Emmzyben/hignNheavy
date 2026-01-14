import { useState } from "react";
import { Send, Search, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const conversations = [
  {
    id: 1,
    carrier: "Texas Heavy Haul Co.",
    bookingId: "BK-001",
    lastMessage: "The load is on schedule. ETA tomorrow 2pm.",
    time: "10:30 AM",
    unread: 2,
    avatar: "TH",
  },
  {
    id: 2,
    carrier: "Big Rig Transport LLC",
    bookingId: "BK-002",
    lastMessage: "Delivery completed successfully. Thank you for your business!",
    time: "Yesterday",
    unread: 0,
    avatar: "BR",
  },
  {
    id: 3,
    carrier: "West Texas Haulers",
    bookingId: "BK-005",
    lastMessage: "We'll need the pickup address confirmed before scheduling.",
    time: "Jan 20",
    unread: 1,
    avatar: "WT",
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "carrier",
    text: "Hello! I'm assigned to transport your construction equipment from Houston to Dallas.",
    time: "9:00 AM",
  },
  {
    id: 2,
    sender: "user",
    text: "Great! What time do you expect to arrive for pickup?",
    time: "9:15 AM",
  },
  {
    id: 3,
    sender: "carrier",
    text: "We're scheduled for pickup tomorrow at 8:00 AM. Please ensure the equipment is ready and accessible.",
    time: "9:20 AM",
  },
  {
    id: 4,
    sender: "user",
    text: "Perfect. The site will be ready. Is there anything else you need from us?",
    time: "9:25 AM",
  },
  {
    id: 5,
    sender: "carrier",
    text: "Just make sure we have clear access to the loading area. We'll need about 50ft clearance for the trailer.",
    time: "9:30 AM",
  },
  {
    id: 6,
    sender: "carrier",
    text: "The load is on schedule. ETA tomorrow 2pm.",
    time: "10:30 AM",
  },
];

const MessagingSection = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-[calc(100vh-220px)]">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors ${
                  selectedConversation.id === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{conv.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold truncate">{conv.carrier}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">Booking: {conv.bookingId}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{selectedConversation.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold">{selectedConversation.carrier}</h3>
                <p className="text-sm text-muted-foreground">Booking: {selectedConversation.bookingId}</p>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Phone size={18} />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingSection;
