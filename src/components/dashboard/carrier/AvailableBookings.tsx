import { useState, useEffect } from 'react';
import { MapPin, Calendar, Package, DollarSign, User, Send, FileText, Loader2, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';

type BookingTab = 'available' | 'my-quotes' | 'won-jobs';

interface AvailableBookingsProps {
  onMessage?: (bookingId: string, participantId: string) => void;
}

const AvailableBookings = ({ onMessage }: AvailableBookingsProps) => {
  const [activeTab, setActiveTab] = useState<BookingTab>('available');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'available': endpoint = '/quotes/available'; break;
        case 'my-quotes': endpoint = '/quotes/my-quotes'; break;
        case 'won-jobs': endpoint = '/quotes/won-jobs'; break;
      }
      const response = await api.get(endpoint);
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/vehicles')
      ]);
      if (driversRes.data.success) setDrivers(driversRes.data.data);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleSubmitQuote = async () => {
    if (!quotePrice || !selectedDriver || !selectedEquipment || !quoteNotes) {
      toast.error('Please fill in all fields (Price, Driver, Vehicle, and Notes)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/quotes', {
        booking_id: selectedBooking.id,
        amount: quotePrice,
        driver_id: selectedDriver,
        vehicle_id: selectedEquipment,
        notes: quoteNotes
      });

      if (response.data.success) {
        toast.success(`Quote submitted for ${selectedBooking.id.split('-')[0]}. Admin will review and match.`);
        setQuoteDialogOpen(false);
        fetchBookings(); // Refresh list
        resetQuoteForm();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Booking status updated to ${newStatus.replace('_', ' ')}`);
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const resetQuoteForm = () => {
    setSelectedBooking(null);
    setSelectedDriver('');
    setSelectedEquipment('');
    setQuotePrice('');
    setQuoteNotes('');
  };

  const openQuoteDialog = (booking: any) => {
    setSelectedBooking(booking);
    setQuoteDialogOpen(true);
  };

  const openDetailsDialog = (booking: any) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500/20 text-yellow-600 border-0"><Clock size={12} className="mr-1" /> Pending</Badge>;
      case 'accepted': return <Badge className="bg-green-500/20 text-green-600 border-0"><CheckCircle2 size={12} className="mr-1" /> Accepted</Badge>;
      case 'rejected': return <Badge className="bg-red-500/20 text-red-600 border-0">Rejected</Badge>;
      case 'expired': return <Badge variant="outline">Expired</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Carrier Load Board</h1>
          <p className="text-muted-foreground">Find work and manage your active bids</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={activeTab === 'available' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('available')}
          className={activeTab === 'available' ? 'bg-primary text-white shadow-sm' : ''}
        >
          Available Loads
        </Button>
        <Button
          variant={activeTab === 'my-quotes' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('my-quotes')}
          className={activeTab === 'my-quotes' ? 'bg-primary text-white shadow-sm' : ''}
        >
          My Quotes
        </Button>
        <Button
          variant={activeTab === 'won-jobs' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('won-jobs')}
          className={activeTab === 'won-jobs' ? 'bg-primary text-white shadow-sm' : ''}
        >
          Won Jobs
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Fetching records...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-muted-foreground">
                {activeTab === 'available' ? 'Check back later for new loads.' :
                  activeTab === 'my-quotes' ? "You haven't submitted any quotes yet." :
                    "You don't have any assigned jobs yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="hover:border-primary/50 transition-colors border shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">{booking.id.split('-')[0]}...</Badge>
                      <span className="text-sm text-muted-foreground">Shipper: {booking.shipper_name}</span>
                      {booking.requires_escort === 1 && (
                        <Badge className="bg-orange-500/10 text-orange-600 border-0">Escort Required</Badge>
                      )}
                      {activeTab === 'my-quotes' && getStatusBadge(booking.quote_status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Route</p>
                          <p className="font-medium">{booking.pickup_city}, {booking.pickup_state}</p>
                          <p className="text-sm text-muted-foreground">to {booking.delivery_city}, {booking.delivery_state}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Requested Date</p>
                          <p className="font-medium">{new Date(booking.shipment_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Cargo</p>
                          <p className="font-medium">{booking.cargo_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.dimensions_length_ft}x{booking.dimensions_width_ft}x{booking.dimensions_height_ft}ft • {Number(booking.weight_lbs).toLocaleString()} lbs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                    <Button variant="ghost" onClick={() => openDetailsDialog(booking)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    {activeTab === 'available' ? (
                      <Button
                        onClick={() => openQuoteDialog(booking)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Quote
                      </Button>
                    ) : activeTab === 'my-quotes' ? (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-bold uppercase">Your Bid</p>
                        <p className="text-xl font-bold text-primary">${Number(booking.amount).toLocaleString()}</p>
                      </div>
                    ) : (
                      <div className="text-right space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase">Accepted Price</p>
                          <p className="text-xl font-bold text-green-600">${Number(booking.agreed_price).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Select
                            value={booking.status}
                            onValueChange={(val) => handleUpdateBookingStatus(booking.id, val)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="booked">Booked</SelectItem>
                              <SelectItem value="in_transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 justify-center">
                            {booking.status.replace('_', ' ')}
                          </Badge>
                          {onMessage && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-[140px] h-8 text-xs gap-1"
                              onClick={() => onMessage(booking.id, booking.shipper_id)}
                            >
                              <MessageSquare size={14} /> Chat Shipper
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shipment Details - {selectedBooking?.id.split('-')[0]}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Location Details</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pickup Address</p>
                        <p className="text-sm font-medium">{selectedBooking.pickup_address}</p>
                        <p className="text-sm text-muted-foreground">{selectedBooking.pickup_city}, {selectedBooking.pickup_state} {selectedBooking.pickup_zip}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-green-600 shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery Address</p>
                        <p className="text-sm font-medium">{selectedBooking.delivery_address}</p>
                        <p className="text-sm text-muted-foreground">{selectedBooking.delivery_city}, {selectedBooking.delivery_state} {selectedBooking.delivery_zip}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Schedule & Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipment Date:</span>
                      <span className="font-medium">{new Date(selectedBooking.shipment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Escort Required:</span>
                      <span className="font-medium">{selectedBooking.requires_escort === 1 ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Cargo Information</h4>
                  <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-bold">{selectedBooking.cargo_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{Number(selectedBooking.weight_lbs).toLocaleString()} lbs</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">{selectedBooking.dimensions_length_ft}L x {selectedBooking.dimensions_width_ft}W x {selectedBooking.dimensions_height_ft}H ft</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Special Instructions</h4>
                  <p className="text-sm p-3 bg-yellow-50/50 rounded-lg border border-yellow-100 text-muted-foreground italic">
                    {selectedBooking.special_instructions || 'No special instructions provided by shipper.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Shipper Contacts</h4>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{selectedBooking.shipper_name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            {activeTab === 'available' && (
              <Button onClick={() => {
                setDetailsDialogOpen(false);
                openQuoteDialog(selectedBooking);
              }}>
                Proceed to Quote
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={(open) => {
        setQuoteDialogOpen(open);
        if (!open) resetQuoteForm();
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Bid for Load {selectedBooking?.id.split('-')[0]}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2 border">
              <p className="text-sm flex justify-between"><span><strong>Route:</strong></span> <span>{selectedBooking?.pickup_city} → {selectedBooking?.delivery_city}</span></p>
              <p className="text-sm flex justify-between"><span><strong>Cargo:</strong></span> <span>{selectedBooking?.cargo_type}</span></p>
              <p className="text-sm flex justify-between"><span><strong>Weight:</strong></span> <span>{Number(selectedBooking?.weight_lbs).toLocaleString()} lbs</span></p>
            </div>

            <div className="space-y-2">
              <Label>Your Quote Price (Total Service Fee) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="pl-9 h-12 text-lg font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assign Driver *</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.filter(d => d.status === 'available').length === 0 ? (
                      <SelectItem value="none" disabled>No available drivers</SelectItem>
                    ) : (
                      drivers.filter(d => d.status === 'available').map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Vehicle *</Label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.status === 'available').length === 0 ? (
                      <SelectItem value="none" disabled>No available vehicles</SelectItem>
                    ) : (
                      vehicles.filter(v => v.status === 'available').map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.name} ({v.type})</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes (Required)</Label>
              <Textarea
                placeholder="Escort status, insurance coverage, or special terms..."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setQuoteDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSubmitQuote} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4 mr-2" /> Submit Quote</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableBookings;
