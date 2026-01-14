import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const mockTransactions = [
  {
    id: "TXN-001",
    type: "credit",
    description: "Payment for BK-2024-001",
    amount: 850,
    date: "2024-01-17",
    status: "completed",
  },
  {
    id: "TXN-002",
    type: "debit",
    description: "Withdrawal to Bank ****4521",
    amount: 500,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "TXN-003",
    type: "credit",
    description: "Payment for BK-2023-045",
    amount: 720,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "TXN-004",
    type: "credit",
    description: "Payment for BK-2023-044",
    amount: 1250,
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "TXN-005",
    type: "debit",
    description: "Withdrawal to Bank ****4521",
    amount: 1000,
    date: "2024-01-05",
    status: "completed",
  },
];

const mockBankAccounts = [
  { id: "1", name: "Chase Checking", last4: "4521", type: "checking" },
  { id: "2", name: "Wells Fargo Savings", last4: "7832", type: "savings" },
];

const EscortWallet = () => {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const walletBalance = 2320; // Mock balance

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }
    if (!selectedAccount) {
      toast.error("Please select a bank account");
      return;
    }

    toast.success(`Withdrawal of $${amount} initiated. Funds will arrive in 1-3 business days.`);
    setWithdrawDialogOpen(false);
    setWithdrawAmount("");
    setSelectedAccount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">Available Balance</p>
              <p className="text-4xl font-bold mt-1">${walletBalance.toLocaleString()}</p>
              <p className="text-primary-foreground/60 text-sm mt-2">
                Updated just now
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => setWithdrawDialogOpen(true)}
                className="gap-2"
              >
                <ArrowUpRight className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <ArrowDownLeft className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                <p className="text-2xl font-bold">$10,130</p>
              </div>
              <ArrowUpRight className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">$1,275</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Linked Bank Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">****{account.last4}</p>
                  </div>
                </div>
                <Badge variant="outline">{account.type}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              + Add Bank Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      txn.type === "credit" ? "bg-green-100" : "bg-primary/10"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      txn.type === "credit" ? "text-green-600" : "text-foreground"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}${txn.amount.toLocaleString()}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">${walletBalance.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Label>Amount to Withdraw ($)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Destination Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {mockBankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} (****{account.last4})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Funds typically arrive within 1-3 business days.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>Withdraw Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscortWallet;
