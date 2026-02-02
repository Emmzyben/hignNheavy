import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Star,
  Loader2
} from "lucide-react";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import api from "@/lib/api";
import { toast } from "sonner";

const DriverProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [driverDetails, setDriverDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const fetchDriverDetails = async () => {
    try {
      const response = await api.get('/drivers/me');
      if (response.data.success) {
        setDriverDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const driver = {
    name: user?.full_name || "Driver",
    email: user?.email || "",
    phone: driverDetails?.phone || "N/A",
    licenseNumber: driverDetails?.license_number || "N/A",
    status: driverDetails?.status || "active",
    rating: 4.8, // Placeholder for now
    completedTrips: driverDetails?.completed_jobs || 0,
    pendingTrips: 0, // Placeholder
    carrier: driverDetails?.employer_name || "Independent",
  }; 

  const stats = [
    { label: "Completed", value: driver.completedTrips, icon: CheckCircle, color: "text-green-600" },
    { label: "On Job", value: driver.status === 'on-job' ? 1 : 0, icon: Clock, color: "text-amber-600" },
    { label: "Rating", value: driver.rating, icon: Star, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-4 py-8">
        <div className="flex items-center gap-4">
          <ProfileImageUploader
            currentImageUrl={user?.avatar_url}
            onUploadSuccess={() => refreshUser()}
          />
          <div>
            <h1 className="text-xl font-bold">{driver.name}</h1>
            <p className="text-sm opacity-80">{driver.carrier}</p>
            <Badge className={`mt-2 border-0 ${driver.status === 'active' || driver.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {driver.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <Card className="p-4 bg-card border-border">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Contact Info */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{driver.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm text-foreground">{driver.phone}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* License Info */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">License Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CDL Number</p>
              <p className="text-sm text-foreground">{driver.licenseNumber}</p>
            </div>
          </div>
        </Card>

        {/* Carrier Info */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Carrier</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Company</p>
              <p className="text-sm text-foreground">{driver.carrier}</p>
            </div>
          </div>
        </Card>
      </div>

      <DriverBottomNav activeTab="profile" />
    </div>
  );
};

export default DriverProfile;
