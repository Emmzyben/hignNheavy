import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, Filter } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Payout {
  id: string;
  provider: string;
  providerType: "carrier" | "escort";
  amount: number;
  bookingId: string;
  status: "pending" | "approved" | "rejected" | "paid";
  requestedAt: string;
  processedAt?: string;
  bankAccount: string;
  notes?: string;
}

const mockPayouts: Payout[] = [
  { id: "PAY-001", provider: "FastHaul Logistics", providerType: "carrier", amount: 8500, bookingId: "BK-2024-002", status: "pending", requestedAt: "2024-12-14", bankAccount: "****4521" },
  { id: "PAY-002", provider: "SafeRoute Escorts", providerType: "escort", amount: 1200, bookingId: "BK-2024-002", status: "pending", requestedAt: "2024-12-14", bankAccount: "****7832" },
  { id: "PAY-003", provider: "Heavy Movers Inc", providerType: "carrier", amount: 15200, bookingId: "BK-2024-003", status: "pending", requestedAt: "2024-12-13", bankAccount: "****2145" },
  { id: "PAY-004", provider: "Highway Guard LLC", providerType: "escort", amount: 2100, bookingId: "BK-2024-003", status: "approved", requestedAt: "2024-12-12", processedAt: "2024-12-13", bankAccount: "****9087" },
  { id: "PAY-005", provider: "BigRig Transport", providerType: "carrier", amount: 12800, bookingId: "BK-2024-005", status: "paid", requestedAt: "2024-12-05", processedAt: "2024-12-07", bankAccount: "****3456" },
  { id: "PAY-006", provider: "LoadWatch Services", providerType: "escort", amount: 1800, bookingId: "BK-2024-005", status: "paid", requestedAt: "2024-12-05", processedAt: "2024-12-07", bankAccount: "****6789" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "pending": { label: "Pending", variant: "outline" },
  "approved": { label: "Approved", variant: "secondary" },
  "rejected": { label: "Rejected", variant: "destructive" },
  "paid": { label: "Paid", variant: "default" },
};

const ManagePayouts = () => {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredPayouts = payouts.filter(p => {
    const matchesSearch = p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.providerType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingTotal = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const approvedTotal = payouts.filter(p => p.status === "approved").reduce((sum, p) => sum + p.amount, 0);
  const paidTotal = payouts.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

  const handleView = (payout: Payout) => {
    setSelectedPayout(payout);
    setRejectReason("");
    setDialogOpen(true);
  };

  const handleApprove = (payoutId: string) => {
    setPayouts(payouts.map(p => 
      p.id === payoutId 
        ? { ...p, status: "approved" as const, processedAt: new Date().toISOString().split('T')[0] }
        : p
    ));
    setDialogOpen(false);
  };

  const handleReject = (payoutId: string) => {
    setPayouts(payouts.map(p => 
      p.id === payoutId 
        ? { ...p, status: "rejected" as const, processedAt: new Date().toISOString().split('T')[0], notes: rejectReason }
        : p
    ));
    setDialogOpen(false);
  };

  const handleMarkPaid = (payoutId: string) => {
    setPayouts(payouts.map(p => 
      p.id === payoutId 
        ? { ...p, status: "paid" as const, processedAt: new Date().toISOString().split('T')[0] }
        : p
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Payouts</h1>
        <p className="text-muted-foreground">Review and approve payout requests from carriers and escorts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Pending</p>
          <p className="text-2xl font-bold text-yellow-600">${pendingTotal.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{payouts.filter(p => p.status === "pending").length} requests</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Approved (Awaiting Payment)</p>
          <p className="text-2xl font-bold text-blue-600">${approvedTotal.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{payouts.filter(p => p.status === "approved").length} requests</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Paid This Month</p>
          <p className="text-2xl font-bold text-green-600">${paidTotal.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{payouts.filter(p => p.status === "paid").length} payouts</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-bold">{payouts.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="carrier">Carriers</SelectItem>
            <SelectItem value="escort">Escorts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout ID</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank Account</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                <TableCell className="font-medium">{payout.provider}</TableCell>
                <TableCell>
                  <Badge variant={payout.providerType === "carrier" ? "default" : "secondary"}>
                    {payout.providerType}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{payout.bookingId}</TableCell>
                <TableCell className="font-bold">${payout.amount.toLocaleString()}</TableCell>
                <TableCell>{payout.bankAccount}</TableCell>
                <TableCell>{payout.requestedAt}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[payout.status]?.variant}>
                    {statusConfig[payout.status]?.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleView(payout)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payout.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApprove(payout.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleView(payout)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {payout.status === "approved" && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkPaid(payout.id)}>
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payout Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payout Details - {selectedPayout?.id}</DialogTitle>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium">{selectedPayout.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant={selectedPayout.providerType === "carrier" ? "default" : "secondary"}>
                    {selectedPayout.providerType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono">{selectedPayout.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-xl font-bold text-green-600">${selectedPayout.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bank Account</p>
                  <p className="font-medium">{selectedPayout.bankAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requested</p>
                  <p className="font-medium">{selectedPayout.requestedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusConfig[selectedPayout.status]?.variant}>
                    {statusConfig[selectedPayout.status]?.label}
                  </Badge>
                </div>
                {selectedPayout.processedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Processed</p>
                    <p className="font-medium">{selectedPayout.processedAt}</p>
                  </div>
                )}
              </div>

              {selectedPayout.status === "pending" && (
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rejection Reason (if rejecting)</label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={() => handleReject(selectedPayout.id)} disabled={!rejectReason}>
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button onClick={() => handleApprove(selectedPayout.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve to Wallet
                    </Button>
                  </div>
                </div>
              )}

              {selectedPayout.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedPayout.notes}</p>
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
