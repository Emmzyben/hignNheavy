import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  Hourglass
} from "lucide-react";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

interface Trip {
  id: string;
  cargoName: string;
  weight: string;
  status: "completed" | "pending" | "cancelled";
  origin: { city: string; state: string };
  destination: { city: string; state: string };
  distance: string;
  date: string;
  completedAt?: string;
}

const mockTrips: Trip[] = [
  {
    id: "HLD-8815",
    cargoName: "Solar Panel Array",
    weight: "52,000lbs",
    status: "completed",
    origin: { city: "Phoenix", state: "AZ" },
    destination: { city: "Las Vegas", state: "NV" },
    distance: "298 mi",
    date: "Jan 10, 2026",
    completedAt: "Jan 10, 2026 at 4:30 PM",
  },
  {
    id: "HLD-8820",
    cargoName: "Wind Turbine Blade",
    weight: "78,000lbs",
    status: "pending",
    origin: { city: "Houston", state: "TX" },
    destination: { city: "Casper", state: "WY" },
    distance: "1,142 mi",
    date: "Jan 14, 2026",
  },
  {
    id: "HLD-8810",
    cargoName: "Heavy Machinery",
    weight: "65,000lbs",
    status: "cancelled",
    origin: { city: "Dallas", state: "TX" },
    destination: { city: "Oklahoma City", state: "OK" },
    distance: "206 mi",
    date: "Jan 8, 2026",
  },
  {
    id: "HLD-8800",
    cargoName: "Construction Crane Parts",
    weight: "88,000lbs",
    status: "completed",
    origin: { city: "Los Angeles", state: "CA" },
    destination: { city: "San Francisco", state: "CA" },
    distance: "382 mi",
    date: "Jan 5, 2026",
    completedAt: "Jan 5, 2026 at 6:15 PM",
  },
];

const getStatusBadge = (status: Trip["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-0">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-0">
          <Hourglass className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-destructive/10 text-destructive border-0">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
  }
};

const DriverTrips = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filteredTrips = mockTrips.filter((trip) => {
    if (activeTab === "all") return true;
    return trip.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-foreground">My Trips</h1>
        <p className="text-sm text-muted-foreground">
          {mockTrips.length} total trips
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Trips List */}
      <div className="p-4 space-y-3">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No trips found</p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className="p-4 bg-card border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{trip.cargoName}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ID: #{trip.id} • {trip.weight}
                  </p>
                </div>
                {getStatusBadge(trip.status)}
              </div>

              {/* Route */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">
                    {trip.origin.city}, {trip.origin.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-sm text-foreground">
                    {trip.destination.city}, {trip.destination.state}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {trip.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {trip.date}
                  </span>
                </div>
              </div>

              {trip.status === "completed" && trip.completedAt && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ Completed on {trip.completedAt}
                </p>
              )}
            </Card>
          ))
        )}
      </div>

      <DriverBottomNav activeTab="trips" />
    </div>
  );
};

export default DriverTrips;
