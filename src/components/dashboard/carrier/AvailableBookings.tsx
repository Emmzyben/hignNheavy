import { useState } from 'react';
import { MapPin, Calendar, Package, DollarSign, User, Send, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const mockRequests = [
  {
    id: 'REQ-001',
    shipper: 'ABC Construction',
    pickup: 'Houston, TX',
    delivery: 'Dallas, TX',
    date: '2024-01-20',
    cargo: 'Excavator CAT 320',
    dimensions: '32ft x 10ft x 11ft',
    weight: '52,000 lbs',
    permits: ['Oversize', 'Overweight'],
    escortRequired: true,
    status: 'open',
  },
  {
    id: 'REQ-002',
    shipper: 'Steel Works Inc',
    pickup: 'San Antonio, TX',
    delivery: 'Austin, TX',
    date: '2024-01-22',
    cargo: 'Steel Beams (Bundle)',
    dimensions: '60ft x 8ft x 4ft',
    weight: '45,000 lbs',
    permits: ['Oversize'],
    escortRequired: false,
    status: 'open',
  },
  {
    id: 'REQ-003',
    shipper: 'Energy Solutions',
    pickup: 'Midland, TX',
    delivery: 'Corpus Christi, TX',
    date: '2024-01-25',
    cargo: 'Wind Turbine Blade',
    dimensions: '180ft x 12ft x 10ft',
    weight: '28,000 lbs',
    permits: ['Superload', 'Oversize'],
    escortRequired: true,
    status: 'open',
  },
];

const mockDrivers = [
  { id: 'D1', name: 'John Smith', status: 'available' },
  { id: 'D2', name: 'Mike Johnson', status: 'available' },
  { id: 'D3', name: 'Robert Davis', status: 'on-job' },
];

const mockEquipment = [
  { id: 'E1', name: 'Peterbilt 389 + Lowboy Trailer', capacity: '100,000 lbs' },
  { id: 'E2', name: 'Kenworth W900 + RGN Trailer', capacity: '120,000 lbs' },
  { id: 'E3', name: 'Freightliner + Step Deck', capacity: '80,000 lbs' },
];

const AvailableBookings = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [submittedQuotes, setSubmittedQuotes] = useState<string[]>([]);

  const handleSubmitQuote = () => {
    if (!quotePrice) {
      toast.error('Please enter your quote price');
      return;
    }
    if (!selectedDriver) {
      toast.error('Please select a driver');
      return;
    }
    if (!selectedEquipment) {
      toast.error('Please select equipment');
      return;
    }
    
    setSubmittedQuotes([...submittedQuotes, selectedRequest?.id || '']);
    toast.success(`Quote submitted for ${selectedRequest?.id}. Admin will review and match.`);
    setQuoteDialogOpen(false);
    setSelectedRequest(null);
    setSelectedDriver('');
    setSelectedEquipment('');
    setQuotePrice('');
    setQuoteNotes('');
  };

  const hasSubmittedQuote = (requestId: string) => submittedQuotes.includes(requestId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Available Requests</h1>
        <p className="text-muted-foreground">View shipment requests in your area and submit quotes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{requests.length}</p>
                <p className="text-sm text-muted-foreground">Open Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submittedQuotes.length}</p>
                <p className="text-sm text-muted-foreground">Quotes Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDrivers.filter(d => d.status === 'available').length}</p>
                <p className="text-sm text-muted-foreground">Available Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{request.id}</Badge>
                    <span className="text-sm text-muted-foreground">from {request.shipper}</span>
                    {request.escortRequired && (
                      <Badge className="bg-accent text-accent-foreground">Escort Required</Badge>
                    )}
                    {hasSubmittedQuote(request.id) && (
                      <Badge className="bg-green-500/20 text-green-600">Quote Submitted</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-medium">{request.pickup} → {request.delivery}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Requested Date</p>
                        <p className="font-medium">{new Date(request.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cargo</p>
                        <p className="font-medium">{request.cargo}</p>
                        <p className="text-sm text-muted-foreground">{request.dimensions} • {request.weight}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {request.permits.map((permit) => (
                      <Badge key={permit} variant="secondary">{permit} Permit</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2">
                  <Button 
                    className="flex-1 lg:flex-none"
                    disabled={hasSubmittedQuote(request.id)}
                    onClick={() => {
                      setSelectedRequest(request);
                      setQuoteDialogOpen(true);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {hasSubmittedQuote(request.id) ? 'Quote Sent' : 'Submit Quote'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No open requests</p>
              <p className="text-muted-foreground">Check back later for new shipment requests in your area</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submit Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Quote for {selectedRequest?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm"><strong>Route:</strong> {selectedRequest?.pickup} → {selectedRequest?.delivery}</p>
              <p className="text-sm"><strong>Cargo:</strong> {selectedRequest?.cargo}</p>
              <p className="text-sm"><strong>Dimensions:</strong> {selectedRequest?.dimensions}</p>
              <p className="text-sm"><strong>Weight:</strong> {selectedRequest?.weight}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Your Quote Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number"
                  placeholder="Enter your price"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a driver" />
                </SelectTrigger>
                <SelectContent>
                  {mockDrivers.filter(d => d.status === 'available').map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Equipment</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose equipment" />
                </SelectTrigger>
                <SelectContent>
                  {mockEquipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} ({eq.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes (Optional)</Label>
              <Textarea 
                placeholder="Any special notes about your quote..."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Your quote will be sent to the HighnHeavy admin for review. If selected, you'll be matched with the shipper.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitQuote}>
              <Send className="h-4 w-4 mr-2" />
              Submit Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableBookings;
