import { useState } from "react";
import { 
  MapPin, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock,
  Navigation,
  Phone,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activeShipments = [
  {
    id: "BK-001",
    cargoType: "Construction Equipment",
    carrier: "Texas Heavy Haul Co.",
    driverName: "Mike Johnson",
    driverPhone: "(512) 555-0123",
    pickup: "Houston, TX",
    delivery: "Dallas, TX",
    currentLocation: "Waco, TX",
    progress: 65,
    eta: "Jan 16, 2024 - 2:00 PM",
    status: "in-transit",
    updates: [
      { time: "Jan 15, 8:00 AM", event: "Picked up from Houston", location: "Houston, TX", completed: true },
      { time: "Jan 15, 11:30 AM", event: "Passed Austin checkpoint", location: "Austin, TX", completed: true },
      { time: "Jan 15, 2:00 PM", event: "Currently in transit", location: "Waco, TX", completed: true },
      { time: "Jan 16, 2:00 PM", event: "Estimated delivery", location: "Dallas, TX", completed: false },
    ],
  },
];

const TrackingSection = () => {
  const [selectedShipment, setSelectedShipment] = useState(activeShipments[0]);

  return (
    <div className="space-y-6">
      {/* Shipment Selector */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold mb-1">Track Your Shipment</h2>
            <p className="text-muted-foreground">Real-time tracking for your active shipments</p>
          </div>
          <Select 
            value={selectedShipment.id} 
            onValueChange={(value) => {
              const shipment = activeShipments.find(s => s.id === value);
              if (shipment) setSelectedShipment(shipment);
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select shipment" />
            </SelectTrigger>
            <SelectContent>
              {activeShipments.map((shipment) => (
                <SelectItem key={shipment.id} value={shipment.id}>
                  {shipment.id} - {shipment.cargoType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="aspect-video bg-muted relative">
            {/* Placeholder for map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Navigation className="text-primary" size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Tracking Map</h3>
                <p className="text-muted-foreground max-w-sm">
                  Interactive map showing real-time location of your shipment
                </p>
              </div>
            </div>
            
            {/* Route indicators */}
            <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">{selectedShipment.pickup}</span>
                </div>
                <div className="flex-1 mx-4 h-1 bg-muted rounded relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary rounded"
                    style={{ width: `${selectedShipment.progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background"
                    style={{ left: `${selectedShipment.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{selectedShipment.delivery}</span>
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Status */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className="bg-blue-500/20 text-blue-600 border-0 mb-2">
                  <Truck size={14} className="mr-1" />
                  In Transit
                </Badge>
                <h3 className="text-lg font-semibold">Currently at: {selectedShipment.currentLocation}</h3>
                <p className="text-muted-foreground">ETA: {selectedShipment.eta}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{selectedShipment.progress}%</p>
                <p className="text-sm text-muted-foreground">Journey Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Details & Timeline */}
        <div className="space-y-6">
          {/* Driver Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">Driver Information</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Truck className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-semibold">{selectedShipment.driverName}</p>
                <p className="text-sm text-muted-foreground">{selectedShipment.carrier}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone size={16} className="mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare size={16} className="mr-2" />
                Message
              </Button>
            </div>
          </div>

          {/* Shipment Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">Shipment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-semibold">{selectedShipment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cargo Type</span>
                <span className="font-medium">{selectedShipment.cargoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-medium">{selectedShipment.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">{selectedShipment.delivery}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">Tracking Updates</h3>
            <div className="space-y-4">
              {selectedShipment.updates.map((update, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      update.completed 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {update.completed ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                    </div>
                    {index < selectedShipment.updates.length - 1 && (
                      <div className={`w-0.5 h-full mt-1 ${
                        update.completed ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">{update.event}</p>
                    <p className="text-sm text-muted-foreground">{update.location}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSection;
