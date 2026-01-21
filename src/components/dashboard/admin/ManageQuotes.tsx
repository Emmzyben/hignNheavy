import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search,
  Truck,
  Car,
  Calendar,
  MapPin,
  Package,
  Loader2,
  CheckCircle2,
  Info,
  ChevronRight,
  User
} from "lucide-react";
import ProviderProfileDialog from "./ProviderProfileDialog";
import { toast } from "sonner";
import api from "@/lib/api";

const ManageQuotes = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [selectedCarrierQuote, setSelectedCarrierQuote] = useState<string>("");
  const [selectedEscortQuote, setSelectedEscortQuote] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [viewProviderId, setViewProviderId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchUnmatchedBookings();
  }, []);

  const fetchUnmatchedBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/unmatched-bookings");
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load unmatched bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (booking: any) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
    setLoadingQuotes(true);
    setSelectedCarrierQuote("");
    setSelectedEscortQuote("");
    try {
      const response = await api.get(`/quotes/booking/${booking.id}`);
      if (response.data.success) {
        setQuotes(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load quotes for this booking");
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedBooking || !selectedCarrierQuote) {
      toast.error("Please select a carrier quote");
      return;
    }

    if (selectedBooking.requires_escort && !selectedEscortQuote) {
      if (!confirm("This booking requires an escort but none is selected. Proceed anyway?")) {
        return;
      }
    }

    setIsAssigning(true);
    try {
      const response = await api.post("/admin/assign-providers", {
        booking_id: selectedBooking.id,
        carrier_quote_id: selectedCarrierQuote,
        escort_quote_id: selectedEscortQuote || null
      });

      if (response.data.success) {
        toast.success("Providers assigned successfully!");
        setDetailsOpen(false);
        fetchUnmatchedBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to assign providers");
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.shipper_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.cargo_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const carrierQuotes = quotes.filter(q => q.role === 'carrier');
  const escortQuotes = quotes.filter(q => q.role === 'escort');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match Center</h1>
          <p className="text-muted-foreground">Assign providers to pending load requests</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, shipper, or cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-card border rounded-2xl border-dashed">
                <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No bookings awaiting assignment</p>
              </div>
            ) : filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(booking)}>
                <CardContent className="p-0">
                  <div className="bg-primary/5 p-4 border-b">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-mono text-[10px] mb-2">ID: {booking.id.slice(0, 8)}</Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-0">{booking.status}</Badge>
                    </div>
                    <h3 className="font-bold text-lg">{booking.cargo_type}</h3>
                    <p className="text-sm text-muted-foreground">Shipper: {booking.shipper_name}</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">{booking.pickup_city}, {booking.pickup_state} → {booking.delivery_city}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 shrink-0" />
                      <span>{new Date(booking.shipment_date).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-3 border-t flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="flex items-center text-xs">
                          <Truck className="h-3 w-3 mr-1 text-primary" />
                          <span className="font-bold">{booking.carrier_quote_count || 0}</span>
                        </div>
                        {booking.requires_escort && (
                          <div className="flex items-center text-xs">
                            <Car className="h-3 w-3 mr-1 text-purple-600" />
                            <span className="font-bold">{booking.escort_quote_count || 0}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-primary">
                        Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Assignment Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Info className="h-6 w-6 text-primary" /> Match Assignment
            </DialogTitle>
            <DialogDescription className="sr-only">
              Assign a carrier and optionally an escort to this booking.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Full Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-xl border">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Cargo Information</p>
                  <h4 className="font-bold text-lg leading-tight">{selectedBooking?.cargo_type}</h4>
                  <p className="text-sm text-balance italic mt-1 text-muted-foreground">{selectedBooking?.cargo_description}</p>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-background p-3 rounded-lg border shadow-sm">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Dimensions</span>
                      <span className="text-sm font-bold">{selectedBooking?.dimensions_length_ft}'L x {selectedBooking?.dimensions_width_ft}'W x {selectedBooking?.dimensions_height_ft}'H</span>
                    </div>
                    <div className="bg-background p-3 rounded-lg border shadow-sm">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Weight</span>
                      <span className="text-sm font-bold">{selectedBooking?.weight_lbs?.toLocaleString()} lbs</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Customer / Shipper</p>
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <h5 className="font-black text-primary text-lg leading-none">{selectedBooking?.shipper_name}</h5>
                    <p className="text-sm font-bold text-foreground mt-1">{selectedBooking?.shipper_company || 'Independent Shipper'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Service Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking?.requires_escort ? (
                      <Badge className="bg-purple-100 text-purple-800 border-0">High-Heavy Escort Required</Badge>
                    ) : (
                      <Badge variant="outline">Standard Escort Not Required</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Logistics & Route</p>
                  <div className="space-y-4 relative">
                    <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-muted-foreground/20 border-dashed" />

                    <div className="flex gap-3 relative z-10">
                      <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-green-600 leading-none mb-1">Pickup Point</p>
                        <p className="text-sm font-bold">{selectedBooking?.pickup_address}</p>
                        <p className="text-xs text-muted-foreground">{selectedBooking?.pickup_city}, {selectedBooking?.pickup_state}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 relative z-10">
                      <div className="h-4 w-4 rounded-full bg-red-500 border-2 border-background shadow-sm" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-red-600 leading-none mb-1">Delivery Destination</p>
                        <p className="text-sm font-bold">{selectedBooking?.delivery_address}</p>
                        <p className="text-xs text-muted-foreground">{selectedBooking?.delivery_city}, {selectedBooking?.delivery_state}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Shipment Date</p>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Calendar className="h-4 w-4 text-primary" />
                      {selectedBooking && new Date(selectedBooking.shipment_date).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedBooking?.flexible_dates ? (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Flexibility</p>
                      <Badge variant="secondary">Date is Flexible</Badge>
                    </div>
                  ) : null}
                </div>

                {selectedBooking?.special_instructions && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <p className="text-[10px] text-amber-700 uppercase font-black mb-1">⚠️ Special Instructions</p>
                    <p className="text-xs italic text-amber-900 leading-relaxed">{selectedBooking.special_instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Carrier Quotes Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Carrier Bids ({carrierQuotes.length})
                </h3>
              </div>
              <div className="space-y-3">
                {carrierQuotes.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
                    No carrier bids submitted yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {carrierQuotes.map((quote) => (
                      <div
                        key={quote.id}
                        className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedCarrierQuote === quote.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
                          }`}
                        onClick={() => setSelectedCarrierQuote(quote.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedCarrierQuote === quote.id ? 'border-primary' : 'border-muted-foreground/30'}`}>
                            {selectedCarrierQuote === quote.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                          </div>
                          <div>
                            <p className="font-bold">{quote.carrier_name}</p>
                            <p className="text-xs text-muted-foreground">{quote.company_name} • Driver: {quote.driver_name || 'Not specified'}</p>
                            {quote.notes && <p className="text-xs italic mt-1 text-muted-foreground">"{quote.notes}"</p>}
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs mt-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewProviderId(quote.provider_id);
                                setProfileDialogOpen(true);
                              }}
                            >
                              <User className="h-3 w-3 mr-1" /> View Full Profile
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-primary">${parseFloat(quote.amount).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Escort Quotes Section */}
            {selectedBooking?.requires_escort && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Car className="h-5 w-5 text-purple-600" /> Escort Bids ({escortQuotes.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {escortQuotes.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
                      No escort bids submitted yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {escortQuotes.map((quote) => (
                        <div
                          key={quote.id}
                          className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedEscortQuote === quote.id ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'hover:bg-muted/50'
                            }`}
                          onClick={() => setSelectedEscortQuote(quote.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedEscortQuote === quote.id ? 'border-purple-600' : 'border-muted-foreground/30'}`}>
                              {selectedEscortQuote === quote.id && <div className="h-2 w-2 rounded-full bg-purple-600" />}
                            </div>
                            <div>
                              <p className="font-bold">{quote.carrier_name}</p>
                              <p className="text-xs text-muted-foreground">{quote.company_name} • Experience: {quote.years_experience || 'N/A'} yrs</p>
                              {quote.notes && <p className="text-xs italic mt-1 text-muted-foreground">"{quote.notes}"</p>}
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs mt-1 text-purple-600 hover:text-purple-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewProviderId(quote.provider_id);
                                  setProfileDialogOpen(true);
                                }}
                              >
                                <User className="h-3 w-3 mr-1" /> View Full Profile
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-purple-600">${parseFloat(quote.amount).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 border-t bg-muted/10 gap-4">
            <div className="mr-auto text-left">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Match Price</p>
              <p className="text-2xl font-black text-foreground">
                ${(
                  (selectedCarrierQuote ? parseFloat(carrierQuotes.find(q => q.id === selectedCarrierQuote)?.amount || 0) : 0) +
                  (selectedEscortQuote ? parseFloat(escortQuotes.find(q => q.id === selectedEscortQuote)?.amount || 0) : 0)
                ).toLocaleString()}
              </p>
            </div>
            <Button variant="outline" onClick={() => setDetailsOpen(false)} disabled={isAssigning}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 h-12 px-8 font-bold"
              onClick={handleAssign}
              disabled={isAssigning || !selectedCarrierQuote}
            >
              {isAssigning ? <Loader2 className="mr-2 animate-spin h-5 w-5" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
              Assign & Book Shipment
            </Button>
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

export default ManageQuotes;
