import { useState, useEffect } from "react";
import { Search, Eye, Edit, UserPlus, Filter, Calendar, Loader2, User, Camera, Pencil, FileCheck } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import ProviderProfileDialog from "./ProviderProfileDialog";

const statusConfig: Record<string, { label: string; color: string }> = {
  "pending_quote": { label: "Awaiting Quotes", color: "bg-blue-100 text-blue-800" },
  "quoted": { label: "Quotes Received", color: "bg-purple-100 text-purple-800" },
  "booked": { label: "Booked", color: "bg-green-100 text-green-800" },
  "in_transit": { label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
  "delivered": { label: "Delivered", color: "bg-teal-100 text-teal-800" },
  "completed": { label: "Completed", color: "bg-gray-100 text-gray-800" },
  "cancelled": { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bookingQuotes, setBookingQuotes] = useState<any[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [viewProviderId, setViewProviderId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/bookings/my-bookings");
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shipper_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cargo_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = async (booking: any) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
    setLoadingQuotes(true);
    try {
      const response = await api.get(`/quotes/booking/${booking.id}`);
      if (response.data.success) {
        setBookingQuotes(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load quotes for this booking");
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground">Monitor all cargo and shipments in the system</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, shipper, or cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Shipper</TableHead>
                  <TableHead>Cargo Type</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Pickup Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No bookings found</TableCell>
                  </TableRow>
                ) : filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.shipper_name || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{booking.shipper_company || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="capitalize">{booking.cargo_type}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {booking.pickup_city}, {booking.pickup_state}
                        <div className="text-muted-foreground">→ {booking.delivery_city}, {booking.delivery_state}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(booking.shipment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[booking.status]?.color || "bg-gray-100"} variant="secondary">
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(val) => handleUpdateStatus(booking.id, val)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending_quote">Pending Quote</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => handleView(booking)} className="h-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Load Information</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Cargo Type:</span>
                      <span className="capitalize">{selectedBooking.cargo_type}</span>
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{selectedBooking.dimensions_length_ft}' x {selectedBooking.dimensions_width_ft}' x {selectedBooking.dimensions_height_ft}'</span>
                      <span className="text-muted-foreground">Weight:</span>
                      <span>{selectedBooking.weight_lbs?.toLocaleString()} lbs</span>
                      <span className="text-muted-foreground">Escort Req:</span>
                      <span>{selectedBooking.requires_escort ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Route & Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground font-bold">PICKUP</p>
                        <p>{selectedBooking.pickup_address}, {selectedBooking.pickup_city}, {selectedBooking.pickup_state}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold">DELIVERY</p>
                        <p>{selectedBooking.delivery_address}, {selectedBooking.delivery_city}, {selectedBooking.delivery_state}</p>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground font-bold">DATE</p>
                        <p>{new Date(selectedBooking.shipment_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Shipper</h4>
                    <div className="text-sm">
                      <p className="font-bold">{selectedBooking.shipper_name}</p>
                      <p>{selectedBooking.shipper_company}</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Special Instructions</h4>
                    <p className="text-sm italic">{selectedBooking.special_instructions || 'No special instructions.'}</p>
                  </div>

                  {(selectedBooking.status === 'delivered' || selectedBooking.status === 'completed') && (
                    <div className="bg-card rounded-lg border p-4 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 rounded-md">
                          <FileCheck className="text-green-600" size={16} />
                        </div>
                        <h4 className="font-bold text-sm">Delivery Proof</h4>
                      </div>

                      {selectedBooking.delivery_photos && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Camera size={12} /> Delivery Photos
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {(() => {
                              try {
                                const photos = typeof selectedBooking.delivery_photos === 'string'
                                  ? JSON.parse(selectedBooking.delivery_photos)
                                  : selectedBooking.delivery_photos;

                                return Array.isArray(photos) && photos.map((photo: string, idx: number) => (
                                  <div key={idx} className="aspect-video rounded-md overflow-hidden bg-muted group relative border">
                                    <img
                                      src={photo}
                                      alt={`Delivery ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <a
                                      href={photo}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                      <Eye className="text-white" size={16} />
                                    </a>
                                  </div>
                                ));
                              } catch (e) {
                                return <p className="text-[10px] text-muted-foreground">Error loading photos</p>;
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-muted/30 p-2 rounded-md border">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Receiver</p>
                          <p className="font-bold text-xs">{selectedBooking.receiver_name} (Signed)</p>
                        </div>
                        <div className="bg-muted/30 p-2 rounded-md border">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Delivered At</p>
                          <p className="font-bold text-xs">{new Date(selectedBooking.updated_at).toLocaleString()}</p>
                        </div>
                      </div>

                      {selectedBooking.delivery_signature && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Pencil size={12} /> Signature
                          </p>
                          <div className="bg-white rounded-md border p-2 flex items-center justify-center">
                            <img
                              src={selectedBooking.delivery_signature}
                              alt="Signature"
                              className="max-h-20 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4">Quotes Received</h4>
                {loadingQuotes ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : bookingQuotes.length === 0 ? (
                  <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
                    No quotes have been submitted for this booking yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookingQuotes.map((quote) => (
                      <div key={quote.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={quote.role === 'carrier' ? 'default' : 'secondary'} className="capitalize">
                              {quote.role}
                            </Badge>
                            <span className="font-bold">{quote.full_name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {quote.company_name} • Submitted {new Date(quote.created_at).toLocaleDateString()}
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs mt-1"
                            onClick={() => {
                              setViewProviderId(quote.provider_id);
                              setProfileDialogOpen(true);
                            }}
                          >
                            <User className="h-3 w-3 mr-1" /> View Full Profile
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${parseFloat(quote.amount).toLocaleString()}</p>
                          <Badge variant="outline" className="capitalize text-[10px]">{quote.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProviderProfileDialog
        providerId={viewProviderId}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  );
};

export default ManageBookings;
