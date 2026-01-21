import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroImage from "@/assets/hero.svg";
import { toast } from "sonner";
import api from "@/lib/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setIsSubmitted(true);
            toast.success("Reset link sent to your email!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send reset link.");
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
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

                <div className="container mx-auto px-4 z-10 py-20">
                    <div className="max-w-md mx-auto bg-card p-8 rounded-2xl shadow-2xl border border-border">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-black mb-2">Forgot Password?</h1>
                            <p className="text-muted-foreground">
                                {isSubmitted
                                    ? "Check your email for reset instructions"
                                    : "Enter your email to receive reset instructions"}
                            </p>
                        </div>

                        {!isSubmitted ? (
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

                                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-primary/10 p-4 rounded-lg text-center">
                                    <p className="text-sm">
                                        We've sent a password reset link to <strong>{email}</strong>.
                                        Please check your inbox and spam folder.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm">
                            <Link to="/signin" className="text-primary hover:underline font-medium flex items-center justify-center gap-2">
                                ← Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
