import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Filter, Banknote, Clock, Building } from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "warning" }> = {
  "pending": { label: "Pending Review", variant: "outline" },
  "approved": { label: "Approved", variant: "secondary" },
  "rejected": { label: "Rejected", variant: "destructive" },
  "processing": { label: "Processing", variant: "warning" },
  "completed": { label: "Completed", variant: "default" },
  "failed": { label: "Failed", variant: "destructive" },
};

const ManagePayouts = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [totals, setTotals] = useState({ balance: 0, pending: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wResponse, walletResponse] = await Promise.all([
        api.get('/wallets/admin/withdrawals'),
        api.get('/wallets/admin/all')
      ]);

      if (wResponse.data.success) setWithdrawals(wResponse.data.data);
      if (walletResponse.data.success) {
        setWallets(walletResponse.data.data.wallets);
        setTotals(walletResponse.data.data.totals);
      }
    } catch (error) {
      console.error('Fetch admin wallet data error:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post(`/wallets/admin/withdrawals/${id}/${action}`, {
        reason: rejectReason
      });

      if (response.data.success) {
        toast.success(`Withdrawal ${action}d successfully`);
        setDialogOpen(false);
        setRejectReason("");
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} withdrawal`);
    } finally {
      setProcessing(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader size="lg" text="Processing Financials..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Financial Settlement Center</h1>
        <p className="text-muted-foreground">Manage withdrawals and track system-wide platform earnings</p>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Banknote size={16} /> Total System Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totals.balance.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Available across all user wallets</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Clock size={16} /> Pending in Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totals.pending.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Locked funds for active bookings</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <CheckCircle size={16} /> Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{withdrawals.filter(w => w.status === 'pending').length}</p>
            <p className="text-xs text-muted-foreground mt-1">Withdrawal requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Withdrawal Requests</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="text-xs">
                      {new Date(w.requested_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{w.full_name}</div>
                      <div className="text-xs text-muted-foreground">{w.email}</div>
                    </TableCell>
                    <TableCell className="font-bold">${parseFloat(w.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-xs">{w.bank_name}</div>
                      <div className="text-xs text-muted-foreground">****{w.account_number.slice(-4)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[w.status]?.variant || "outline"}>
                        {statusConfig[w.status]?.label || w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedRequest(w); setDialogOpen(true); }}>
                        <Eye className="h-4 w-4 mr-2" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No withdrawal requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Withdrawal Review</DialogTitle>
            <DialogDescription>Review bank details and process the request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold">User</p>
                  <p className="font-medium">{selectedRequest.full_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.email}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Amount</p>
                  <p className="text-2xl font-bold text-primary">${parseFloat(selectedRequest.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase font-bold mb-3 flex items-center gap-2">
                  <Building size={14} /> Bank Details
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{selectedRequest.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Holder Name</p>
                    <p className="font-medium">{selectedRequest.account_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-mono font-medium">{selectedRequest.account_number}</p>
                  </div>
                  {selectedRequest.routing_number && (
                    <div>
                      <p className="text-xs text-muted-foreground">Routing Number</p>
                      <p className="font-mono font-medium">{selectedRequest.routing_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.status === 'pending' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rejection Reason (only if rejecting)</Label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleAction(selectedRequest.id, 'reject')}
                      disabled={processing || !rejectReason}
                    >
                      Reject Request
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleAction(selectedRequest.id, 'approve')}
                      disabled={processing}
                    >
                      {processing ? <Loader size="sm" text="" /> : 'Approve & Release'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-secondary/20 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Request Status</p>
                    <p className="font-bold capitalize">{selectedRequest.status}</p>
                  </div>
                  {selectedRequest.processed_at && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Processed On</p>
                      <p className="text-sm font-medium">{new Date(selectedRequest.processed_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePayouts;
