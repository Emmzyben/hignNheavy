import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const VerifyEmail = () => {
    const { refreshUser } = useAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }

        const verify = async () => {
            try {
                await api.post("/auth/verify-email", { token });
                await refreshUser();
                setStatus("success");
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Verification failed.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <div className="flex-1 flex items-center justify-center py-20">
                <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-border text-center">
                    <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

                    {status === "verifying" && <p>Verifying your email...</p>}

                    {status === "success" && (
                        <div>
                            <p className="text-green-500 mb-6">Your email has been successfully verified!</p>
                            <Button asChild className="w-full">
                                <Link to="/signin">Sign In</Link>
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div>
                            <p className="text-red-500 mb-6">{message}</p>
                            <Button asChild variant="outline" className="w-full">
                                <Link to="/">Go Home</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VerifyEmail;
