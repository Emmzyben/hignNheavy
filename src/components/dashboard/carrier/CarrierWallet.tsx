import { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Building, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const transactions = [
  {
    id: 'TXN-001',
    type: 'credit',
    description: 'Payment - BK-090',
    amount: 12500,
    date: '2024-01-15',
    status: 'completed',
  },
  {
    id: 'TXN-002',
    type: 'debit',
    description: 'Withdrawal to Bank',
    amount: 10000,
    date: '2024-01-14',
    status: 'completed',
  },
  {
    id: 'TXN-003',
    type: 'credit',
    description: 'Payment - BK-085',
    amount: 8200,
    date: '2024-01-12',
    status: 'completed',
  },
  {
    id: 'TXN-004',
    type: 'credit',
    description: 'Payment - BK-080',
    amount: 3500,
    date: '2024-01-09',
    status: 'completed',
  },
  {
    id: 'TXN-005',
    type: 'debit',
    description: 'Withdrawal to Bank',
    amount: 5000,
    date: '2024-01-08',
    status: 'completed',
  },
];

const bankAccounts = [
  { id: 'BA1', name: 'Chase Business Checking', last4: '4521' },
  { id: 'BA2', name: 'Wells Fargo Savings', last4: '8892' },
];

const CarrierWallet = () => {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const walletBalance = 14200;

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > walletBalance) {
      toast.error('Insufficient balance');
      return;
    }
    if (!selectedAccount) {
      toast.error('Please select a bank account');
      return;
    }
    toast.success(`Withdrawal of $${amount.toLocaleString()} initiated. Funds will arrive in 1-3 business days.`);
    setWithdrawDialogOpen(false);
    setWithdrawAmount('');
    setSelectedAccount('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <span className="text-lg text-muted-foreground">Available Balance</span>
              </div>
              <p className="text-5xl font-bold">${walletBalance.toLocaleString()}</p>
            </div>
            <Button size="lg" onClick={() => setWithdrawDialogOpen(true)}>
              <ArrowUpRight className="h-5 w-5 mr-2" />
              Withdraw Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <ArrowDownLeft className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">$24,200</p>
                <p className="text-sm text-muted-foreground">Total Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">$15,000</p>
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bankAccounts.length}</p>
                <p className="text-sm text-muted-foreground">Linked Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((txn) => (
              <div 
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    txn.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft className={`h-5 w-5 text-green-500`} />
                    ) : (
                      <ArrowUpRight className={`h-5 w-5 text-red-500`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString()} • {txn.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    txn.type === 'credit' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Linked Bank Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Linked Bank Accounts</CardTitle>
          <Button variant="outline" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div 
                key={account.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">****{account.last4}</p>
                  </div>
                </div>
                <Badge variant="outline">Verified</Badge>
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
          <div className="space-y-4">
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
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} (****{account.last4})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Withdrawals typically process within 1-3 business days.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarrierWallet;
