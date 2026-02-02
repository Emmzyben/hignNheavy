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
  Camera,
  FileCheck,
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
import ProviderProfileDialog from "./admin/ProviderProfileDialog";
import { Shield } from "lucide-react";

interface BookingsListProps {
  onTrack: (bookingId?: string) => void;
  onMessage: (bookingId: string, providerId: string) => void;
  onReview?: (bookingId: string) => void;
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

const BookingsList = ({ onTrack, onMessage, onReview }: BookingsListProps) => {
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
    carrier_id: b.carrier_id,
    carrier_name: b.carrier_name,
    carrier_company: b.carrier_company,
    escort_id: b.escort_id,
    escort_name: b.escort_name,
    escort_company: b.escort_company,
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewDetails(rawBooking)}
                            title="View Details"
                          >
                            <Eye size={18} className="text-primary" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
                                <DropdownMenuItem onClick={() => onTrack(booking.id)}>
                                  <MapPin size={16} className="mr-2" />
                                  Track Shipment
                                </DropdownMenuItem>
                              )}

                              {(booking.status === "completed" || booking.status === "delivered") && (
                                <DropdownMenuItem onClick={() => onReview && onReview(booking.id)}>
                                  <Star size={16} className="mr-2" />
                                  Leave Review
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
        <DialogContent className="max-w-none w-screen h-screen overflow-y-auto p-0 gap-0 border-none rounded-none left-0 top-0 translate-x-0 translate-y-0">
          <div className="max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8">
            <DialogHeader className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-3xl font-display font-bold">
                    Booking Detail
                  </DialogTitle>
                  <p className="text-muted-foreground mt-1">ID: #{selectedBooking?.id}</p>
                </div>
              </div>
            </DialogHeader>

            {selectedBooking && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Package className="text-primary" size={20} />
                      Shipment Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Cargo Type</p>
                        <p className="text-lg font-semibold">{selectedBooking.cargoType}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Status</p>
                        <Badge className={`${statusConfig[selectedBooking.status]?.color || "bg-muted"} border-0 capitalize py-1 px-3`}>
                          {selectedBooking.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="md:col-span-2 bg-muted/30 p-4 rounded-xl space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                            <MapPin className="text-primary" size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pickup Location</p>
                            <p className="font-semibold text-lg">{selectedBooking.pickupFull}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-secondary/10 rounded-lg">
                            <MapPin className="text-secondary" size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Location</p>
                            <p className="font-semibold text-lg">{selectedBooking.deliveryFull}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Dimensions</p>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-muted rounded-md"><Package size={14} className="text-muted-foreground" /></div>
                          <p className="font-semibold">{selectedBooking.dimensions}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Weight</p>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-muted rounded-md"><Truck size={14} className="text-muted-foreground" /></div>
                          <p className="font-semibold">{selectedBooking.weight}</p>
                        </div>
                      </div>
                    </div>

                    {selectedBooking.specialInstructions && (
                      <div className="mt-8 pt-8 border-t border-border">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Special Instructions</p>
                        <div className="bg-muted/50 p-6 rounded-xl border-l-4 border-primary">
                          <p className="text-muted-foreground italic leading-relaxed">
                            {selectedBooking.specialInstructions}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Matched Providers Section */}
                  {(selectedBooking.carrier_id || selectedBooking.escort_id) && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-xl ml-1">Assigned Providers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedBooking.carrier_id && (
                          <div className="p-6 bg-card rounded-2xl border shadow-sm space-y-4 transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Truck className="text-primary" size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Carrier</p>
                                <p className="font-bold text-lg leading-tight">{selectedBooking.carrier_company || selectedBooking.carrier_name}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-10 font-bold"
                                onClick={() => {
                                  setViewProviderId(selectedBooking.carrier_id);
                                  setProfileDialogOpen(true);
                                }}
                              >
                                <User size={16} className="mr-2" /> Profile
                              </Button>
                              <Button
                                className="flex-1 rounded-xl h-10 font-bold"
                                onClick={() => onMessage(selectedBooking.id, selectedBooking.carrier_id)}
                              >
                                <MessageSquare size={16} className="mr-2" /> Chat
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedBooking.escort_id && (
                          <div className="p-6 bg-card rounded-2xl border shadow-sm space-y-4 border-purple-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                <Shield size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Escort Service</p>
                                <p className="font-bold text-lg leading-tight text-purple-900">{selectedBooking.escort_company || selectedBooking.escort_name}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-10 font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
                                onClick={() => {
                                  setViewProviderId(selectedBooking.escort_id);
                                  setProfileDialogOpen(true);
                                }}
                              >
                                <User size={16} className="mr-2" /> Profile
                              </Button>
                              <Button
                                className="flex-1 rounded-xl h-10 font-bold bg-purple-600 text-white hover:bg-purple-700"
                                onClick={() => onMessage(selectedBooking.id, selectedBooking.escort_id)}
                              >
                                <MessageSquare size={16} className="mr-2" /> Chat
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {user?.role === "admin" && (selectedBooking.status === "pending_quote" || selectedBooking.status === "quoted") && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-xl flex items-center gap-2 ml-1">
                        <DollarSign size={24} className="text-primary" />
                        Bids Received
                      </h4>
                      {loadingQuotes ? (
                        <div className="flex items-center justify-center p-12 bg-muted/20 rounded-2xl border border-dashed">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : quotes.length === 0 ? (
                        <div className="p-12 text-center bg-muted/20 rounded-2xl border border-dashed">
                          <p className="text-muted-foreground">No quotes submitted yet for this booking.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {quotes.map((quote) => (
                            <div key={quote.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-card border rounded-2xl gap-6 hover:shadow-lg transition-all">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-black text-3xl text-primary">${Number(quote.amount).toLocaleString()}</p>
                                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">BEST VALUE</Badge>
                                </div>
                                <p className="font-bold text-lg">{quote.carrier_name}</p>
                                <div className="flex flex-wrap gap-4">
                                  {quote.vehicle_name && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                      <Truck size={14} className="text-primary" /> {quote.vehicle_name}
                                    </p>
                                  )}
                                  {quote.driver_name && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                      <User size={14} className="text-primary" /> {quote.driver_name}
                                    </p>
                                  )}
                                </div>
                                {quote.notes && (
                                  <div className="mt-2 text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl italic">
                                    "{quote.notes}"
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => handleAcceptQuote(quote.id)}
                                size="lg"
                                disabled={acceptingQuoteId !== null}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 min-w-[160px]"
                              >
                                {acceptingQuoteId === quote.id ? (
                                  <><Loader2 size={18} className="mr-2 animate-spin" /> Accepting...</>
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
                </div>

                <div className="space-y-6">
                  <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <p className="text-primary-foreground/70 font-bold uppercase tracking-wider text-xs mb-2">Agreed Price</p>
                    <p className="text-5xl font-black mb-6">
                      {selectedBooking.price > 0 ? `$${selectedBooking.price.toLocaleString()}` : 'TBD'}
                    </p>
                    <div className="space-y-4 pt-6 border-t border-primary-foreground/20 text-sm font-medium">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Booking Date</span>
                        <span className="font-bold">{selectedBooking.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-lg mb-2">Actions</h4>
                    <div className="grid gap-3">
                      {selectedBooking.status === "in_transit" && (
                        <Button onClick={() => onTrack(selectedBooking.id)} className="w-full h-12 font-bold rounded-xl shadow-md">
                          <MapPin size={20} className="mr-2" />
                          Live Tracking
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full h-12 font-bold rounded-xl"
                        onClick={() => setDetailsOpen(false)}
                      >
                        Close Details
                      </Button>
                    </div>
                  </div>

                  {(selectedBooking.status === 'delivered' || selectedBooking.status === 'completed') && (
                    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileCheck className="text-green-600" size={20} />
                        </div>
                        <h4 className="font-bold text-lg">Delivery Proof</h4>
                      </div>

                      {selectedBooking.rawBooking?.delivery_photos && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Camera size={14} /> Delivery Photos
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {(() => {
                              try {
                                const photos = typeof selectedBooking.rawBooking.delivery_photos === 'string'
                                  ? JSON.parse(selectedBooking.rawBooking.delivery_photos)
                                  : selectedBooking.rawBooking.delivery_photos;

                                return Array.isArray(photos) && photos.map((photo: string, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-muted group relative">
                                    <img
                                      src={photo}
                                      alt={`Delivery ${idx + 1}`}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                    <a
                                      href={photo}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                      <Eye className="text-white" size={20} />
                                    </a>
                                  </div>
                                ));
                              } catch (e) {
                                return <p className="text-sm text-muted-foreground">Error loading photos</p>;
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Receiver Name</p>
                          <p className="font-bold">{selectedBooking.rawBooking?.receiver_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Delivered On</p>
                          <p className="font-bold">
                            {selectedBooking.rawBooking?.updated_at
                              ? new Date(selectedBooking.rawBooking.updated_at).toLocaleString()
                              : 'TBD'}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.rawBooking?.delivery_signature && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <Pencil size={14} /> Digital Signature
                          </p>
                          <div className="bg-white rounded-xl border p-4 flex items-center justify-center">
                            <img
                              src={selectedBooking.rawBooking.delivery_signature}
                              alt="Receiver Signature"
                              className="max-h-32 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 bg-muted/30 rounded-2xl border border-dashed text-center">
                    <AlertCircle className="mx-auto mb-2 text-muted-foreground" size={24} />
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      Need help with this booking? <br />
                      Contact our support team anytime.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
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

      <ProviderProfileDialog
        providerId={viewProviderId}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  );
};

export default BookingsList;
