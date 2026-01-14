import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building, Shield, Truck, Briefcase } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Profile = () => {
    const { user } = useAuth();
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/profile");
                if (response.data.success) {
                    setProfileData(response.data.data);
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

    if (fetching) {
        return (
            <DashboardLayout>
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                                <User size={48} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">{user?.full_name}</h2>
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

                    {/* Edit Form */}
                    <div className="lg:col-span-2 space-y-6">
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
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default Profile;
