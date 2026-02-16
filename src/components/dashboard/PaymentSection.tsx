import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Download,
  Package,
  MapPin,
  Banknote,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PaymentSection = () => {
  const [awaitingPayments, setAwaitingPayments] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAwaitingPayments();
    fetchPaymentHistory();
  }, []);

  const fetchAwaitingPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/payments/awaiting");
      if (response.data.success) {
        setAwaitingPayments(response.data.data);
      }
    } catch (error: any) {
      console.error("Fetch awaiting payments error:", error);
      toast.error(error.response?.data?.message || "Failed to load awaiting payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get("/payments/history");
      if (response.data.success) {
        setPaymentHistory(response.data.data);
      }
    } catch (error: any) {
      console.error("Fetch payment history error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openPaymentDialog = (booking: any) => {
    setSelectedBooking(booking);
    setPaymentDialogOpen(true);
  };

  const processPayment = async () => {
    if (!selectedBooking) return;

    setProcessing(true);
    try {
      const response = await api.post("/payments/process", {
        bookingId: selectedBooking.id,
        paymentMethod,
        paymentDetails: {
          // Placeholder data - will be replaced with real payment gateway integration
          note: `Payment for booking ${selectedBooking.id}`
        }
      });

      if (response.data.success) {
        toast.success("Payment processed successfully!", {
          description: `Your booking is now confirmed.`,
        });
        setPaymentDialogOpen(false);
        fetchAwaitingPayments();
        fetchPaymentHistory();
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotals = () => {
    const totalOutstanding = awaitingPayments.reduce((acc, booking) => {
      const amount = parseFloat(booking.agreed_price || 0);
      const fee = amount * 0.15;
      return acc + amount + fee;
    }, 0);

    const totalPaid = paymentHistory.reduce((acc, payment) => acc + parseFloat(payment.total_amount || 0), 0);

    return { totalOutstanding, totalPaid };
  };

  const { totalOutstanding, totalPaid } = calculateTotals();

  if (loading && loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Syncing Payments..." />
      </div>
    );
  }

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
              <p className="text-2xl font-bold">{awaitingPayments.length}</p>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Paid (All Time)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Payments */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-bold mb-4">Outstanding Payments</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="md" text="Loading Payments..." />
          </div>
        ) : awaitingPayments.length > 0 ? (
          <div className="space-y-4">
            {awaitingPayments.map((booking) => {
              const bookingAmount = parseFloat(booking.agreed_price || 0);
              const platformFee = bookingAmount * 0.15;
              const totalAmount = bookingAmount + platformFee;

              return (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={18} className="text-primary" />
                        <span className="font-mono font-semibold text-sm">
                          {booking.id.substring(0, 8)}...
                        </span>
                        <Badge className="bg-yellow-500/20 text-yellow-600 border-0">
                          Awaiting Payment
                        </Badge>
                      </div>
                      <p className="font-medium text-lg">{booking.cargo_type}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin size={14} />
                        <span>{booking.pickup_city}, {booking.pickup_state}</span>
                        <span>→</span>
                        <span>{booking.delivery_city}, {booking.delivery_state}</span>
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Booking Amount:</span>
                          <span className="font-semibold">${bookingAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform Fee (15%):</span>
                          <span className="font-semibold">${platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-bold">Total Amount:</span>
                          <span className="font-bold text-lg text-primary">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button onClick={() => openPaymentDialog(booking)} size="lg">
                        <Banknote size={18} className="mr-2" />
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="md" text="Loading History..." />
          </div>
        ) : paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm">{payment.transaction_ref || payment.id.substring(0, 12)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{payment.cargo_type || "Booking Payment"}</p>
                      {payment.pickup_city && (
                        <p className="text-sm text-muted-foreground">
                          {payment.pickup_city} → {payment.delivery_city}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{payment.method}</td>
                    <td className="px-4 py-3 font-semibold">${parseFloat(payment.total_amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge className={
                        payment.status === 'completed'
                          ? 'bg-green-500/20 text-green-600 border-0'
                          : payment.status === 'failed'
                            ? 'bg-red-500/20 text-red-600 border-0'
                            : 'bg-yellow-500/20 text-yellow-600 border-0'
                      }>
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No payment history yet</p>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              {selectedBooking?.cargo_type} - {selectedBooking?.pickup_city} to {selectedBooking?.delivery_city}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking Amount:</span>
                  <span className="font-semibold">${parseFloat(selectedBooking.agreed_price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (15%):</span>
                  <span className="font-semibold">${(parseFloat(selectedBooking.agreed_price) * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(parseFloat(selectedBooking.agreed_price) * 1.15).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard size={20} />
                      <div>
                        <p className="font-semibold">Stripe</p>
                        <p className="text-xs text-muted-foreground">Credit / Debit Card via Stripe</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                      <DollarSign size={20} />
                      <div>
                        <p className="font-semibold">PayPal</p>
                        <p className="text-xs text-muted-foreground">Pay with your PayPal account</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">🔒 Secure Payment</p>
                <p className="text-xs">
                  Your payment information is encrypted and secure. This is a placeholder for {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'} integration.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={processPayment}
                disabled={processing}
              >
                {processing ? (
                  <Loader size="sm" text="Processing Payment..." />
                ) : (
                  `Pay $${(parseFloat(selectedBooking.agreed_price) * 1.15).toFixed(2)}`
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSection;
