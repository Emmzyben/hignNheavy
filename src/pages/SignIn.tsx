import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroImage from "@/assets/hero.svg";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle sign in logic here
        console.log("Sign in with:", email, password);
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
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background"
                                />
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

                            <Button type="submit" size="lg" className="w-full">
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don't have an account? </span>
                            <Link to="/contact" className="text-primary hover:underline font-medium">
                                Register now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SignIn;
