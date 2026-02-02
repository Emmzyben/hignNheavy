import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Package,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

interface LoadRequest {
  id: string;
  cargoName: string;
  weight: string;
  status: "wide_load" | "overweight" | "standard";
  origin: { city: string; state: string };
  destination: { city: string; state: string };
  distance: string;
  estimatedTime: string;
}

const mockRequests: LoadRequest[] = [
  {
    id: "HLD-8820",
    cargoName: "Wind Turbine Blade",
    weight: "78,000lbs",
    status: "wide_load",
    origin: { city: "Houston", state: "TX" },
    destination: { city: "Casper", state: "WY" },
    distance: "1,142 mi",
    estimatedTime: "00:45",
  },
  {
    id: "HLD-8821",
    cargoName: "Industrial Generator",
    weight: "92,000lbs",
    status: "overweight",
    origin: { city: "Dallas", state: "TX" },
    destination: { city: "Denver", state: "CO" },
    distance: "890 mi",
    estimatedTime: "00:45",
  },
  {
    id: "HLD-8822",
    cargoName: "Construction Equipment",
    weight: "45,000lbs",
    status: "standard",
    origin: { city: "Austin", state: "TX" },
    destination: { city: "Phoenix", state: "AZ" },
    distance: "872 mi",
    estimatedTime: "00:30",
  },
];

const getStatusBadge = (status: LoadRequest["status"]) => {
  switch (status) {
    case "wide_load":
      return <Badge className="bg-primary/10 text-primary border-0 text-xs">Wide Load</Badge>;
    case "overweight":
      return <Badge className="bg-amber-500/10 text-amber-600 border-0 text-xs">Overweight</Badge>;
    case "standard":
      return <Badge className="bg-muted text-muted-foreground border-0 text-xs">Standard</Badge>;
  }
};

const DriverRequests = () => {
  const navigate = useNavigate();
  const [requests] = useState<LoadRequest[]>(mockRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Available Loads</h1>
            <p className="text-sm text-muted-foreground">{requests.length} new requests</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className={isRefreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Requests List */}
      <div className="p-4 space-y-3">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="p-4 bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/driver/request/${request.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{request.cargoName}</h3>
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-xs text-muted-foreground">
                  ID: #{request.id} • {request.weight}
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">
                  {request.origin.city}, {request.origin.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-sm text-foreground">
                  {request.destination.city}, {request.destination.state}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {request.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Exp. {request.estimatedTime}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary hover:bg-primary/10"
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <DriverBottomNav activeTab="requests" />
    </div>
  );
};

export default DriverRequests;
