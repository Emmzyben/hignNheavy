import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get("/notifications?limit=20");
            if (response.data.success) {
                setNotifications(response.data.data.notifications);
                setUnreadCount(response.data.data.unreadCount);
            }
        } catch (error) {
            console.error("Fetch notifications error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get("/notifications/unread-count");
            if (response.data.success) {
                setUnreadCount(response.data.data.count);
            }
        } catch (error) {
            console.error("Fetch unread count error:", error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read
        if (!notification.is_read) {
            try {
                await api.patch(`/notifications/${notification.id}/read`);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Mark as read error:", error);
            }
        }

        // Navigate to link if available
        if (notification.link) {
            navigate(notification.link);
            setOpen(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/notifications/mark-all-read");
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    };

    const getNotificationIcon = (type: string) => {
        const iconMap: Record<string, string> = {
            booking: "📦",
            message: "💬",
            quote: "📋",
            quote_accepted: "✅",
            booking_update: "🔄",
            payment: "💰",
            review: "⭐",
            system: "🔔"
        };
        return iconMap[type] || "🔔";
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-bold text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Bell size={48} className="mb-2 opacity-20" />
                            <p>No notifications</p>
                            <p className="text-xs">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${!notification.is_read ? "bg-primary/5" : ""
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="text-2xl flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold text-sm truncate">
                                                    {notification.title}
                                                </p>
                                                {!notification.is_read && (
                                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(notification.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="p-2 border-t bg-muted/30">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                                navigate("/dashboard/notifications");
                                setOpen(false);
                            }}
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;
