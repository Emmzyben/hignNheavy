import { useState } from "react";
import { Search, Eye, Edit, UserPlus, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Booking {
  id: string;
  shipper: string;
  cargo: string;
  dimensions: string;
  weight: string;
  origin: string;
  destination: string;
  pickupDate: string;
  status: "pending" | "awaiting-quotes" | "quotes-received" | "matched" | "in-transit" | "completed" | "cancelled";
  carrier?: string;
  carrierQuote?: number;
  escort?: string;
  escortQuote?: number;
  totalPrice?: number;
  createdAt: string;
}

interface Quote {
  id: string;
  provider: string;
  type: "carrier" | "escort";
  price: number;
  driver?: string;
  equipment?: string;
  vehicle?: string;
  notes: string;
  submittedAt: string;
}

const mockBookings: Booking[] = [
  { id: "BK-2024-001", shipper: "Heavy Industries Inc", cargo: "Wind Turbine Blade", dimensions: "180' x 14' x 14'", weight: "45 tons", origin: "Houston, TX", destination: "Dallas, TX", pickupDate: "2024-12-20", status: "quotes-received", createdAt: "2024-12-10" },
  { id: "BK-2024-002", shipper: "MegaLoad Corp", cargo: "Industrial Generator", dimensions: "25' x 12' x 10'", weight: "28 tons", origin: "Dallas, TX", destination: "Austin, TX", pickupDate: "2024-12-22", status: "matched", carrier: "FastHaul Logistics", carrierQuote: 8500, escort: "SafeRoute Escorts", escortQuote: 1200, totalPrice: 9700, createdAt: "2024-12-08" },
  { id: "BK-2024-003", shipper: "TransGlobal LLC", cargo: "Mining Equipment", dimensions: "35' x 16' x 12'", weight: "62 tons", origin: "Austin, TX", destination: "El Paso, TX", pickupDate: "2024-12-25", status: "in-transit", carrier: "Heavy Movers Inc", carrierQuote: 15200, escort: "Highway Guard LLC", escortQuote: 2100, totalPrice: 17300, createdAt: "2024-12-05" },
  { id: "BK-2024-004", shipper: "CargoMax Solutions", cargo: "Bridge Beam Section", dimensions: "120' x 8' x 6'", weight: "38 tons", origin: "San Antonio, TX", destination: "Houston, TX", pickupDate: "2024-12-28", status: "pending", createdAt: "2024-12-14" },
  { id: "BK-2024-005", shipper: "Heavy Industries Inc", cargo: "Transformer Unit", dimensions: "18' x 10' x 12'", weight: "55 tons", origin: "Houston, TX", destination: "Amarillo, TX", pickupDate: "2024-12-30", status: "completed", carrier: "BigRig Transport", carrierQuote: 12800, escort: "LoadWatch Services", escortQuote: 1800, totalPrice: 14600, createdAt: "2024-12-01" },
];

const mockQuotes: Quote[] = [
  { id: "Q-001", provider: "FastHaul Logistics", type: "carrier", price: 8200, driver: "Tom Baker", equipment: "Lowboy LB-5500", notes: "Available immediately, experienced with wind turbines", submittedAt: "2024-12-11" },
  { id: "Q-002", provider: "Heavy Movers Inc", type: "carrier", price: 8500, driver: "Lisa Wang", equipment: "RGN Trailer", notes: "Can accommodate the full length", submittedAt: "2024-12-12" },
  { id: "Q-003", provider: "SafeRoute Escorts", type: "escort", price: 1200, vehicle: "Ford F-150 (2023)", notes: "Front and rear escort available", submittedAt: "2024-12-11" },
  { id: "Q-004", provider: "Highway Guard LLC", type: "escort", price: 1350, vehicle: "Chevrolet Silverado", notes: "24/7 availability", submittedAt: "2024-12-12" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  "pending": { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  "awaiting-quotes": { label: "Awaiting Quotes", color: "bg-blue-100 text-blue-800" },
  "quotes-received": { label: "Quotes Received", color: "bg-purple-100 text-purple-800" },
  "matched": { label: "Matched", color: "bg-green-100 text-green-800" },
  "in-transit": { label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
  "completed": { label: "Completed", color: "bg-gray-100 text-gray-800" },
  "cancelled": { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [selectedEscort, setSelectedEscort] = useState<string>("");

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleMatch = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedCarrier("");
    setSelectedEscort("");
    setMatchDialogOpen(true);
  };

  const handleConfirmMatch = () => {
    if (selectedBooking && selectedCarrier && selectedEscort) {
      const carrierQuote = mockQuotes.find(q => q.provider === selectedCarrier);
      const escortQuote = mockQuotes.find(q => q.provider === selectedEscort);
      
      setBookings(bookings.map(b => 
        b.id === selectedBooking.id 
          ? { 
              ...b, 
              status: "matched" as const, 
              carrier: selectedCarrier,
              carrierQuote: carrierQuote?.price,
              escort: selectedEscort,
              escortQuote: escortQuote?.price,
              totalPrice: (carrierQuote?.price || 0) + (escortQuote?.price || 0)
            }
          : b
      ));
      setMatchDialogOpen(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: Booking["status"]) => {
    if (selectedBooking) {
      setBookings(bookings.map(b => 
        b.id === selectedBooking.id ? { ...b, status: newStatus } : b
      ));
      setEditDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage All Bookings</h1>
        <p className="text-muted-foreground">View, filter, and manage all bookings in the system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="bg-card border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{config.label}</p>
            <p className="text-2xl font-bold">{bookings.filter(b => b.status === status).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Shipper</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Escort</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                <TableCell className="font-medium">{booking.shipper}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{booking.cargo}</p>
                    <p className="text-xs text-muted-foreground">{booking.weight}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{booking.origin}</p>
                    <p className="text-muted-foreground">→ {booking.destination}</p>
                  </div>
                </TableCell>
                <TableCell>{booking.pickupDate}</TableCell>
                <TableCell>
                  {booking.carrier ? (
                    <div>
                      <p className="text-sm">{booking.carrier}</p>
                      <p className="text-xs text-green-600">${booking.carrierQuote?.toLocaleString()}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {booking.escort ? (
                    <div>
                      <p className="text-sm">{booking.escort}</p>
                      <p className="text-xs text-green-600">${booking.escortQuote?.toLocaleString()}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[booking.status]?.color}>
                    {statusConfig[booking.status]?.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleView(booking)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(booking)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {(booking.status === "quotes-received" || booking.status === "pending") && (
                      <Button variant="ghost" size="icon" onClick={() => handleMatch(booking)}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Shipper</p>
                  <p className="font-medium">{selectedBooking.shipper}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusConfig[selectedBooking.status]?.color}>
                    {statusConfig[selectedBooking.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-medium">{selectedBooking.cargo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-medium">{selectedBooking.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{selectedBooking.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Date</p>
                  <p className="font-medium">{selectedBooking.pickupDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium">{selectedBooking.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{selectedBooking.destination}</p>
                </div>
              </div>

              {selectedBooking.carrier && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Matched Providers</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-medium">{selectedBooking.carrier}</p>
                      <p className="text-green-600 font-bold">${selectedBooking.carrierQuote?.toLocaleString()}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Escort</p>
                      <p className="font-medium">{selectedBooking.escort}</p>
                      <p className="text-green-600 font-bold">${selectedBooking.escortQuote?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-2xl font-bold">${selectedBooking.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {selectedBooking.status === "quotes-received" && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Received Quotes</h4>
                  <div className="space-y-3">
                    {mockQuotes.map((quote) => (
                      <div key={quote.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant={quote.type === "carrier" ? "default" : "secondary"}>
                              {quote.type}
                            </Badge>
                            <p className="font-medium mt-1">{quote.provider}</p>
                            {quote.driver && <p className="text-sm text-muted-foreground">Driver: {quote.driver}</p>}
                            {quote.equipment && <p className="text-sm text-muted-foreground">Equipment: {quote.equipment}</p>}
                            {quote.vehicle && <p className="text-sm text-muted-foreground">Vehicle: {quote.vehicle}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">${quote.price.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{quote.submittedAt}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{quote.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Match Dialog */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Carrier & Escort</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a carrier and escort from the received quotes for booking {selectedBooking.id}
              </p>
              
              <div>
                <label className="text-sm font-medium">Select Carrier</label>
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockQuotes.filter(q => q.type === "carrier").map((quote) => (
                      <SelectItem key={quote.id} value={quote.provider}>
                        {quote.provider} - ${quote.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Select Escort</label>
                <Select value={selectedEscort} onValueChange={setSelectedEscort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an escort" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockQuotes.filter(q => q.type === "escort").map((quote) => (
                      <SelectItem key={quote.id} value={quote.provider}>
                        {quote.provider} - ${quote.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCarrier && selectedEscort && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Estimated Total</p>
                  <p className="text-2xl font-bold">
                    ${((mockQuotes.find(q => q.provider === selectedCarrier)?.price || 0) + 
                       (mockQuotes.find(q => q.provider === selectedEscort)?.price || 0)).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMatchDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmMatch} disabled={!selectedCarrier || !selectedEscort}>
                  Confirm Match
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking - {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Update Status</label>
                <Select defaultValue={selectedBooking.status} onValueChange={(val) => handleUpdateStatus(val as Booking["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <SelectItem key={status} value={status}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea placeholder="Add any notes about this booking..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setEditDialogOpen(false)}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBookings;
