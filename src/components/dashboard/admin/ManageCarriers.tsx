import { useState } from "react";
import { Search, Eye, Edit, Ban, MoreVertical } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Carrier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: "active" | "disabled";
  totalBookings: number;
  driversCount: number;
  equipmentCount: number;
  address: string;
  mcNumber: string;
  dotNumber: string;
}

const mockCarriers: Carrier[] = [
  { id: "CR-001", name: "Robert Chen", company: "FastHaul Logistics", email: "robert@fasthaul.com", phone: "(555) 111-2222", registeredDate: "2024-01-10", status: "active", totalBookings: 45, driversCount: 8, equipmentCount: 12, address: "100 Trucking Way, Houston, TX", mcNumber: "MC-123456", dotNumber: "DOT-789012" },
  { id: "CR-002", name: "Maria Garcia", company: "Heavy Movers Inc", email: "maria@heavymovers.com", phone: "(555) 222-3333", registeredDate: "2024-02-15", status: "active", totalBookings: 32, driversCount: 5, equipmentCount: 8, address: "200 Freight St, Dallas, TX", mcNumber: "MC-234567", dotNumber: "DOT-890123" },
  { id: "CR-003", name: "James Wilson", company: "BigRig Transport", email: "james@bigrig.com", phone: "(555) 333-4444", registeredDate: "2024-03-20", status: "disabled", totalBookings: 12, driversCount: 3, equipmentCount: 4, address: "300 Highway Blvd, Austin, TX", mcNumber: "MC-345678", dotNumber: "DOT-901234" },
];

const mockDrivers = [
  { id: "DRV-001", name: "Tom Baker", license: "CDL-A-TX-12345", status: "available", completedJobs: 28 },
  { id: "DRV-002", name: "Lisa Wang", license: "CDL-A-TX-23456", status: "on-job", completedJobs: 45 },
  { id: "DRV-003", name: "Carlos Mendez", license: "CDL-A-TX-34567", status: "available", completedJobs: 19 },
];

const mockEquipment = [
  { id: "EQ-001", type: "Lowboy Trailer", name: "LB-5500", capacity: "55 tons", status: "available" },
  { id: "EQ-002", type: "Flatbed Truck", name: "FB-4800", capacity: "48,000 lbs", status: "in-use" },
  { id: "EQ-003", type: "RGN Trailer", name: "RGN-7000", capacity: "70 tons", status: "maintenance" },
];

const mockPricing = {
  baseRate: 4.50,
  oversizeMultiplier: 1.5,
  superloadMultiplier: 2.0,
  escortFee: 350,
  permitHandling: 200,
  weekendSurcharge: 15,
  rushSurcharge: 25,
};

const mockBookings = [
  { id: "BK-2024-005", cargo: "Crane Component", route: "Houston → Austin", status: "completed", price: "$8,500", date: "2024-12-05" },
  { id: "BK-2024-018", cargo: "Mining Equipment", route: "Dallas → El Paso", status: "in-transit", price: "$12,300", date: "2024-12-12" },
];

const mockMessages = [
  { id: 1, from: "Admin", subject: "Document verification needed", date: "2024-12-14", preview: "Please upload updated insurance..." },
  { id: 2, from: "Shipper - Heavy Industries", subject: "Delivery time inquiry", date: "2024-12-13", preview: "Can you confirm arrival time..." },
];

const ManageCarriers = () => {
  const [carriers, setCarriers] = useState(mockCarriers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Carrier | null>(null);

  const filteredCarriers = carriers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setDialogOpen(true);
  };

  const handleEdit = (carrier: Carrier) => {
    setEditForm({ ...carrier });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setCarriers(carriers.map(c => c.id === editForm.id ? editForm : c));
      setEditDialogOpen(false);
    }
  };

  const handleToggleStatus = (carrierId: string) => {
    setCarriers(carriers.map(c => 
      c.id === carrierId 
        ? { ...c, status: c.status === "active" ? "disabled" : "active" }
        : c
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Carriers</h1>
        <p className="text-muted-foreground">View and manage all registered carriers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Carriers</p>
          <p className="text-2xl font-bold">{carriers.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{carriers.filter(c => c.status === "active").length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Drivers</p>
          <p className="text-2xl font-bold">{carriers.reduce((sum, c) => sum + c.driversCount, 0)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Equipment</p>
          <p className="text-2xl font-bold">{carriers.reduce((sum, c) => sum + c.equipmentCount, 0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search carriers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>MC/DOT</TableHead>
              <TableHead>Drivers</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarriers.map((carrier) => (
              <TableRow key={carrier.id}>
                <TableCell className="font-mono text-sm">{carrier.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{carrier.company}</p>
                    <p className="text-sm text-muted-foreground">{carrier.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{carrier.email}</p>
                    <p className="text-sm text-muted-foreground">{carrier.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{carrier.mcNumber}</p>
                    <p className="text-muted-foreground">{carrier.dotNumber}</p>
                  </div>
                </TableCell>
                <TableCell>{carrier.driversCount}</TableCell>
                <TableCell>{carrier.equipmentCount}</TableCell>
                <TableCell>
                  <Badge variant={carrier.status === "active" ? "default" : "destructive"}>
                    {carrier.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(carrier)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(carrier)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(carrier.id)}>
                        <Ban className="h-4 w-4 mr-2" /> 
                        {carrier.status === "active" ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Carrier Details - {selectedCarrier?.company}</DialogTitle>
          </DialogHeader>
          {selectedCarrier && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="drivers">Drivers</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="font-medium">{selectedCarrier.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{selectedCarrier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedCarrier.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedCarrier.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MC Number</p>
                    <p className="font-medium">{selectedCarrier.mcNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DOT Number</p>
                    <p className="font-medium">{selectedCarrier.dotNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedCarrier.address}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="drivers" className="mt-4">
                <div className="space-y-3">
                  {mockDrivers.map((driver) => (
                    <div key={driver.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">{driver.license}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={driver.status === "available" ? "default" : "secondary"}>
                          {driver.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{driver.completedJobs} jobs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="mt-4">
                <div className="space-y-3">
                  {mockEquipment.map((eq) => (
                    <div key={eq.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{eq.name}</p>
                        <p className="text-sm text-muted-foreground">{eq.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          eq.status === "available" ? "default" :
                          eq.status === "in-use" ? "secondary" : "destructive"
                        }>
                          {eq.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{eq.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Base Rate</p>
                    <p className="text-xl font-bold">${mockPricing.baseRate}/mile</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Oversize Multiplier</p>
                    <p className="text-xl font-bold">{mockPricing.oversizeMultiplier}x</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Superload Multiplier</p>
                    <p className="text-xl font-bold">{mockPricing.superloadMultiplier}x</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Escort Fee</p>
                    <p className="text-xl font-bold">${mockPricing.escortFee}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Permit Handling</p>
                    <p className="text-xl font-bold">${mockPricing.permitHandling}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Weekend Surcharge</p>
                    <p className="text-xl font-bold">{mockPricing.weekendSurcharge}%</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="mt-4">
                <div className="space-y-3">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.id}</p>
                          <p className="text-sm text-muted-foreground">{booking.cargo}</p>
                          <p className="text-sm">{booking.route}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{booking.price}</p>
                          <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="messages" className="mt-4">
                <div className="space-y-3">
                  {mockMessages.map((msg) => (
                    <div key={msg.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">From: {msg.from}</p>
                          <p className="font-medium">{msg.subject}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{msg.preview}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Carrier</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contact Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">MC Number</label>
                  <Input
                    value={editForm.mcNumber}
                    onChange={(e) => setEditForm({ ...editForm, mcNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">DOT Number</label>
                  <Input
                    value={editForm.dotNumber}
                    onChange={(e) => setEditForm({ ...editForm, dotNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCarriers;
