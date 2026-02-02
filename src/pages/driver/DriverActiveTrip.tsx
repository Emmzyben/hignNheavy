import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone,
  MessageCircle,
  Play,
  Square,
  Camera
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

type TripStatus = "accepted" | "in_progress" | "arrived";

const DriverActiveTrip = () => {
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState<TripStatus>("accepted");

  const trip = {
    id: "HLD-8820",
    cargoName: "Wind Turbine Blade",
    weight: "78,000lbs",
    shipper: {
      name: "Texas Energy Corp",
      phone: "+1 (555) 123-4567",
    },
    origin: { city: "Houston", state: "TX", address: "1234 Industrial Blvd" },
    destination: { city: "Casper", state: "WY", address: "5678 Wind Farm Rd" },
    distance: "1,142 mi",
    eta: "14h 30m",
  };

  const handleStartTrip = () => {
    setTripStatus("in_progress");
    toast({
      title: "Trip Started",
      description: "Drive safely! Your trip is now in progress.",
    });
  };

  const handleArrived = () => {
    setTripStatus("arrived");
    toast({
      title: "Arrived at Destination",
      description: "Please proceed to complete delivery",
    });
  };

  const handleCompleteDelivery = () => {
    navigate("/driver/complete-delivery");
  };

  const getStatusBadge = () => {
    switch (tripStatus) {
      case "accepted":
        return <Badge className="bg-blue-500/10 text-blue-600 border-0">Assigned</Badge>;
      case "in_progress":
        return <Badge className="bg-primary/10 text-primary border-0">In Transit</Badge>;
      case "arrived":
        return <Badge className="bg-green-500/10 text-green-600 border-0">Arrived</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Active Trip</h1>
            <p className="text-sm text-muted-foreground">#{trip.id}</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-48 bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Navigation className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Map View</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Cargo Info */}
        <Card className="p-4 bg-card border-border">
          <h2 className="font-semibold text-foreground mb-1">{trip.cargoName}</h2>
          <p className="text-sm text-muted-foreground">{trip.weight}</p>
        </Card>

        {/* Route */}
        <Card className="p-4 bg-card border-border">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">PICKUP</p>
                <p className="font-medium text-foreground">
                  {trip.origin.city}, {trip.origin.state}
                </p>
                <p className="text-sm text-muted-foreground">{trip.origin.address}</p>
              </div>
            </div>
            
            <div className="ml-1.5 border-l-2 border-dashed border-border h-4" />
            
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-3 h-3 rounded-full bg-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">DELIVERY</p>
                <p className="font-medium text-foreground">
                  {trip.destination.city}, {trip.destination.state}
                </p>
                <p className="text-sm text-muted-foreground">{trip.destination.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Navigation className="w-4 h-4" />
              <span>{trip.distance}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>ETA: {trip.eta}</span>
            </div>
          </div>
        </Card>

        {/* Shipper Contact */}
        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">SHIPPER</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{trip.shipper.name}</p>
              <p className="text-sm text-muted-foreground">{trip.shipper.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {tripStatus === "accepted" && (
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handleStartTrip}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Trip
            </Button>
          )}

          {tripStatus === "in_progress" && (
            <Button
              className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              onClick={handleArrived}
            >
              <Square className="w-5 h-5 mr-2" />
              Mark as Arrived
            </Button>
          )}

          {tripStatus === "arrived" && (
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
              onClick={handleCompleteDelivery}
            >
              <Camera className="w-5 h-5 mr-2" />
              Complete Delivery
            </Button>
          )}
        </div>
      </div>

      <DriverBottomNav activeTab="active" />
    </div>
  );
};

export default DriverActiveTrip;
