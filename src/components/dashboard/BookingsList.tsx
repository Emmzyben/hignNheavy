import { useState, useEffect } from "react";
import api from "@/lib/api";
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
  AlertCircle,
  Loader2,
  Pencil,
  Trash2,
  DollarSign,
  User,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import NewBooking from "./NewBooking";
import { useAuth } from "@/contexts/AuthContext";

interface BookingsListProps {
  onTrack: () => void;
  onMessage: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  "pending_quote": { label: "Pending Quote", color: "bg-yellow-500/20 text-yellow-600", icon: Clock },
  "quoted": { label: "Quoted", color: "bg-blue-500/20 text-blue-600", icon: Clock },
  "booked": { label: "Booked", color: "bg-primary/20 text-primary", icon: Package },
  "in_transit": { label: "In Transit", color: "bg-indigo-500/20 text-indigo-600", icon: Truck },
  "delivered": { label: "Delivered", color: "bg-green-500/20 text-green-600", icon: CheckCircle2 },
  "completed": { label: "Completed", color: "bg-green-500/20 text-green-600", icon: CheckCircle2 },
  "cancelled": { label: "Cancelled", color: "bg-red-500/20 text-red-600", icon: AlertCircle },
};

const BookingsList = ({ onTrack, onMessage }: BookingsListProps) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [acceptingQuoteId, setAcceptingQuoteId] = useState<string | null>(null);

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
      console.error("Fetch bookings error:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async (bookingId: string) => {
    setLoadingQuotes(true);
    try {
      const response = await api.get(`/quotes/booking/${bookingId}`);
      if (response.data.success) {
        setQuotes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    setAcceptingQuoteId(quoteId);
    try {
      const response = await api.put(`/quotes/${quoteId}/accept`);
      if (response.data.success) {
        toast.success("Quote accepted! Carrier assigned successfully.");
        setDetailsOpen(false);
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept quote");
    } finally {
      setAcceptingQuoteId(null);
    }
  };

  const mapBookingForDisplay = (b: any) => ({
    id: b.id,
    cargoType: b.cargo_type,
    pickup: `${b.pickup_city}, ${b.pickup_state}`,
    pickupFull: `${b.pickup_address}, ${b.pickup_city}, ${b.pickup_state}`,
    delivery: `${b.delivery_city}, ${b.delivery_state}`,
    deliveryFull: `${b.delivery_address}, ${b.delivery_city}, ${b.delivery_state}`,
    date: new Date(b.shipment_date).toLocaleDateString(),
    status: b.status,
    carrier: b.carrier_id || "Pending Assignment",
    price: b.agreed_price || 0,
    dimensions: `${b.dimensions_length_ft}ft x ${b.dimensions_width_ft}ft x ${b.dimensions_height_ft}ft`,
    weight: `${Number(b.weight_lbs).toLocaleString()} lbs`,
    specialInstructions: b.special_instructions,
    rawBooking: b
  });

  const handleEdit = (booking: any) => {
    setSelectedBooking(booking);
    setEditOpen(true);
  };

  const handleDeleteClick = (booking: any) => {
    setSelectedBooking(booking);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBooking) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(`/bookings/${selectedBooking.id}`);
      if (response.data.success) {
        toast.success("Booking deleted successfully");
        setDeleteConfirmOpen(false);
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  const viewDetails = (booking: any) => {
    setSelectedBooking(mapBookingForDisplay(booking));
    setDetailsOpen(true);
    if (user?.role === 'admin' && (booking.status === 'pending_quote' || booking.status === 'quoted')) {
      fetchQuotes(booking.id);
    } else {
      setQuotes([]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading your bookings...</p>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed' || b.status === 'delivered').length,
    inTransit: bookings.filter(b => b.status === 'in_transit').length,
    pending: bookings.filter(b => b.status === 'pending_quote' || b.status === 'quoted').length,
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
              <p className="text-2xl font-bold">{stats.total}</p>
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
              <p className="text-2xl font-bold">{stats.completed}</p>
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
              <p className="text-2xl font-bold">{stats.inTransit}</p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Clock className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Quote</p>
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
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Package className="text-muted-foreground" size={24} />
                      </div>
                      <p className="text-muted-foreground font-medium">No bookings found</p>
                      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((rawBooking) => {
                  const booking = mapBookingForDisplay(rawBooking);
                  const status = statusConfig[booking.status] || { label: booking.status, color: "bg-muted text-muted-foreground", icon: AlertCircle };
                  const StatusIcon = status.icon;
                  const canModify = booking.status === 'pending_quote' || booking.status === 'quoted';

                  return (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-primary truncate block max-w-[100px]" title={booking.id}>
                          {booking.id.split('-')[0]}...
                        </span>
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
                      <td className="px-6 py-4 font-semibold">
                        {booking.price > 0 ? `$${booking.price.toLocaleString()}` : 'TBD'}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewDetails(rawBooking)}>
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>

                            {canModify && (
                              <>
                                <DropdownMenuItem onClick={() => handleEdit(rawBooking)}>
                                  <Pencil size={16} className="mr-2" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(rawBooking)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete Booking
                                </DropdownMenuItem>
                              </>
                            )}

                            {booking.status === "in_transit" && (
                              <DropdownMenuItem onClick={onTrack}>
                                <MapPin size={16} className="mr-2" />
                                Track Shipment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={onMessage}>
                              <MessageSquare size={16} className="mr-2" />
                              Message Carrier
                            </DropdownMenuItem>
                            {(booking.status === "completed" || booking.status === "delivered") && (
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
                })
              )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cargo Type</p>
                  <p className="font-semibold">{selectedBooking.cargoType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Carrier</p>
                  <p className="font-semibold">{selectedBooking.carrier}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Pickup Location</p>
                  <p className="font-semibold">{selectedBooking.pickupFull}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Delivery Location</p>
                  <p className="font-semibold">{selectedBooking.deliveryFull}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                  <p className="font-semibold">{selectedBooking.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Weight</p>
                  <p className="font-semibold">{selectedBooking.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipment Date</p>
                  <p className="font-semibold">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                  <p className="font-semibold text-primary text-lg">
                    {selectedBooking.price > 0 ? `$${selectedBooking.price.toLocaleString()}` : 'Pending Quote'}
                  </p>
                </div>
              </div>

              {user?.role === "admin" && (selectedBooking.status === "pending_quote" || selectedBooking.status === "quoted") && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" />
                    Bids & Quotes
                  </h4>
                  {loadingQuotes ? (
                    <div className="flex items-center justify-center p-8 bg-muted/20 rounded-xl border border-dashed">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : quotes.length === 0 ? (
                    <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed">
                      <p className="text-muted-foreground">No quotes submitted yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quotes.map((quote) => (
                        <div key={quote.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border rounded-lg gap-4 hover:shadow-md transition-shadow">
                          <div className="space-y-1 flex-1">
                            <p className="font-bold text-lg text-primary">${Number(quote.amount).toLocaleString()}</p>
                            <p className="text-sm font-medium">{quote.carrier_name}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {quote.vehicle_name && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Truck size={12} /> {quote.vehicle_name}
                                </p>
                              )}
                              {quote.driver_name && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User size={12} /> {quote.driver_name}
                                </p>
                              )}
                            </div>
                            {quote.notes && <p className="text-xs text-muted-foreground italic mt-1 font-mono">"{quote.notes}"</p>}
                          </div>
                          <Button
                            onClick={() => handleAcceptQuote(quote.id)}
                            size="sm"
                            disabled={acceptingQuoteId !== null}
                            className="bg-green-600 hover:bg-green-700 shadow-sm"
                          >
                            {acceptingQuoteId === quote.id ? (
                              <><Loader2 size={14} className="mr-2 animate-spin" /> Accepting...</>
                            ) : (
                              "Accept Bid"
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedBooking.specialInstructions && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Special Instructions</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedBooking.specialInstructions}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                {selectedBooking.status === "in_transit" && (
                  <Button onClick={onTrack} className="flex-1 md:flex-none">
                    <MapPin size={18} className="mr-2" />
                    Track Shipment
                  </Button>
                )}
                <Button variant="outline" onClick={onMessage} className="flex-1 md:flex-none">
                  <MessageSquare size={18} className="mr-2" />
                  Message Carrier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Booking Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Edit Booking</DialogTitle>
          </DialogHeader>
          <NewBooking
            initialData={selectedBooking}
            onSuccess={() => {
              setEditOpen(false);
              fetchBookings();
            }}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your booking request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsList;
