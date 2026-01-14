import { useState } from "react";
import { 
  Eye, 
  MessageSquare, 
  MapPin, 
  Star, 
  MoreVertical,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingsListProps {
  onTrack: () => void;
  onMessage: () => void;
}

const mockBookings = [
  {
    id: "BK-001",
    cargoType: "Construction Equipment",
    pickup: "Houston, TX",
    delivery: "Dallas, TX",
    date: "2024-01-15",
    status: "in-transit",
    carrier: "Texas Heavy Haul Co.",
    price: 4500,
    dimensions: "45ft x 12ft x 14ft",
    weight: "85,000 lbs"
  },
  {
    id: "BK-002",
    cargoType: "Industrial Machinery",
    pickup: "Austin, TX",
    delivery: "San Antonio, TX",
    date: "2024-01-10",
    status: "completed",
    carrier: "Big Rig Transport LLC",
    price: 2800,
    dimensions: "30ft x 10ft x 11ft",
    weight: "45,000 lbs"
  },
  {
    id: "BK-003",
    cargoType: "Wind Turbine Blade",
    pickup: "Corpus Christi, TX",
    delivery: "Amarillo, TX",
    date: "2024-01-20",
    status: "pending",
    carrier: "Pending Assignment",
    price: 8500,
    dimensions: "180ft x 8ft x 8ft",
    weight: "25,000 lbs"
  },
  {
    id: "BK-004",
    cargoType: "Pre-Fab Building",
    pickup: "Fort Worth, TX",
    delivery: "El Paso, TX",
    date: "2024-01-08",
    status: "completed",
    carrier: "Lone Star Carriers",
    price: 6200,
    dimensions: "60ft x 14ft x 16ft",
    weight: "120,000 lbs"
  },
  {
    id: "BK-005",
    cargoType: "Mining Equipment",
    pickup: "Midland, TX",
    delivery: "Houston, TX",
    date: "2024-01-25",
    status: "pending-payment",
    carrier: "West Texas Haulers",
    price: 5100,
    dimensions: "35ft x 12ft x 13ft",
    weight: "95,000 lbs"
  },
];

const statusConfig = {
  "pending": { label: "Pending", color: "bg-yellow-500/20 text-yellow-600", icon: Clock },
  "in-transit": { label: "In Transit", color: "bg-blue-500/20 text-blue-600", icon: Truck },
  "completed": { label: "Completed", color: "bg-green-500/20 text-green-600", icon: CheckCircle2 },
  "pending-payment": { label: "Payment Due", color: "bg-red-500/20 text-red-600", icon: AlertCircle },
};

const BookingsList = ({ onTrack, onMessage }: BookingsListProps) => {
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const viewDetails = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Truck className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Payment Due</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Cargo Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockBookings.map((booking) => {
                const status = statusConfig[booking.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-primary">{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{booking.cargoType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p>{booking.pickup}</p>
                        <p className="text-muted-foreground">→ {booking.delivery}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.date}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${status.color} border-0 gap-1`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold">${booking.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewDetails(booking)}>
                            <Eye size={16} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {booking.status === "in-transit" && (
                            <DropdownMenuItem onClick={onTrack}>
                              <MapPin size={16} className="mr-2" />
                              Track Shipment
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={onMessage}>
                            <MessageSquare size={16} className="mr-2" />
                            Message Carrier
                          </DropdownMenuItem>
                          {booking.status === "completed" && (
                            <DropdownMenuItem>
                              <Star size={16} className="mr-2" />
                              Leave Review
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Booking {selectedBooking?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cargo Type</p>
                  <p className="font-semibold">{selectedBooking.cargoType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carrier</p>
                  <p className="font-semibold">{selectedBooking.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-semibold">{selectedBooking.pickup}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Location</p>
                  <p className="font-semibold">{selectedBooking.delivery}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-semibold">{selectedBooking.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-semibold">{selectedBooking.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipment Date</p>
                  <p className="font-semibold">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-semibold text-primary">${selectedBooking.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {selectedBooking.status === "in-transit" && (
                  <Button onClick={onTrack}>
                    <MapPin size={18} className="mr-2" />
                    Track Shipment
                  </Button>
                )}
                <Button variant="outline" onClick={onMessage}>
                  <MessageSquare size={18} className="mr-2" />
                  Message Carrier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsList;
