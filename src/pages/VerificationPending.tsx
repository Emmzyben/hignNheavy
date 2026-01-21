import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, LogOut, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";

export default function VerificationPending() {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (user?.email_verified) {
            if (user.profile_completed) {
                const dashboardRoute = {
                    shipper: '/dashboard/shipper',
                    carrier: '/dashboard/carrier',
                    escort: '/dashboard/escort',
                    admin: '/dashboard/admin',
                    driver: '/dashboard/driver'
                }[user.role] || '/';
                navigate(dashboardRoute, { replace: true });
            } else {
                navigate(`/signup?role=${user.role}`, { replace: true });
            }
        }
    }, [user, navigate]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshUser();
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to check status");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleResend = async () => {
        if (!user?.email) return;
        setIsResending(true);
        try {
            await api.post("/auth/resend-verification", { email: user.email });
            toast.success("Verification email resent!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend email");
        } finally {
            setIsResending(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <p>Please sign in to verify your email.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 ">
            <Navigation />

            <div className="flex-1 flex flex-col items-center justify-center p-4 mt-20">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-8 border border-slate-100">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Mail className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-display font-black text-slate-900">Verify your email</h1>
                        <p className="text-slate-500 font-medium">
                            We've sent a verification link to <br />
                            <span className="text-slate-900 font-bold">{user.email}</span>
                        </p>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm">
                        Please check your inbox and click the link to verify your account.
                        If you don't see it, check your spam folder.
                    </p>

                    <div className="space-y-4 pt-4">
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="w-full h-12 text-lg font-semibold hover:scale-[1.02] transition-all"
                        >
                            {isRefreshing ? (
                                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <RefreshCw className="w-5 h-5 mr-2" />
                            )}
                            I have verified my email
                        </Button>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={handleResend}
                                disabled={isResending}
                                className="h-11 font-medium"
                            >
                                {isResending ? (
                                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Resend Email
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={logout}
                                className="h-11 font-medium text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 pt-4">
                        Having issues? <a href="/contact" className="text-primary hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
