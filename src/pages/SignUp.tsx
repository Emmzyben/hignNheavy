import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import heroImage from "@/assets/hero.svg";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const SignUp = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { register, user, updateProfileStatus } = useAuth();

    // Step state
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    // Account Data (Step 1)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"shipper" | "carrier" | "escort">("shipper");
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // Profile Data (Step 2)
    const [profileData, setProfileData] = useState({
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
    });

    // Set role from URL parameter
    useEffect(() => {
        const roleParam = searchParams.get("role");
        if (roleParam === "carrier" || roleParam === "escort" || roleParam === "shipper") {
            setRole(roleParam);
        }
    }, [searchParams]);

    // Check if user is logged in and needs to complete profile
    useEffect(() => {
        if (user) {
            // If profile is incomplete, force step 2
            if (user.profile_completed === false && !['admin', 'driver'].includes(user.role)) {
                setRole(user.role as "shipper" | "carrier" | "escort");
                setStep(2);
                return;
            }

            // If profile IS complete, redirect to dashboard
            if (!loading && user.profile_completed === true) {
                const dashboardRoute = {
                    shipper: '/dashboard/shipper',
                    carrier: '/dashboard/carrier',
                    escort: '/dashboard/escort',
                    admin: '/dashboard/admin',
                    driver: '/dashboard/driver'
                }[user.role] || '/';
                navigate(dashboardRoute, { replace: true });
            }
        }
    }, [user, navigate, loading]);
    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            // Register the user first
            await register({
                email,
                password,
                full_name: fullName,
                role
            });

            toast.success("Account created! Please complete your profile.");
            setStep(2);
        } catch (error: any) {
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle profile completion (Step 2)
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send profile data to backend
            await api.post('/users/profile', {
                ...profileData,
                role
            });

            toast.success("Profile setup complete! Welcome to HighnHeavy.");

            // Update the profile status in AuthContext
            updateProfileStatus(true);

            // Navigate based on role
            const dashboardRoute = {
                shipper: '/dashboard/shipper',
                carrier: '/dashboard/carrier',
                escort: '/dashboard/escort',
                admin: '/dashboard/admin',
                driver: '/dashboard/driver'
            }[role] || '/';

            navigate(dashboardRoute, { replace: true });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateProfileField = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    // Render Step 1: Account Creation
    const renderStep1 = () => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-black mb-2">Create Account</h1>
                <p className="text-muted-foreground">Step 1: Account Details</p>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-1 gap-3">
                        {['shipper', 'carrier', 'escort'].map((r) => (
                            <div
                                key={r}
                                onClick={() => setRole(r as any)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${role === r ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === r ? "border-primary" : "border-border"
                                    }`}>
                                    {role === r && <div className="w-3 h-3 rounded-full bg-primary" />}
                                </div>
                                <div className="capitalize font-semibold">{r}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm font-medium leading-none text-muted-foreground">
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={!agreeToTerms || loading}>
                    {loading ? "Creating Account..." : "Next Step"}
                </Button>
            </form>
        </motion.div>
    );

    // Render Step 2: Profile Details
    const renderStep2 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-black mb-2">Complete Profile</h1>
                <p className="text-muted-foreground">Step 2: {role.charAt(0).toUpperCase() + role.slice(1)} Details</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Contact Number</Label>
                        <Input
                            value={profileData.contact_number}
                            onChange={(e) => updateProfileField('contact_number', e.target.value)}
                            required
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Company Name {role === 'shipper' ? '(Optional)' : ''}</Label>
                        <Input
                            value={profileData.company_name}
                            onChange={(e) => updateProfileField('company_name', e.target.value)}
                            required={role !== 'shipper'}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                        value={profileData.address}
                        onChange={(e) => updateProfileField('address', e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                            value={profileData.city}
                            onChange={(e) => updateProfileField('city', e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                            value={profileData.state}
                            onChange={(e) => updateProfileField('state', e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Zip Code</Label>
                        <Input
                            value={profileData.zip_code}
                            onChange={(e) => updateProfileField('zip_code', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Role Specific Fields */}
                {role === 'carrier' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>MC Number</Label>
                                <Input
                                    value={profileData.mc_number}
                                    onChange={(e) => updateProfileField('mc_number', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>USDOT Number</Label>
                                <Input
                                    value={profileData.dot_number}
                                    onChange={(e) => updateProfileField('dot_number', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Fleet Size</Label>
                            <Input
                                type="number"
                                value={profileData.fleet_size}
                                onChange={(e) => updateProfileField('fleet_size', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Service Area</Label>
                            <Input
                                value={profileData.service_area}
                                onChange={(e) => updateProfileField('service_area', e.target.value)}
                                required
                                placeholder="e.g. Texas Statewide"
                            />
                        </div>
                    </>
                )}

                {role === 'escort' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>drivers_license_number</Label>
                                <Input
                                    value={profileData.drivers_license_number}
                                    onChange={(e) => updateProfileField('drivers_license_number', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Certification Number</Label>
                                <Input
                                    value={profileData.certification_number}
                                    onChange={(e) => updateProfileField('certification_number', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Years of Experience</Label>
                            <Input
                                type="number"
                                value={profileData.years_experience}
                                onChange={(e) => updateProfileField('years_experience', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vehicle Details</Label>
                            <Textarea
                                value={profileData.vehicle_details}
                                onChange={(e) => updateProfileField('vehicle_details', e.target.value)}
                                required
                                placeholder="Describe your pilot car vehicle and equipment..."
                            />
                        </div>
                    </>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Saving Profile..." : "Complete Setup"}
                </Button>
            </form>
        </motion.div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <div className="flex-1 flex items-center justify-center relative min-h-[calc(100vh-80px)]">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(30, 43, 62, 0.9), rgba(30, 43, 62, 0.9)), url(${heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="container mx-auto px-4 z-10 py-20 mt-10">
                    <div className="max-w-2xl mx-auto bg-card p-8 rounded-2xl shadow-2xl border border-border">
                        <AnimatePresence mode="wait">
                            {step === 1 ? renderStep1() : renderStep2()}
                        </AnimatePresence>

                        {step === 1 && (
                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link to="/signin" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUp;
