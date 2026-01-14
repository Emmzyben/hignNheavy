import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Truck, 
  Car, 
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  Package,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Quote {
  id: string;
  bookingId: string;
  senderType: "carrier" | "escort";
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  senderPhone: string;
  price: number;
  notes: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  // Booking details
  origin: string;
  destination: string;
  loadType: string;
  shipperName: string;
  requestedDate: string;
  // Additional details
  vehicleOrEquipment: string;
  estimatedDuration: string;
  driverOrOperator?: string;
}

const mockQuotes: Quote[] = [
  {
    id: "QT-001",
    bookingId: "BK-2024-095",
    senderType: "carrier",
    senderName: "John Smith",
    senderCompany: "FastHaul Logistics",
    senderEmail: "john@fasthaul.com",
    senderPhone: "(555) 123-4567",
    price: 4500,
    notes: "We have extensive experience with oversized loads. Can provide additional flagging if needed.",
    submittedAt: "2024-01-15T10:30:00",
    status: "pending",
    origin: "Houston, TX",
    destination: "Dallas, TX",
    loadType: "Oversized Equipment",
    shipperName: "ABC Manufacturing",
    requestedDate: "2024-01-20",
    vehicleOrEquipment: "Lowboy Trailer - 53ft",
    estimatedDuration: "8 hours",
    driverOrOperator: "Mike Johnson"
  },
  {
    id: "QT-002",
    bookingId: "BK-2024-095",
    senderType: "escort",
    senderName: "Sarah Davis",
    senderCompany: "SafeRoute Escorts",
    senderEmail: "sarah@saferoute.com",
    senderPhone: "(555) 234-5678",
    price: 800,
    notes: "Available with 2 pilot cars for front and rear coverage.",
    submittedAt: "2024-01-15T11:00:00",
    status: "pending",
    origin: "Houston, TX",
    destination: "Dallas, TX",
    loadType: "Oversized Equipment",
    shipperName: "ABC Manufacturing",
    requestedDate: "2024-01-20",
    vehicleOrEquipment: "Ford F-150 Pilot Car",
    estimatedDuration: "8 hours"
  },
  {
    id: "QT-003",
    bookingId: "BK-2024-098",
    senderType: "carrier",
    senderName: "Robert Chen",
    senderCompany: "MegaHaul Inc",
    senderEmail: "robert@megahaul.com",
    senderPhone: "(555) 345-6789",
    price: 6200,
    notes: "Specialized in crane transport. Full insurance coverage.",
    submittedAt: "2024-01-14T14:20:00",
    status: "pending",
    origin: "Phoenix, AZ",
    destination: "Los Angeles, CA",
    loadType: "Construction Crane",
    shipperName: "BuildRight Corp",
    requestedDate: "2024-01-22",
    vehicleOrEquipment: "Heavy Duty Flatbed",
    estimatedDuration: "12 hours",
    driverOrOperator: "Tom Wilson"
  },
  {
    id: "QT-004",
    bookingId: "BK-2024-098",
    senderType: "escort",
    senderName: "Emily Brown",
    senderCompany: "Highway Guards LLC",
    senderEmail: "emily@highwayguards.com",
    senderPhone: "(555) 456-7890",
    price: 1200,
    notes: "Experienced with interstate permits and crane escorts.",
    submittedAt: "2024-01-14T15:45:00",
    status: "pending",
    origin: "Phoenix, AZ",
    destination: "Los Angeles, CA",
    loadType: "Construction Crane",
    shipperName: "BuildRight Corp",
    requestedDate: "2024-01-22",
    vehicleOrEquipment: "Chevrolet Silverado Pilot Car",
    estimatedDuration: "12 hours"
  },
  {
    id: "QT-005",
    bookingId: "BK-2024-092",
    senderType: "carrier",
    senderName: "Michael Torres",
    senderCompany: "Elite Heavy Transport",
    senderEmail: "michael@eliteheavy.com",
    senderPhone: "(555) 567-8901",
    price: 3800,
    notes: "Quick turnaround available.",
    submittedAt: "2024-01-13T09:15:00",
    status: "approved",
    origin: "San Antonio, TX",
    destination: "Austin, TX",
    loadType: "Industrial Machinery",
    shipperName: "TechParts Inc",
    requestedDate: "2024-01-18",
    vehicleOrEquipment: "Step Deck Trailer",
    estimatedDuration: "4 hours",
    driverOrOperator: "Carlos Martinez"
  },
  {
    id: "QT-006",
    bookingId: "BK-2024-100",
    senderType: "escort",
    senderName: "Jennifer Lee",
    senderCompany: "ProPilot Services",
    senderEmail: "jennifer@propilot.com",
    senderPhone: "(555) 678-9012",
    price: 650,
    notes: "Short notice availability. Fully certified.",
    submittedAt: "2024-01-15T16:30:00",
    status: "pending",
    origin: "Denver, CO",
    destination: "Colorado Springs, CO",
    loadType: "Wind Turbine Blade",
    shipperName: "GreenEnergy Solutions",
    requestedDate: "2024-01-21",
    vehicleOrEquipment: "RAM 2500 Pilot Car",
    estimatedDuration: "3 hours"
  },
];

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [senderFilter, setSenderFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.senderCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.shipperName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSender = senderFilter === "all" || quote.senderType === senderFilter;
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    const matchesDate = !dateFilter || quote.submittedAt.startsWith(dateFilter);

    return matchesSearch && matchesSender && matchesStatus && matchesDate;
  });

  const pendingQuotes = filteredQuotes.filter(q => q.status === "pending");
  const approvedQuotes = filteredQuotes.filter(q => q.status === "approved");
  const rejectedQuotes = filteredQuotes.filter(q => q.status === "rejected");

  const handleApproveQuote = (quote: Quote) => {
    setQuotes(prev => prev.map(q => 
      q.id === quote.id ? { ...q, status: "approved" as const } : q
    ));
    setDetailsOpen(false);
    toast({
      title: "Quote Approved",
      description: `${quote.senderCompany} has been linked to ${quote.shipperName} for booking ${quote.bookingId}`,
    });
  };

  const handleRejectQuote = (quote: Quote) => {
    setQuotes(prev => prev.map(q => 
      q.id === quote.id ? { ...q, status: "rejected" as const } : q
    ));
    setDetailsOpen(false);
    toast({
      title: "Quote Rejected",
      description: `Quote from ${quote.senderCompany} has been rejected`,
      variant: "destructive",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const QuoteCard = ({ quote }: { quote: Quote }) => (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={() => {
        setSelectedQuote(quote);
        setDetailsOpen(true);
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {quote.senderType === "carrier" ? (
              <Truck className="h-5 w-5 text-primary" />
            ) : (
              <Car className="h-5 w-5 text-primary" />
            )}
            <div>
              <p className="font-semibold">{quote.senderCompany}</p>
              <p className="text-sm text-muted-foreground">{quote.senderName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{formatCurrency(quote.price)}</p>
            <Badge variant={quote.senderType === "carrier" ? "default" : "secondary"}>
              {quote.senderType}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>Booking: {quote.bookingId}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{quote.origin} → {quote.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Submitted: {formatDate(quote.submittedAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <span className="text-sm text-muted-foreground">For: {quote.shipperName}</span>
          <Badge variant={
            quote.status === "approved" ? "default" :
            quote.status === "rejected" ? "destructive" : "outline"
          }>
            {quote.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Quotes</h1>
        <p className="text-muted-foreground">Review and approve quotes from carriers and escorts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Quotes</p>
            <p className="text-2xl font-bold">{quotes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-primary">{quotes.filter(q => q.status === "pending").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Carrier Quotes</p>
            <p className="text-2xl font-bold">{quotes.filter(q => q.senderType === "carrier").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Escort Quotes</p>
            <p className="text-2xl font-bold">{quotes.filter(q => q.senderType === "escort").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company, booking ID, or shipper..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={senderFilter} onValueChange={setSenderFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sender Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Senders</SelectItem>
                <SelectItem value="carrier">Carriers</SelectItem>
                <SelectItem value="escort">Escorts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quotes Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending quotes to review
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingQuotes.map(quote => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No approved quotes
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedQuotes.map(quote => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No rejected quotes
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedQuotes.map(quote => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quote Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQuote?.senderType === "carrier" ? (
                <Truck className="h-5 w-5" />
              ) : (
                <Car className="h-5 w-5" />
              )}
              Quote Details - {selectedQuote?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              {/* Sender Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedQuote.senderType === "carrier" ? "Carrier" : "Escort"} Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{selectedQuote.senderCompany}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{selectedQuote.senderName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedQuote.senderEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedQuote.senderPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Quote Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Quoted Price</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(selectedQuote.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted At</p>
                      <p className="font-medium">{formatDate(selectedQuote.submittedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {selectedQuote.senderType === "carrier" ? "Equipment" : "Vehicle"}
                      </p>
                      <p className="font-medium">{selectedQuote.vehicleOrEquipment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Duration</p>
                      <p className="font-medium">{selectedQuote.estimatedDuration}</p>
                    </div>
                    {selectedQuote.driverOrOperator && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Assigned Driver/Operator</p>
                        <p className="font-medium">{selectedQuote.driverOrOperator}</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="bg-muted p-3 rounded-md mt-1">{selectedQuote.notes}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Booking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-medium">{selectedQuote.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shipper</p>
                      <p className="font-medium">{selectedQuote.shipperName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Origin</p>
                      <p className="font-medium">{selectedQuote.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{selectedQuote.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Load Type</p>
                      <p className="font-medium">{selectedQuote.loadType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requested Date</p>
                      <p className="font-medium">{selectedQuote.requestedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Status:</span>
                  <Badge variant={
                    selectedQuote.status === "approved" ? "default" :
                    selectedQuote.status === "rejected" ? "destructive" : "outline"
                  }>
                    {selectedQuote.status}
                  </Badge>
                </div>
                
                {selectedQuote.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleRejectQuote(selectedQuote)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => handleApproveQuote(selectedQuote)}>
                      <Check className="h-4 w-4 mr-2" />
                      Approve & Link to Shipper
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageQuotes;
