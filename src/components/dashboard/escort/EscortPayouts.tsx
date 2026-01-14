import { useState } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockPendingPayouts = [
  {
    id: "PAY-001",
    bookingId: "BK-2024-001",
    route: "Houston, TX → Dallas, TX",
    completedDate: "2024-01-15",
    amount: 850,
    position: "Front Escort",
    status: "pending",
    expectedPayout: "2024-01-22",
  },
  {
    id: "PAY-002",
    bookingId: "BK-2024-002",
    route: "Austin, TX → San Antonio, TX",
    completedDate: "2024-01-18",
    amount: 425,
    position: "Rear Escort",
    status: "processing",
    expectedPayout: "2024-01-25",
  },
];

const mockCompletedJobs = [
  {
    id: "BK-2023-045",
    route: "Fort Worth, TX → Oklahoma City, OK",
    completedDate: "2024-01-10",
    amount: 720,
    position: "Front & Rear",
    paidDate: "2024-01-17",
  },
  {
    id: "BK-2023-044",
    route: "El Paso, TX → Phoenix, AZ",
    completedDate: "2024-01-05",
    amount: 1250,
    position: "Front Escort",
    paidDate: "2024-01-12",
  },
  {
    id: "BK-2023-043",
    route: "Dallas, TX → Little Rock, AR",
    completedDate: "2023-12-28",
    amount: 580,
    position: "Rear Escort",
    paidDate: "2024-01-04",
  },
  {
    id: "BK-2023-042",
    route: "Houston, TX → New Orleans, LA",
    completedDate: "2023-12-20",
    amount: 890,
    position: "Front Escort",
    paidDate: "2023-12-27",
  },
];

const EscortPayouts = () => {
  const totalPending = mockPendingPayouts.reduce((acc, p) => acc + p.amount, 0);
  const paidThisMonth = mockCompletedJobs
    .filter(j => j.paidDate.startsWith("2024-01"))
    .reduce((acc, j) => acc + j.amount, 0);

  const stats = [
    { label: "Pending Payout", value: `$${totalPending.toLocaleString()}`, icon: Clock },
    { label: "Paid This Month", value: `$${paidThisMonth.toLocaleString()}`, icon: DollarSign },
    { label: "Completed Jobs", value: mockCompletedJobs.length, icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Payouts</h1>
        <p className="text-muted-foreground">View your pending payouts and completed jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
          <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {mockPendingPayouts.map((payout) => (
            <Card key={payout.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">{payout.bookingId}</span>
                      <Badge variant={payout.status === "processing" ? "secondary" : "outline"}>
                        {payout.status === "processing" ? "Processing" : "Pending"}
                      </Badge>
                      <Badge variant="outline">{payout.position}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{payout.route}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Completed: {payout.completedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Expected: {payout.expectedPayout}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${payout.amount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {mockCompletedJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">{job.id}</span>
                      <Badge className="bg-green-500">Paid</Badge>
                      <Badge variant="outline">{job.position}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{job.route}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Completed: {job.completedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Paid: {job.paidDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${job.amount.toLocaleString()}</p>
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

export default EscortPayouts;
