import { useState, useEffect } from 'react';
import { MapPin, Calendar, Package, DollarSign, User, Send, FileText, Loader2, CheckCircle2, Clock, MessageSquare, Camera, Pencil, Eye, FileCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import ProviderProfileDialog from '../admin/ProviderProfileDialog';
import Loader from '@/components/ui/Loader';

type BookingTab = 'available' | 'my-quotes' | 'won-jobs';

interface AvailableBookingsProps {
  onMessage?: (bookingId: string, participantId: string) => void;
}

const AvailableBookings = ({ onMessage }: AvailableBookingsProps) => {
  const navigate = useNavigate();
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
  const [shipperProfileOpen, setShipperProfileOpen] = useState(false);
  const [selectedShipperId, setSelectedShipperId] = useState<string | null>(null);

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
    navigate(`/dashboard/carrier/shipment/${booking.id}`);
  };

  const handleOpenShipperProfile = (shipperId: string) => {
    setSelectedShipperId(shipperId);
    setShipperProfileOpen(true);
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
            <Loader size="md" text="Fetching records..." />
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
                      <button
                        onClick={() => handleOpenShipperProfile(booking.shipper_id)}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1"
                      >
                        Shipper: {booking.shipper_name}
                        <ExternalLink size={12} />
                      </button>
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
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 justify-center h-8 uppercase text-[10px] font-bold tracking-widest">
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
              {isSubmitting ? <><Loader size="sm" text="" className="mr-2" /> Submitting...</> : <><Send className="h-4 w-4 mr-2" /> Submit Quote</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shipper Profile Dialog */}
      <ProviderProfileDialog
        providerId={selectedShipperId}
        open={shipperProfileOpen}
        onOpenChange={setShipperProfileOpen}
        onMessage={(participantId) => {
          if (onMessage && selectedBooking) {
            onMessage(selectedBooking.id, participantId);
            setShipperProfileOpen(false);
          }
        }}
      />
    </div>
  );
};

export default AvailableBookings;
