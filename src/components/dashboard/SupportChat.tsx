import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SupportChat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initSupportChat();
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [conversationId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const initSupportChat = async () => {
        try {
            // 'admin' is a special keyword handled by backend
            const response = await api.post("/messages/conversation", {
                participantId: 'admin',
                bookingId: null
            });
            if (response.data.success) {
                setConversationId(response.data.data.id);
            }
        } catch (error) {
            console.error("Init chat error:", error);
            toast.error("Failed to connect to support");
        } finally {
            // If we failed to get a conversation ID, stop loading so user sees something (though empty)
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!conversationId) return;
        try {
            const response = await api.get(`/messages/conversations/${conversationId}`);
            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error("Fetch messages error:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !conversationId) return;
        try {
            const response = await api.post("/messages", {
                conversationId,
                content: newMessage
            });
            if (response.data.success) {
                setMessages([...messages, response.data.data]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Send message error:", error);
            toast.error("Failed to send message");
        }
    };

    if (loading && !conversationId) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Connecting to support...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-muted/5 border-t overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>This is a direct line to HighnHeavy administration.</p>
                        <p className="text-sm mt-2">Please describe your issue.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, idx) => {
                            const isMe = message.sender_id === user?.id;
                            return (
                                <div
                                    key={message.id || idx}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${isMe
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
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>
                )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type your message..."
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
        </div>
    );
};

export default SupportChat;
