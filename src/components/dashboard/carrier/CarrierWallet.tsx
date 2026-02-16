import { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Building, CreditCard, Loader2, Plus, Clock, Hash, Calendar, Info, FileText, Package, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

const WalletComponent = () => {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [addBankDialogOpen, setAddBankDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [txnDetailsOpen, setTxnDetailsOpen] = useState(false);

  // Bank account form state
  const [bankForm, setBankForm] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
    swift_code: '',
    account_type: 'checking'
  });

  useEffect(() => {
    fetchWalletData();
    fetchBankAccounts();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/wallets/me');
      if (response.data.success) {
        setWalletData(response.data.data);
      }
    } catch (error) {
      console.error('Fetch wallet error:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await api.get('/wallets/bank-accounts');
      if (response.data.success) {
        setBankAccounts(response.data.data);
        if (response.data.data.length > 0) {
          const primary = response.data.data.find((a: any) => a.is_primary);
          if (primary) setSelectedAccount(primary.id);
          else setSelectedAccount(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Fetch bank accounts error:', error);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > parseFloat(walletData?.balance || '0')) {
      toast.error('Insufficient balance');
      return;
    }
    if (!selectedAccount) {
      toast.error('Please select a bank account');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/wallets/withdraw', {
        amount,
        bank_account_id: selectedAccount
      });
      if (response.data.success) {
        toast.success('Withdrawal request submitted successfully');
        setWithdrawDialogOpen(false);
        setWithdrawAmount('');
        fetchWalletData(); // Refresh balance and transactions
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBank = async () => {
    if (!bankForm.account_holder_name || !bankForm.bank_name || !bankForm.account_number) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/wallets/bank-accounts', bankForm);
      if (response.data.success) {
        toast.success('Bank account added successfully');
        setAddBankDialogOpen(false);
        fetchBankAccounts();
        setBankForm({
          account_holder_name: '',
          bank_name: '',
          account_number: '',
          routing_number: '',
          swift_code: '',
          account_type: 'checking'
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add bank account');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading Wallet..." />
      </div>
    );
  }

  const availableBalance = parseFloat(walletData?.balance || '0');
  const pendingBalance = parseFloat(walletData?.pending_balance || '0');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Wallet Dashboard</h1>
        <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col justify-between h-full gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available for Withdrawal</span>
                </div>
                <p className="text-4xl font-bold">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <Button className="w-full md:w-auto" size="lg" onClick={() => setWithdrawDialogOpen(true)} disabled={availableBalance <= 0}>
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-8">
            <div className="flex flex-col justify-between h-full gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Awaiting Booking Completion</span>
                </div>
                <p className="text-4xl font-bold">${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <p className="text-sm text-muted-foreground italic">
                * Funds are released automatically once the booking is marked as completed by the admin or carrier.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletData?.transactions?.length > 0 ? (
                walletData.transactions.map((txn: any) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50 cursor-pointer group"
                    onClick={() => {
                      setSelectedTxn(txn);
                      setTxnDetailsOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${txn.type.includes('withdrawal') ? 'bg-red-500/10' : 'bg-green-500/10'
                        }`}>
                        {txn.type.includes('withdrawal') ? (
                          <ArrowUpRight className="h-5 w-5 text-red-500" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize group-hover:text-primary transition-colors">{txn.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(txn.created_at).toLocaleDateString()} • {txn.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className={`font-bold ${parseFloat(txn.amount) < 0 ? 'text-red-500' : 'text-green-500'
                          }`}>
                          {parseFloat(txn.amount) < 0 ? '' : '+'}${Math.abs(parseFloat(txn.amount)).toLocaleString()}
                        </p>
                        <Badge variant={txn.status === 'completed' ? 'outline' : 'secondary'} className="text-[10px] uppercase">
                          {txn.status}
                        </Badge>
                      </div>
                      <Info size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No transactions found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Bank Accounts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setAddBankDialogOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bankAccounts.length > 0 ? (
                bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-4 rounded-lg border ${account.is_primary ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{account.bank_name}</p>
                          <p className="text-xs text-muted-foreground">****{account.account_number.slice(-4)}</p>
                        </div>
                      </div>
                      {account.is_primary && <Badge className="text-[10px]">Primary</Badge>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
                  <p className="text-xs">No bank accounts linked</p>
                  <Button variant="link" size="sm" onClick={() => setAddBankDialogOpen(true)}>Add your first account</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Your funds will be sent to your selected bank account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium">Available Balance</span>
              <span className="text-xl font-bold text-primary">${availableBalance.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <Label>Amount to Withdraw ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
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
                      {account.bank_name} - {account.account_number.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleWithdraw} disabled={submitting || !withdrawAmount}>
              {submitting ? <Loader size="sm" text="" /> : 'Request Withdrawal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bank Account Dialog */}
      <Dialog open={addBankDialogOpen} onOpenChange={setAddBankDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>Enter your bank details to receive payments.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Account Holder Name</Label>
              <Input
                placeholder="Full name on account"
                value={bankForm.account_holder_name}
                onChange={(e) => setBankForm({ ...bankForm, account_holder_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  placeholder="e.g. Chase"
                  value={bankForm.bank_name}
                  onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={bankForm.account_type} onValueChange={(v) => setBankForm({ ...bankForm, account_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input
                placeholder="Your account number"
                value={bankForm.account_number}
                onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Routing Number</Label>
                <Input
                  placeholder="9 digits"
                  value={bankForm.routing_number}
                  onChange={(e) => setBankForm({ ...bankForm, routing_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>SWIFT/BIC (Optional)</Label>
                <Input
                  placeholder="Swift code"
                  value={bankForm.swift_code}
                  onChange={(e) => setBankForm({ ...bankForm, swift_code: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBankDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleAddBank} disabled={submitting}>
              {submitting ? <Loader size="sm" text="" /> : 'Save Bank Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={txnDetailsOpen} onOpenChange={setTxnDetailsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-border/50 shrink-0">
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about your {selectedTxn?.type.replace(/_/g, ' ')}
            </DialogDescription>
          </DialogHeader>

          {selectedTxn && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-center p-6 bg-muted/30 rounded-3xl border border-dashed border-border">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Amount</p>
                    <p className={`text-4xl font-black ${parseFloat(selectedTxn.amount) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {parseFloat(selectedTxn.amount) < 0 ? '-' : '+'}${Math.abs(parseFloat(selectedTxn.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Info size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Status</span>
                    </div>
                    <Badge variant={selectedTxn.status === 'completed' ? 'outline' : 'secondary'} className="uppercase px-2 py-0">
                      {selectedTxn.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Date</span>
                    </div>
                    <p className="font-semibold text-sm">{new Date(selectedTxn.created_at).toLocaleString()}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Type</span>
                    </div>
                    <p className="font-semibold text-sm capitalize">{selectedTxn.type.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Reference ID</span>
                    </div>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono break-all line-clamp-1 block">
                      {selectedTxn.reference_id || 'N/A'}
                    </code>
                  </div>

                  {selectedTxn.cargo_type && (
                    <div className="col-span-2 space-y-2 mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Package size={14} />
                        <span className="text-xs uppercase tracking-wider">Linked Booking</span>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="font-bold text-sm text-primary mb-1">{selectedTxn.cargo_type}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span>{selectedTxn.pickup_city}</span>
                          <ArrowRight size={12} />
                          <span>{selectedTxn.delivery_city}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTxn.bank_name && (
                    <div className="col-span-2 space-y-2 mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-red-500 font-bold">
                        <Building size={14} />
                        <span className="text-xs uppercase tracking-wider">Destination Bank</span>
                      </div>
                      <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                        <p className="font-bold text-sm text-red-600 mb-1">{selectedTxn.bank_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <CreditCard size={12} />
                          Account: ****{selectedTxn.account_number?.slice(-4)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="col-span-2 space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Info size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Description</span>
                    </div>
                    <p className="text-sm border-l-2 border-primary/30 pl-3 py-1 bg-primary/5 rounded-r-md">
                      {selectedTxn.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-6 pt-4 border-t border-border/50 shrink-0">
            <Button className="w-full h-11 font-bold" variant="outline" onClick={() => setTxnDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default WalletComponent;
