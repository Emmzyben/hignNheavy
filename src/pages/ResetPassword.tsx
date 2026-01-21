import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImage from "@/assets/hero.svg";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/reset-password", { token, newPassword: password });
            toast.success("Password reset successfully! Please sign in.");
            navigate("/signin");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-red-500">Invalid reset link.</p>
                </div>
                <Footer />
            </div>
        );
    }

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
                <div className="container mx-auto px-4 z-10 py-20">
                    <div className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-2xl border border-border">
                        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="bg-background"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPassword;
