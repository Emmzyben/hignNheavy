import { useState } from 'react';
import { Search, Send, User, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const shipperConversations = [
  {
    id: 'S1',
    name: 'ABC Construction',
    lastMessage: 'Thanks for the update on the delivery!',
    time: '10:30 AM',
    unread: 2,
    avatar: 'AC',
  },
  {
    id: 'S2',
    name: 'Steel Works Inc',
    lastMessage: 'Can you confirm pickup time?',
    time: 'Yesterday',
    unread: 0,
    avatar: 'SW',
  },
  {
    id: 'S3',
    name: 'Energy Solutions',
    lastMessage: 'Great work on the last shipment!',
    time: 'Jan 12',
    unread: 0,
    avatar: 'ES',
  },
];

const adminConversation = {
  id: 'ADMIN',
  name: 'HighnHeavy Support',
  lastMessage: 'Your account has been verified.',
  time: '2 days ago',
  unread: 1,
  avatar: 'HH',
};

const mockMessages = [
  {
    id: 1,
    sender: 'them',
    message: 'Hi, I wanted to check on the status of booking BK-098.',
    time: '10:15 AM',
  },
  {
    id: 2,
    sender: 'me',
    message: 'Hello! The driver is currently en route. ETA is approximately 2 hours.',
    time: '10:20 AM',
  },
  {
    id: 3,
    sender: 'them',
    message: 'Perfect, thank you for the quick response!',
    time: '10:25 AM',
  },
  {
    id: 4,
    sender: 'them',
    message: 'Thanks for the update on the delivery!',
    time: '10:30 AM',
  },
];

const adminMessages = [
  {
    id: 1,
    sender: 'them',
    message: 'Welcome to HighnHeavy! Your carrier account is now active.',
    time: '3 days ago',
  },
  {
    id: 2,
    sender: 'me',
    message: 'Thank you! I have a question about the payout process.',
    time: '3 days ago',
  },
  {
    id: 3,
    sender: 'them',
    message: 'Of course! Payouts are processed within 7 business days after job completion. You can withdraw funds from your wallet to your linked bank account at any time.',
    time: '2 days ago',
  },
  {
    id: 4,
    sender: 'them',
    message: 'Your account has been verified.',
    time: '2 days ago',
  },
];

const CarrierMessaging = () => {
  const [activeTab, setActiveTab] = useState('shippers');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentConversation = activeTab === 'admin' ? adminConversation : 
    shipperConversations.find(c => c.id === selectedConversation);
  
  const currentMessages = activeTab === 'admin' ? adminMessages : mockMessages;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In real app, would send message to backend
    setNewMessage('');
  };

  const filteredShippers = shipperConversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with shippers and admin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={(val) => {
              setActiveTab(val);
              setSelectedConversation(null);
            }} className="flex flex-col h-full">
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="shippers" className="flex-1">Shippers</TabsTrigger>
                <TabsTrigger value="admin" className="flex-1">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="shippers" className="flex-1 m-0 overflow-hidden">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search conversations..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  {filteredShippers.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors text-left border-b ${
                        selectedConversation === conversation.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">{conversation.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-primary">{conversation.unread}</Badge>
                      )}
                    </button>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="admin" className="flex-1 m-0 overflow-hidden">
                <button
                  onClick={() => setSelectedConversation('ADMIN')}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors text-left border-b ${
                    selectedConversation === 'ADMIN' ? 'bg-muted' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{adminConversation.name}</p>
                      <span className="text-xs text-muted-foreground">{adminConversation.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{adminConversation.lastMessage}</p>
                  </div>
                  {adminConversation.unread > 0 && (
                    <Badge className="bg-primary">{adminConversation.unread}</Badge>
                  )}
                </button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-full flex flex-col">
            {(selectedConversation || activeTab === 'admin') && currentConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === 'admin' ? 'bg-accent/20' : 'bg-primary/20'
                  }`}>
                    {activeTab === 'admin' ? (
                      <Shield className="h-5 w-5 text-accent" />
                    ) : (
                      <span className="text-sm font-medium text-primary">{currentConversation.avatar}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{currentConversation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === 'admin' ? 'Support Team' : 'Shipper'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarrierMessaging;
