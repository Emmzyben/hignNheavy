import { useState } from "react";
import { Search, Send, User, Truck, Car, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: number;
  content: string;
  sender: "admin" | "user";
  timestamp: string;
}

interface Conversation {
  id: string;
  userName: string;
  userType: "shipper" | "carrier" | "escort";
  company: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    userName: "John Smith",
    userType: "shipper",
    company: "Heavy Industries Inc",
    lastMessage: "When will my booking be matched with a carrier?",
    lastMessageTime: "10 min ago",
    unread: true,
    messages: [
      { id: 1, content: "Hello, I submitted a booking request yesterday for a wind turbine transport.", sender: "user", timestamp: "Yesterday 2:30 PM" },
      { id: 2, content: "Hi John! I can see your booking BK-2024-004. We're currently collecting quotes from carriers.", sender: "admin", timestamp: "Yesterday 3:15 PM" },
      { id: 3, content: "Great, thank you! When will my booking be matched with a carrier?", sender: "user", timestamp: "Today 9:45 AM" },
    ],
  },
  {
    id: "conv-2",
    userName: "Robert Chen",
    userType: "carrier",
    company: "FastHaul Logistics",
    lastMessage: "I've uploaded the updated insurance documents.",
    lastMessageTime: "1 hour ago",
    unread: true,
    messages: [
      { id: 1, content: "Hi Admin, you requested updated insurance documents for our fleet.", sender: "user", timestamp: "Today 8:00 AM" },
      { id: 2, content: "Yes, please upload them to your profile or send them here.", sender: "admin", timestamp: "Today 8:30 AM" },
      { id: 3, content: "I've uploaded the updated insurance documents.", sender: "user", timestamp: "Today 9:00 AM" },
    ],
  },
  {
    id: "conv-3",
    userName: "David Miller",
    userType: "escort",
    company: "SafeRoute Escorts",
    lastMessage: "The route for BK-2024-022 has been confirmed.",
    lastMessageTime: "3 hours ago",
    unread: false,
    messages: [
      { id: 1, content: "Checking in about the escort assignment for booking BK-2024-022.", sender: "user", timestamp: "Yesterday 4:00 PM" },
      { id: 2, content: "You've been matched! Please coordinate with FastHaul Logistics for the pickup.", sender: "admin", timestamp: "Yesterday 4:30 PM" },
      { id: 3, content: "The route for BK-2024-022 has been confirmed.", sender: "user", timestamp: "Today 7:00 AM" },
    ],
  },
  {
    id: "conv-4",
    userName: "Maria Garcia",
    userType: "carrier",
    company: "Heavy Movers Inc",
    lastMessage: "Can you help with a permit issue?",
    lastMessageTime: "5 hours ago",
    unread: true,
    messages: [
      { id: 1, content: "We're having issues obtaining permits for the El Paso route.", sender: "user", timestamp: "Today 5:00 AM" },
      { id: 2, content: "Can you help with a permit issue?", sender: "user", timestamp: "Today 5:01 AM" },
    ],
  },
  {
    id: "conv-5",
    userName: "Sarah Johnson",
    userType: "shipper",
    company: "MegaLoad Corp",
    lastMessage: "Thank you for the quick resolution!",
    lastMessageTime: "1 day ago",
    unread: false,
    messages: [
      { id: 1, content: "The delivery was completed successfully.", sender: "admin", timestamp: "2 days ago" },
      { id: 2, content: "Thank you for the quick resolution!", sender: "user", timestamp: "1 day ago" },
    ],
  },
];

const userTypeConfig = {
  shipper: { icon: User, color: "bg-blue-100 text-blue-800" },
  carrier: { icon: Truck, color: "bg-green-100 text-green-800" },
  escort: { icon: Car, color: "bg-purple-100 text-purple-800" },
};

const AdminMessages = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || c.userType === typeFilter;
    return matchesSearch && matchesType;
  });

  const unreadCount = conversations.filter(c => c.unread).length;

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark as read
    setConversations(conversations.map(c => 
      c.id === conversation.id ? { ...c, unread: false } : c
    ));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: selectedConversation.messages.length + 1,
      content: newMessage,
      sender: "admin",
      timestamp: "Just now",
    };

    setConversations(conversations.map(c => 
      c.id === selectedConversation.id 
        ? { 
            ...c, 
            messages: [...c.messages, newMsg],
            lastMessage: newMessage,
            lastMessageTime: "Just now"
          }
        : c
    ));

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
    });

    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Messages</h1>
        <p className="text-muted-foreground">
          View and respond to messages from shippers, carriers, and escorts
          {unreadCount > 0 && (
            <Badge className="ml-2" variant="destructive">{unreadCount} unread</Badge>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Conversations List */}
        <div className="bg-card border rounded-lg flex flex-col">
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="shipper">Shippers</SelectItem>
                <SelectItem value="carrier">Carriers</SelectItem>
                <SelectItem value="escort">Escorts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredConversations.map((conversation) => {
                const TypeIcon = userTypeConfig[conversation.userType].icon;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                    } ${conversation.unread ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${userTypeConfig[conversation.userType].color}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium truncate ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {conversation.userName}
                          </p>
                          <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.company}</p>
                        <p className={`text-sm truncate mt-1 ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-card border rounded-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className={`p-2 rounded-full ${userTypeConfig[selectedConversation.userType].color}`}>
                  {(() => {
                    const TypeIcon = userTypeConfig[selectedConversation.userType].icon;
                    return <TypeIcon className="h-5 w-5" />;
                  })()}
                </div>
                <div>
                  <p className="font-medium">{selectedConversation.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.company} • 
                    <Badge variant="outline" className="ml-2 text-xs">
                      {selectedConversation.userType}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
