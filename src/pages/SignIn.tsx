import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroImage from "@/assets/hero.svg";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Loader from "@/components/ui/Loader";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            // If user is disabled, send them to dashboard immediately so ProtectedRoute shows the disable modal
            if (user.status === 'disabled') {
                const dashboardRoute = {
                    shipper: '/dashboard/shipper',
                    carrier: '/dashboard/carrier',
                    escort: '/dashboard/escort',
                    admin: '/dashboard/admin',
                    driver: '/dashboard/driver'
                }[user.role] || '/';
                navigate(dashboardRoute, { replace: true });
                return;
            }

            // Check if profile is incomplete (excluding admin and driver for now)
            if (user.profile_completed === false && !['admin', 'driver'].includes(user.role)) {
                toast.info("Please complete your profile details to continue.");
                navigate(`/signup?role=${user.role}`, { replace: true });
                return;
            }

            // Check if email is verified (only after profile is complete)
            if (user.email_verified === false) {
                navigate('/verification-pending', { replace: true });
                return;
            }

            const dashboardRoute = {
                shipper: '/dashboard/shipper',
                carrier: '/dashboard/carrier',
                escort: '/dashboard/escort',
                admin: '/dashboard/admin',
                driver: '/dashboard/driver'
            }[user.role] || '/';
            navigate(dashboardRoute, { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Login successful!");
            // Navigation will happen automatically via useEffect when user state updates
        } catch (error: any) {
            toast.error(error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <div className="flex-1 flex items-center justify-center relative min-h-[calc(100vh-80px)]">
                {/* Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(30, 43, 62, 0.9), rgba(30, 43, 62, 0.9)), url(${heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <div className="container mx-auto px-4 z-10 py-20 mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-2xl border border-border"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-black mb-2">Welcome Back</h1>
                            <p className="text-muted-foreground">Sign in to your HighnHeavy account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-background pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full hover:scale-105 transition-transform duration-200"
                                disabled={loading}
                            >
                                {loading ? <Loader size="sm" text="Signing in..." /> : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don't have an account? </span>
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                Register now
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SignIn;
