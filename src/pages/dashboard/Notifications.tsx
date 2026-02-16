import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get("/notifications?limit=100");
            if (response.data.success) {
                setNotifications(response.data.data.notifications);
            }
        } catch (error) {
            console.error("Fetch notifications error:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error("Mark as read error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/notifications/mark-all-read");
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await handleMarkAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
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
        <DashboardLayout activeSection="notifications">
            <div className="space-y-6 max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and view all your notifications
                        </p>
                    </div>
                    {notifications.length > 0 && (
                        <Button onClick={handleMarkAllRead} variant="outline" size="sm">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader size="md" text="Fetching notifications..." />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-medium">No notifications</h3>
                        <p className="text-muted-foreground">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-all hover:shadow-md cursor-pointer ${!notification.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""
                                    }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <CardContent className="p-4 flex gap-4 items-start">
                                    <div className="text-3xl mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-base ${!notification.is_read ? "font-bold" : "font-medium"}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive -mr-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(notification.id);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
