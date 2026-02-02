import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Search, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [driverId, setDriverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Driver ID or Phone Number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Login successful",
      });
      navigate("/driver/requests");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-center mt-2">
            Enter your credentials to manage your oversized cargo shipments.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="driverId" className="text-muted-foreground text-sm">
              Driver ID or Phone Number
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="driverId"
                type="text"
                placeholder="e.g. 12345678"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="pl-10 h-12 bg-card border-border"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue →"}
          </Button>

          <button
            type="button"
            className="w-full text-center text-primary text-sm hover:underline"
          >
            Trouble logging in?
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>SECURE CARGO PLATFORM</span>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
