import { useState, useEffect, useRef } from "react";
import { Send, Search, User as UserIcon, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ProviderProfileDialog from "./admin/ProviderProfileDialog";

interface MessagingSectionProps {
  initialContext?: { bookingId: string | null; participantId: string } | null;
  initialConversationId?: string | null;
}

const MessagingSection = ({ initialContext, initialConversationId }: MessagingSectionProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (initialContext) {
      handleInitialContext();
    }
  }, [initialContext]);

  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const found = conversations.find(c => c.id === initialConversationId);
      if (found) {
        setSelectedConversation(found);
      }
    }
  }, [conversations, initialConversationId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => fetchMessages(selectedConversation.id, true), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/messages/conversations");
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error("Fetch conversations error:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string, isPolling = false) => {
    if (!isPolling) setLoadingMessages(true);
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
    } finally {
      if (!isPolling) setLoadingMessages(false);
    }
  };

  const handleInitialContext = async () => {
    if (!initialContext) return;
    setLoading(true);
    try {
      const response = await api.post("/messages/conversation", {
        bookingId: initialContext.bookingId,
        participantId: initialContext.participantId
      });
      if (response.data.success) {
        const convId = response.data.data.id;
        await fetchConversations();
        // The conversation might not be in the list yet if it's brand new and has no messages
        // But our backend returns all conversations.
        // We'll wait for conversations to update then find it.
      }
    } catch (error) {
      console.error("Handle initial context error:", error);
    } finally {
      setLoading(false);
    }
  };

  // When conversations list updates, if we have an initialContext, pick that conversation
  useEffect(() => {
    if (initialContext && conversations.length > 0) {
      const found = conversations.find(c => c.booking_id === initialContext.bookingId);
      if (found) {
        setSelectedConversation(found);
      }
    }
  }, [conversations, initialContext]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const response = await api.post("/messages", {
        conversationId: selectedConversation.id,
        content: newMessage
      });
      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        fetchConversations(); // Refresh last message in list
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.other_user_company && conv.other_user_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (conv.cargo_type && conv.cargo_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] bg-card rounded-xl border">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your messages...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-[calc(100vh-220px)]">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-border flex flex-col shrink-0">
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
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors ${selectedConversation?.id === conv.id ? "bg-muted" : ""
                    }`}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold text-primary overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (conv.other_user_id) {
                          setViewProfileId(conv.other_user_id);
                          setProfileDialogOpen(true);
                        }
                      }}
                    >
                      {conv.other_user_avatar ? (
                        <img
                          src={conv.other_user_avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        conv.other_user_name?.charAt(0) || conv.other_user_company?.charAt(0) || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold truncate">
                          {conv.other_user_role === 'carrier' ? (conv.other_user_company || conv.other_user_name) : (conv.other_user_name || conv.other_user_company)}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.last_message || "No messages yet"}</p>
                      <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-tighter">
                        {conv.other_user_role} {conv.cargo_type ? `• ${conv.cargo_type}` : "• Direct"}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-muted/5">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => {
                      if (selectedConversation.other_user_id) {
                        setViewProfileId(selectedConversation.other_user_id);
                        setProfileDialogOpen(true);
                      }
                    }}
                  >
                    {selectedConversation.other_user_avatar ? (
                      <img
                        src={selectedConversation.other_user_avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {selectedConversation.other_user_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.other_user_company || selectedConversation.other_user_name}</h3>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                      {selectedConversation.other_user_role} • {selectedConversation.cargo_type || "Direct Message"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <p>Start a new conversation with {selectedConversation.other_user_name}</p>
                    </div>
                  ) : (
                    messages.map((message, idx) => {
                      const isMe = message.sender_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-card border border-border rounded-tl-none"
                              }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}>
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {idx === messages.length - 1 && <div ref={scrollRef} />}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare size={32} className="opacity-20" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Select a Conversation</h3>
              <p className="max-w-xs">Choose a conversation from the left to start messaging your partners.</p>
            </div>
          )}
        </div>
      </div>

      <ProviderProfileDialog
        providerId={viewProfileId}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  );
};

export default MessagingSection;
