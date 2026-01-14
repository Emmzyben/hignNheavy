import { useState } from "react";
import { Search, Send, User, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockShipperConversations = [
  {
    id: "1",
    name: "Texas Steel Corp",
    lastMessage: "What's your ETA for the escort tomorrow?",
    time: "10:30 AM",
    unread: 2,
    avatar: "TS",
  },
  {
    id: "2",
    name: "Gulf Equipment LLC",
    lastMessage: "Thanks for the safe transport!",
    time: "Yesterday",
    unread: 0,
    avatar: "GE",
  },
  {
    id: "3",
    name: "Lone Star Manufacturing",
    lastMessage: "Can you handle a wider load next week?",
    time: "2 days ago",
    unread: 0,
    avatar: "LS",
  },
];

const mockAdminConversation = {
  id: "admin",
  name: "HighnHeavy Admin",
  lastMessage: "Your account has been verified",
  time: "1 day ago",
  unread: 1,
  avatar: "HH",
};

const mockMessages = [
  {
    id: "1",
    sender: "them",
    message: "Hi, I wanted to confirm the escort details for tomorrow's job.",
    time: "10:15 AM",
  },
  {
    id: "2",
    sender: "me",
    message: "Of course! I'll be using Vehicle #1 (Ford F-150) with full LED light bar and flags.",
    time: "10:18 AM",
  },
  {
    id: "3",
    sender: "them",
    message: "Perfect. What's your ETA for the escort tomorrow?",
    time: "10:30 AM",
  },
];

const mockAdminMessages = [
  {
    id: "1",
    sender: "them",
    message: "Welcome to HighnHeavy! Your escort account has been approved.",
    time: "3 days ago",
  },
  {
    id: "2",
    sender: "me",
    message: "Thank you! I have a question about the insurance requirements.",
    time: "2 days ago",
  },
  {
    id: "3",
    sender: "them",
    message: "Your account has been verified and you're all set to receive job requests.",
    time: "1 day ago",
  },
];

const EscortMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [activeTab, setActiveTab] = useState("shippers");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentMessages = activeTab === "admin" ? mockAdminMessages : mockMessages;
  const currentConversation = activeTab === "admin" 
    ? mockAdminConversation 
    : mockShipperConversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Mock send - in real app this would send to backend
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with shippers and admin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shippers" className="gap-2">
            <User className="h-4 w-4" />
            Shippers
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Shield className="h-4 w-4" />
            Admin
            {mockAdminConversation.unread > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {mockAdminConversation.unread}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* Conversations List */}
          <Card className={activeTab === "admin" ? "lg:col-span-1 hidden lg:block" : "lg:col-span-1"}>
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <TabsContent value="shippers" className="m-0">
                  {mockShipperConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors border-b ${
                        selectedConversation === conversation.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {conversation.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="admin" className="m-0">
                  <button
                    className="w-full p-4 flex items-start gap-3 bg-muted border-b"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{mockAdminConversation.name}</p>
                        <span className="text-xs text-muted-foreground">{mockAdminConversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {mockAdminConversation.lastMessage}
                      </p>
                    </div>
                    {mockAdminConversation.unread > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {mockAdminConversation.unread}
                      </Badge>
                    )}
                  </button>
                </TabsContent>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className={activeTab === "admin" ? "lg:col-span-3" : "lg:col-span-2"}>
            {currentConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      activeTab === "admin" ? "bg-primary" : "bg-primary/20"
                    }`}>
                      {activeTab === "admin" ? (
                        <Shield className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <span className="text-sm font-medium text-primary">
                          {currentConversation.avatar}
                        </span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{currentConversation.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {activeTab === "admin" ? "Platform Support" : "Shipper"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[480px]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sender === "me"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sender === "me"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </CardContent>
            )}
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default EscortMessaging;
