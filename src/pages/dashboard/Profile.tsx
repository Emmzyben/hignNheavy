import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building, Shield, Truck, Briefcase, Lock, Bell, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import Loader from "@/components/ui/Loader";

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [profileData, setProfileData] = useState<any>({
        company_name: "",
        contact_number: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        mc_number: "",
        dot_number: "",
        fleet_size: "",
        service_area: "",
        drivers_license_number: "",
        certification_number: "",
        years_experience: "",
        vehicle_details: "",
        bio: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [updatingNotifications, setUpdatingNotifications] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/me");
                if (response.data.success) {
                    console.log("Profile data fetched:", response.data.data);
                    setProfileData(response.data.data);
                    setEmailNotifications(response.data.data.email_notifications !== false);
                    refreshUser(); // Sync global context
                }
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    toast.error("Failed to fetch profile details");
                }
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/users/profile", {
                ...profileData,
                role: user?.role
            });
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setProfileData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        setUpdatingPassword(true);
        try {
            await api.patch("/users/password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password updated successfully");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleNotificationToggle = async (checked: boolean) => {
        setUpdatingNotifications(true);
        try {
            await api.patch("/users/notifications", { emailNotifications: checked });
            setEmailNotifications(checked);
            toast.success(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update notification preferences");
        } finally {
            setUpdatingNotifications(false);
        }
    };

    if (fetching) {
        return (
            <DashboardLayout>
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                    <Loader size="lg" text="Loading profile..." />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8 pb-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="bg-card shadow-lg border rounded-2xl p-6 h-fit space-y-6">
                        <div className="flex flex-col items-center text-center">
                            <ProfileImageUploader
                                currentImageUrl={profileData.avatar_url || user?.avatar_url}
                                onUploadSuccess={(url) => {
                                    setProfileData((prev: any) => ({ ...prev, avatar_url: url }));
                                    refreshUser();
                                }}
                            />
                            <h2 className="text-xl font-bold mt-4">{user?.full_name}</h2>
                            <p className="text-sm text-muted-foreground capitalize font-medium">{user?.role}</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail size={16} className="text-primary" />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Shield size={16} className="text-primary" />
                                <span className="capitalize">Verified {user?.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs for Profile Details and Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                                <TabsTrigger value="settings">Account Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <form onSubmit={handleSubmit} className="bg-card shadow-sm border border-border rounded-2xl p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                                <Phone size={14} className="text-primary" /> Contact Number
                                            </Label>
                                            <Input
                                                value={profileData.contact_number || ""}
                                                onChange={(e) => updateField("contact_number", e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="bg-muted/30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                                <Building size={14} className="text-primary" /> Company Name
                                            </Label>
                                            <Input
                                                value={profileData.company_name || ""}
                                                onChange={(e) => updateField("company_name", e.target.value)}
                                                placeholder="Organization name"
                                                className="bg-muted/30"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-semibold">
                                            <MapPin size={14} className="text-primary" /> Street Address
                                        </Label>
                                        <Input
                                            value={profileData.address || ""}
                                            onChange={(e) => updateField("address", e.target.value)}
                                            placeholder="Enter your address"
                                            className="bg-muted/30"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">City</Label>
                                            <Input
                                                value={profileData.city || ""}
                                                onChange={(e) => updateField("city", e.target.value)}
                                                className="bg-muted/30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">State</Label>
                                            <Input
                                                value={profileData.state || ""}
                                                onChange={(e) => updateField("state", e.target.value)}
                                                className="bg-muted/30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Zip Code</Label>
                                            <Input
                                                value={profileData.zip_code || ""}
                                                onChange={(e) => updateField("zip_code", e.target.value)}
                                                className="bg-muted/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Carrier Specific Fields */}
                                    {user?.role === "carrier" && (
                                        <div className="space-y-6 pt-6 border-t border-border mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Truck size={18} className="text-primary" />
                                                <h3 className="font-bold text-lg">Carrier Credentials</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold">MC Number</Label>
                                                    <Input
                                                        value={profileData.mc_number || ""}
                                                        onChange={(e) => updateField("mc_number", e.target.value)}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold">USDOT Number</Label>
                                                    <Input
                                                        value={profileData.dot_number || ""}
                                                        onChange={(e) => updateField("dot_number", e.target.value)}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">Fleet Size</Label>
                                                <Input
                                                    type="number"
                                                    value={profileData.fleet_size || ""}
                                                    onChange={(e) => updateField("fleet_size", e.target.value)}
                                                    className="bg-muted/30"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Escort Specific Fields */}
                                    {user?.role === "escort" && (
                                        <div className="space-y-6 pt-6 border-t border-border mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield size={18} className="text-primary" />
                                                <h3 className="font-bold text-lg">Escort Details</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold">Driver's License #</Label>
                                                    <Input
                                                        value={profileData.drivers_license_number || ""}
                                                        onChange={(e) => updateField("drivers_license_number", e.target.value)}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold">Certification #</Label>
                                                    <Input
                                                        value={profileData.certification_number || ""}
                                                        onChange={(e) => updateField("certification_number", e.target.value)}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">Years Experience</Label>
                                                <Input
                                                    type="number"
                                                    value={profileData.years_experience || ""}
                                                    onChange={(e) => updateField("years_experience", e.target.value)}
                                                    className="bg-muted/30"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-4">
                                        <Label className="flex items-center gap-2 text-sm font-semibold">
                                            <Briefcase size={14} className="text-primary" /> Professional Bio
                                        </Label>
                                        <Textarea
                                            value={profileData.bio || ""}
                                            onChange={(e) => updateField("bio", e.target.value)}
                                            rows={4}
                                            className="resize-none bg-muted/30"
                                            placeholder="Tell us about yourself or your company's expertise..."
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full hero-gradient border-0 text-white font-bold" disabled={loading}>
                                        {loading ? "Saving Changes..." : "Save Profile Information"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="settings">
                                <div className="space-y-6">
                                    {/* Password Update Section */}
                                    <form onSubmit={handlePasswordUpdate} className="bg-card shadow-sm border border-border rounded-2xl p-8 space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Lock size={20} className="text-primary" />
                                            <h3 className="font-bold text-lg">Change Password</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold">Current Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                        className="bg-muted/30 pr-10"
                                                        placeholder="Enter current password"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold">New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="bg-muted/30 pr-10"
                                                        placeholder="Enter new password"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold">Confirm New Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="bg-muted/30 pr-10"
                                                        placeholder="Confirm new password"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" size="lg" className="w-full" disabled={updatingPassword}>
                                            {updatingPassword ? "Updating Password..." : "Update Password"}
                                        </Button>
                                    </form>

                                    {/* Notifications Section */}
                                    <div className="bg-card shadow-sm border border-border rounded-2xl p-8 space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Bell size={20} className="text-primary" />
                                            <h3 className="font-bold text-lg">Notification Preferences</h3>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                            <div className="space-y-1">
                                                <p className="font-semibold">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive updates about bookings, messages, and important account activity</p>
                                            </div>
                                            <Switch
                                                checked={emailNotifications}
                                                onCheckedChange={handleNotificationToggle}
                                                disabled={updatingNotifications}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default Profile;
