import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Phone,
    Mail,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    Star,
    Shield,
    LogOut,
    Bell,
    Lock
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

const DriverProfile = () => {
    const { user, logout, refreshUser } = useAuth();
    const [fetching, setFetching] = useState(true);
    const [driverData, setDriverData] = useState<any>(null);
    const [stats, setStats] = useState({
        completed: 0,
        pending: 0
    });

    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [updatingNotifications, setUpdatingNotifications] = useState(false);

    useEffect(() => {
        const fetchDriverStats = async () => {
            try {
                const response = await api.get("/drivers/me");
                if (response.data.success) {
                    const d = response.data.data;
                    setDriverData(d);
                    setStats({
                        completed: d.completed_jobs || 0,
                        pending: 0 // Mock for now
                    });

                    // Set notification settings from user data
                    setEmailNotifications(user?.email_notifications !== false);
                    setPushNotifications(user?.push_notifications !== false);
                }
            } catch (error) {
                console.error("Failed to fetch driver stats", error);
            } finally {
                setFetching(false);
            }
        };

        fetchDriverStats();
    }, [user]);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwordData.new.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setUpdatingPassword(true);
        try {
            const response = await api.patch("/users/password", {
                currentPassword: passwordData.current,
                newPassword: passwordData.new
            });
            if (response.data.success) {
                toast.success("Password updated successfully");
                setPasswordDialogOpen(false);
                setPasswordData({ current: "", new: "", confirm: "" });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleNotificationToggle = async (type: 'email' | 'push', checked: boolean) => {
        setUpdatingNotifications(true);
        try {
            const payload = type === 'email'
                ? { emailNotifications: checked }
                : { pushNotifications: checked };

            const response = await api.patch("/users/notifications", payload);
            if (response.data.success) {
                if (type === 'email') {
                    setEmailNotifications(checked);
                } else {
                    setPushNotifications(checked);
                }
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications updated`);
            }
        } catch (error: any) {
            toast.error("Failed to update notification settings");
        } finally {
            setUpdatingNotifications(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
    };

    const statItems = [
        { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Header / Profile Card */}
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-card to-muted/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User size={120} />
                </div>

                <div className="flex flex-col items-center relative z-10">
                    <ProfileImageUploader
                        currentImageUrl={user?.avatar_url}
                        onUploadSuccess={() => refreshUser()}
                    />
                    <h1 className="text-2xl font-black text-foreground mt-4">{user?.full_name}</h1>
                    <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">{user?.role}</p>
                    <Badge className="mt-3 bg-green-500/10 text-green-600 border-0 font-bold px-4 py-1">
                        Active & Verified
                    </Badge>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {statItems.map((stat) => (
                    <Card key={stat.label} className="p-4 border-0 shadow-sm text-center">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-xl font-black text-foreground">{stat.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{stat.label}</p>
                    </Card>
                ))}
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Identity & Contact</h3>
                <Card className="divide-y divide-border overflow-hidden border-0 shadow-sm">
                    <div className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                        <div className="p-2 bg-muted rounded-lg">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                        <div className="p-2 bg-muted rounded-lg">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                            <p className="text-sm font-bold">{driverData?.phone || user?.phone_number || user?.contact_number || "Not provided"}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                        <div className="p-2 bg-muted rounded-lg">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Driving License</p>
                            <p className="text-sm font-bold">{driverData?.license_number || "CDL-•••••••"}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Account Settings */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Account Security</h3>
                <Card className="divide-y divide-border overflow-hidden border-0 shadow-sm">
                    {/* Password Dialog */}
                    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left group">
                                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Lock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Change Password</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">Update your account password</p>
                                </div>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Password</DialogTitle>
                                <DialogDescription>Enter your current password and a new one to update.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordData.current}
                                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.new}
                                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={updatingPassword}>
                                    {updatingPassword ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Notifications Dialog */}
                    <Dialog open={notificationsDialogOpen} onOpenChange={setNotificationsDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left group">
                                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Notifications</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">Manage push & email updates</p>
                                </div>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Notification Settings</DialogTitle>
                                <DialogDescription>Choose how you want to be notified of new loads and updates.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground font-medium">Receive load details via email</p>
                                    </div>
                                    <Switch
                                        checked={emailNotifications}
                                        onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                                        disabled={updatingNotifications}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground font-medium">Receive real-time alerts on your device</p>
                                    </div>
                                    <Switch
                                        checked={pushNotifications}
                                        onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
                                        disabled={updatingNotifications}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </Card>
            </div>

            <Button
                variant="destructive"
                className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-lg shadow-destructive/10 mt-6"
                onClick={handleLogout}
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out Account
            </Button>
        </div>
    );
};

export default DriverProfile;
