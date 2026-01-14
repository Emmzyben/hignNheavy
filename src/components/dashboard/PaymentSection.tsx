import { useState } from "react";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Download,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const outstandingPayments = [
  {
    id: "INV-001",
    bookingId: "BK-005",
    description: "Mining Equipment Transport - Midland to Houston",
    amount: 5100,
    dueDate: "2024-01-30",
    status: "pending",
  },
  {
    id: "INV-002",
    bookingId: "BK-003",
    description: "Wind Turbine Blade Transport - Corpus Christi to Amarillo (Deposit)",
    amount: 2550,
    dueDate: "2024-01-22",
    status: "overdue",
  },
];

const paymentHistory = [
  {
    id: "PAY-001",
    bookingId: "BK-001",
    description: "Construction Equipment Transport",
    amount: 4500,
    date: "2024-01-14",
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "PAY-002",
    bookingId: "BK-002",
    description: "Industrial Machinery Transport",
    amount: 2800,
    date: "2024-01-09",
    method: "Bank Transfer",
    status: "completed",
  },
  {
    id: "PAY-003",
    bookingId: "BK-004",
    description: "Pre-Fab Building Transport",
    amount: 6200,
    date: "2024-01-07",
    method: "Zelle",
    status: "completed",
  },
];

const PaymentSection = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof outstandingPayments[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const openPaymentDialog = (invoice: typeof outstandingPayments[0]) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const processPayment = () => {
    toast.success("Payment processed successfully!", {
      description: `Invoice ${selectedInvoice?.id} has been paid.`,
    });
    setPaymentDialogOpen(false);
  };

  const totalOutstanding = outstandingPayments.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{outstandingPayments.length}</p>
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">$13,500</p>
              <p className="text-sm text-muted-foreground">Total Paid (YTD)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-bold mb-4">Outstanding Payments</h2>
        
        {outstandingPayments.length > 0 ? (
          <div className="space-y-4">
            {outstandingPayments.map((invoice) => (
              <div
                key={invoice.id}
                className={`border rounded-lg p-4 ${
                  invoice.status === "overdue" 
                    ? "border-red-500/50 bg-red-500/5" 
                    : "border-border"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold">{invoice.id}</span>
                      <Badge 
                        className={
                          invoice.status === "overdue" 
                            ? "bg-red-500/20 text-red-600 border-0" 
                            : "bg-yellow-500/20 text-yellow-600 border-0"
                        }
                      >
                        {invoice.status === "overdue" ? "Overdue" : "Pending"}
                      </Badge>
                    </div>
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Booking: {invoice.bookingId} • Due: {invoice.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${invoice.amount.toLocaleString()}</p>
                    </div>
                    <Button onClick={() => openPaymentDialog(invoice)}>
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-green-600" />
            <p>All payments are up to date!</p>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-bold mb-4">Payment History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Invoice</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm">{payment.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">Booking: {payment.bookingId}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{payment.date}</td>
                  <td className="px-4 py-3 text-sm">{payment.method}</td>
                  <td className="px-4 py-3 font-semibold">${payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">
                      <Download size={16} className="mr-1" />
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Invoice {selectedInvoice?.id}</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Amount Due</p>
              <p className="text-3xl font-bold">${selectedInvoice?.amount.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard size={20} />
                    Credit / Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 size={20} />
                    Bank Transfer
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="zelle" id="zelle" />
                  <Label htmlFor="zelle" className="flex items-center gap-2 cursor-pointer flex-1">
                    <DollarSign size={20} />
                    Zelle / Cash App
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label>Card Number</Label>
                  <Input placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">Bank Transfer Details:</p>
                <p>Bank: First National Bank</p>
                <p>Account: HighnHeavy LLC</p>
                <p>Routing: 123456789</p>
                <p>Account #: 987654321</p>
                <p className="mt-2 text-muted-foreground">Include invoice number in memo</p>
              </div>
            )}

            {paymentMethod === "zelle" && (
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">Send payment to:</p>
                <p>Zelle: payments@highnheavy.com</p>
                <p>Cash App: $HighnHeavy</p>
                <p className="mt-2 text-muted-foreground">Include invoice number in note</p>
              </div>
            )}

            <Button className="w-full" onClick={processPayment}>
              {paymentMethod === "card" ? "Pay Now" : "Confirm Payment Sent"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSection;
