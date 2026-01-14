import { useState } from 'react';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const pendingPayouts = [
  {
    id: 'BK-098',
    shipper: 'ABC Construction',
    route: 'Houston → Dallas',
    completedDate: '2024-01-15',
    amount: 4500,
    expectedPayout: '2024-01-22',
    status: 'processing',
  },
  {
    id: 'BK-095',
    shipper: 'Steel Works Inc',
    route: 'San Antonio → Austin',
    completedDate: '2024-01-12',
    amount: 2800,
    expectedPayout: '2024-01-19',
    status: 'pending',
  },
];

const completedBookings = [
  {
    id: 'BK-090',
    shipper: 'Energy Solutions',
    route: 'Midland → Corpus Christi',
    completedDate: '2024-01-08',
    amount: 12500,
    paidDate: '2024-01-15',
  },
  {
    id: 'BK-085',
    shipper: 'Heavy Equipment Co',
    route: 'El Paso → Houston',
    completedDate: '2024-01-05',
    amount: 8200,
    paidDate: '2024-01-12',
  },
  {
    id: 'BK-080',
    shipper: 'Construction Plus',
    route: 'Dallas → San Antonio',
    completedDate: '2024-01-02',
    amount: 3500,
    paidDate: '2024-01-09',
  },
];

const CarrierPayouts = () => {
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = completedBookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Payouts</h1>
        <p className="text-muted-foreground">Track your earnings and completed jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalCompleted.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Paid This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedBookings.length}</p>
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">$5,133</p>
                <p className="text-sm text-muted-foreground">Avg per Job</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Payouts ({pendingPayouts.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingPayouts.map((payout) => (
            <Card key={payout.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{payout.id}</span>
                      <Badge variant={payout.status === 'processing' ? 'default' : 'secondary'}>
                        {payout.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{payout.shipper}</p>
                    <p className="text-sm">{payout.route}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${payout.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Expected: {new Date(payout.expectedPayout).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{booking.id}</span>
                      <Badge className="bg-green-500/20 text-green-500">Paid</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.shipper}</p>
                    <p className="text-sm">{booking.route}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">${booking.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Paid: {new Date(booking.paidDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarrierPayouts;
