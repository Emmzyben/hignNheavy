import { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      // We need a route to fetch ALL quotes for admin
      const response = await api.get("/quotes/all-admin");
      if (response.data.success) {
        setQuotes(response.data.data);
      }
    } catch (error) {
      console.error("Fetch quotes error:", error);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveQuote = async (quote: any) => {
    setIsProcessing(true);
    try {
      const response = await api.put(`/quotes/${quote.id}/accept`);
      if (response.data.success) {
        toast.success("Quote approved and booking updated!");
        setDetailsOpen(false);
        fetchQuotes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve quote");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      (quote.carrier_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.shipper_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingQuotes = filteredQuotes.filter(q => q.status === "pending");
  const acceptedQuotes = filteredQuotes.filter(q => q.status === "accepted");
  const rejectedQuotes = filteredQuotes.filter(q => q.status === "rejected");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const QuoteCard = ({ quote }: { quote: any }) => (
    <Card
      className="cursor-pointer hover:border-primary transition-colors border shadow-sm"
      onClick={() => {
        setSelectedQuote(quote);
        setDetailsOpen(true);
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base">{quote.carrier_name}</p>
              <p className="text-xs text-muted-foreground">Carrier Bid</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{formatCurrency(quote.amount)}</p>
          </div>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4 shrink-0" />
            <span className="truncate">Booking: <span className="font-mono">{quote.booking_id.split('-')[0]}...</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium text-foreground">{quote.pickup_city} → {quote.delivery_city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Submitted: {formatDate(quote.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t">
          <span className="text-xs text-muted-foreground font-medium">For: {quote.shipper_name}</span>
          <Badge variant={
            quote.status === "accepted" ? "default" :
              quote.status === "rejected" ? "destructive" : "outline"
          } className="capitalize">
            {quote.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Quote Management</h1>
        <p className="text-muted-foreground">Match carrier bids with shipper booking requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-b-4 border-b-primary">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Pending Review</p>
            <p className="text-3xl font-bold text-primary mt-1">{quotes.filter(q => q.status === "pending").length}</p>
          </CardContent>
        </Card>
        <Card className="border-b-4 border-b-green-500">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Matches Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{quotes.filter(q => q.status === "accepted").length}</p>
          </CardContent>
        </Card>
        <Card className="border-b-4 border-b-gray-400">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Total Bids</p>
            <p className="text-3xl font-bold mt-1">{quotes.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search company, booking ID, or shipper..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-11">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="accepted">Accepted Matches</SelectItem>
                <SelectItem value="rejected">Rejected Bids</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-11" onClick={fetchQuotes}>
              Sync Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Tabs */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border rounded-xl">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="font-medium">Fetching marketplace bids...</p>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pending" className="px-6">Pending ({pendingQuotes.length})</TabsTrigger>
            <TabsTrigger value="approved" className="px-6">Accepted ({acceptedQuotes.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="px-6">Rejected ({rejectedQuotes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingQuotes.length === 0 ? (
              <Card className="bg-muted/10 border-dashed">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p>No new quotes require review at this time.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceptedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Detail View */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              Review Bid Match
            </DialogTitle>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase">Carrier Bid</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(selectedQuote.amount)}</p>
                  <p className="text-sm font-medium mt-2">{selectedQuote.carrier_name}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Requested Load</p>
                  <p className="text-lg font-bold mt-1 truncate">{selectedQuote.cargo_type}</p>
                  <p className="text-sm text-muted-foreground mt-2">ID: {selectedQuote.booking_id.split('-')[0]}...</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                  <MapPin size={14} /> Logistics Information
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="font-medium text-sm">{selectedQuote.pickup_city}, {selectedQuote.pickup_state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium text-sm">{selectedQuote.delivery_city}, {selectedQuote.delivery_state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Shipment Date</p>
                    <p className="font-medium text-sm">{formatDate(selectedQuote.shipment_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Shipper</p>
                    <p className="font-medium text-sm underline">{selectedQuote.shipper_name}</p>
                  </div>
                </div>
              </div>

              {selectedQuote.notes && (
                <div className="p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg">
                  <p className="text-xs font-bold text-yellow-800 uppercase mb-2">Carrier Notes</p>
                  <p className="text-sm italic">"{selectedQuote.notes}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t">
                <Badge variant={selectedQuote.status === "accepted" ? "default" : "outline"} className="px-3 py-1">
                  Status: {selectedQuote.status}
                </Badge>

                {selectedQuote.status === "pending" && (
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setDetailsOpen(false)} disabled={isProcessing}>Close</Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 font-bold"
                      onClick={() => handleApproveQuote(selectedQuote)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Check className="mr-2" size={16} />}
                      Approve Match
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
