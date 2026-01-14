import { useState } from "react";
import {
  MapPin,
  Calendar,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  Car,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const mockBookings = [
  {
    id: "REQ-001",
    origin: "Houston, TX",
    destination: "Dallas, TX",
    date: "2024-01-20",
    loadType: "Oversize Load",
    dimensions: "85ft x 14ft x 16ft",
    weight: "120,000 lbs",
    estimatedPay: "$800 - $1,200",
    distance: "240 miles",
    escortRequired: "Front & Rear",
    status: "available",
  },
  {
    id: "REQ-002",
    origin: "Austin, TX",
    destination: "San Antonio, TX",
    date: "2024-01-22",
    loadType: "Super Load",
    dimensions: "120ft x 16ft x 18ft",
    weight: "200,000 lbs",
    estimatedPay: "$1,500 - $2,000",
    distance: "80 miles",
    escortRequired: "Front, Rear & Side",
    status: "available",
  },
  {
    id: "REQ-003",
    origin: "Fort Worth, TX",
    destination: "Oklahoma City, OK",
    date: "2024-01-25",
    loadType: "Oversize Load",
    dimensions: "70ft x 12ft x 14ft",
    weight: "95,000 lbs",
    estimatedPay: "$600 - $900",
    distance: "200 miles",
    escortRequired: "Front Only",
    status: "quote-submitted",
    submittedQuote: 750,
  },
];

const mockVehicles = [
  { id: "V001", name: "Ford F-150 #1", type: "Pickup Truck", status: "available" },
  { id: "V002", name: "Chevy Silverado #2", type: "Pickup Truck", status: "available" },
  { id: "V003", name: "Dodge Ram #3", type: "Pickup Truck", status: "on-job" },
];

const AvailableBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quotePrice, setQuotePrice] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");

  const availableVehicles = mockVehicles.filter(v => v.status === "available");

  const handleSubmitQuote = () => {
    if (!quotePrice || !selectedVehicle) {
      toast.error("Please enter a quote price and select a vehicle");
      return;
    }

    setBookings(bookings.map(b => 
      b.id === selectedBooking?.id 
        ? { ...b, status: "quote-submitted", submittedQuote: parseFloat(quotePrice) }
        : b
    ));

    toast.success("Quote submitted successfully! Awaiting admin review.");
    setQuoteDialogOpen(false);
    setQuotePrice("");
    setSelectedVehicle("");
    setQuoteNotes("");
    setSelectedBooking(null);
  };

  const stats = [
    { label: "Available Jobs", value: bookings.filter(b => b.status === "available").length, icon: Package },
    { label: "Quotes Submitted", value: bookings.filter(b => b.status === "quote-submitted").length, icon: Send },
    { label: "Available Vehicles", value: availableVehicles.length, icon: Car },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Available Jobs</h1>
        <p className="text-muted-foreground">View and submit quotes for escort requests in your area</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">{booking.id}</span>
                    <Badge variant={booking.status === "quote-submitted" ? "secondary" : "default"}>
                      {booking.status === "quote-submitted" ? "Quote Submitted" : "Available"}
                    </Badge>
                    <Badge variant="outline">{booking.loadType}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-lg font-medium">
                    <MapPin className="h-5 w-5 text-primary" />
                    {booking.origin} → {booking.destination}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {booking.dimensions}
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      {booking.escortRequired}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {booking.estimatedPay}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Distance: {booking.distance}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {booking.status === "quote-submitted" ? (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Quote: ${booking.submittedQuote}</p>
                      <p className="text-xs text-muted-foreground">Awaiting admin review</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setQuoteDialogOpen(true);
                      }}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Submit Quote
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Quote for {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium">{selectedBooking?.origin} → {selectedBooking?.destination}</p>
              <p className="text-muted-foreground">{selectedBooking?.escortRequired}</p>
              <p className="text-muted-foreground">Estimated: {selectedBooking?.estimatedPay}</p>
            </div>

            <div className="space-y-2">
              <Label>Your Quote Price ($)</Label>
              <Input
                type="number"
                placeholder="Enter your quote"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Assign Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Any special equipment or qualifications..."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitQuote} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableBookings;
