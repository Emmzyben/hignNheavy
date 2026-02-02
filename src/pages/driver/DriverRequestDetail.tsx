import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Package,
  Weight,
  Ruler
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DriverRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAccepting, setIsAccepting] = useState(false);

  // Mock data for the request
  const request = {
    id: id || "HLD-8820",
    cargoName: "Wind Turbine Blade",
    weight: "78,000lbs",
    status: "wide_load" as const,
    origin: { city: "Houston", state: "TX" },
    destination: { city: "Casper", state: "WY" },
    distance: "1,142 mi",
    duration: "00h 45m",
    dimensions: "45 lbs",
  };

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      toast({
        title: "Request Accepted",
        description: "You have been assigned to this load",
      });
      navigate("/driver/active-trip");
    }, 1000);
  };

  const handleDecline = () => {
    toast({
      title: "Request Declined",
      description: "The request has been declined",
    });
    navigate("/driver/requests");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">New Request</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Cargo Info */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{request.cargoName}</h2>
              <p className="text-sm text-muted-foreground">
                ID: #{request.id} • {request.weight}
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-0">Wide Load</Badge>
          </div>

          {/* Route */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {request.origin.city}, {request.origin.state}
                </p>
                <p className="text-xs text-muted-foreground">Pickup Location</p>
              </div>
            </div>
            <div className="ml-1.5 border-l-2 border-dashed border-border h-4" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {request.destination.city}, {request.destination.state}
                </p>
                <p className="text-xs text-muted-foreground">Delivery Location</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Trip Details */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Trip Details</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg mx-auto mb-2">
                <Navigation className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">DISTANCE</p>
              <p className="font-semibold text-foreground">{request.distance}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg mx-auto mb-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">DURATION</p>
              <p className="font-semibold text-foreground">{request.duration}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg mx-auto mb-2">
                <Weight className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">WEIGHT</p>
              <p className="font-semibold text-foreground">{request.dimensions}</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            onClick={handleAccept}
            disabled={isAccepting}
          >
            {isAccepting ? "Accepting..." : "Accept Request"}
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border-border text-foreground"
            onClick={handleDecline}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverRequestDetail;
