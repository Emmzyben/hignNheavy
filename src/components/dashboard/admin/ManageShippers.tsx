import { useState } from "react";
import { Search, Eye, Edit, Ban, MessageSquare, Package, MoreVertical } from "lucide-react";
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

interface Shipper {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: "active" | "disabled";
  totalBookings: number;
  address: string;
}

const mockShippers: Shipper[] = [
  { id: "SH-001", name: "John Smith", company: "Heavy Industries Inc", email: "john@heavyind.com", phone: "(555) 123-4567", registeredDate: "2024-01-15", status: "active", totalBookings: 24, address: "123 Industrial Ave, Houston, TX" },
  { id: "SH-002", name: "Sarah Johnson", company: "MegaLoad Corp", email: "sarah@megaload.com", phone: "(555) 234-5678", registeredDate: "2024-02-20", status: "active", totalBookings: 18, address: "456 Commerce St, Dallas, TX" },
  { id: "SH-003", name: "Mike Williams", company: "TransGlobal LLC", email: "mike@transglobal.com", phone: "(555) 345-6789", registeredDate: "2024-03-10", status: "disabled", totalBookings: 7, address: "789 Shipping Ln, Austin, TX" },
  { id: "SH-004", name: "Emily Davis", company: "CargoMax Solutions", email: "emily@cargomax.com", phone: "(555) 456-7890", registeredDate: "2024-04-05", status: "active", totalBookings: 31, address: "321 Freight Blvd, San Antonio, TX" },
];

const mockBookings = [
  { id: "BK-2024-001", cargo: "Wind Turbine Blade", route: "Houston → Dallas", status: "completed", date: "2024-12-01" },
  { id: "BK-2024-015", cargo: "Industrial Generator", route: "Dallas → Austin", status: "in-transit", date: "2024-12-10" },
  { id: "BK-2024-023", cargo: "Steel Bridge Section", route: "Austin → Houston", status: "pending", date: "2024-12-15" },
];

const mockMessages = [
  { id: 1, subject: "Quote inquiry for BK-2024-023", date: "2024-12-14", preview: "Hi, I wanted to ask about..." },
  { id: 2, subject: "Delivery confirmation needed", date: "2024-12-12", preview: "Please confirm the delivery..." },
  { id: 3, subject: "Schedule change request", date: "2024-12-10", preview: "Due to weather conditions..." },
];

const ManageShippers = () => {
  const [shippers, setShippers] = useState(mockShippers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShipper, setSelectedShipper] = useState<Shipper | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Shipper | null>(null);

  const filteredShippers = shippers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (shipper: Shipper) => {
    setSelectedShipper(shipper);
    setDialogOpen(true);
  };

  const handleEdit = (shipper: Shipper) => {
    setEditForm({ ...shipper });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setShippers(shippers.map(s => s.id === editForm.id ? editForm : s));
      setEditDialogOpen(false);
    }
  };

  const handleToggleStatus = (shipperId: string) => {
    setShippers(shippers.map(s => 
      s.id === shipperId 
        ? { ...s, status: s.status === "active" ? "disabled" : "active" }
        : s
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Shippers</h1>
          <p className="text-muted-foreground">View and manage all registered shippers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Shippers</p>
          <p className="text-2xl font-bold">{shippers.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{shippers.filter(s => s.status === "active").length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Disabled</p>
          <p className="text-2xl font-bold text-destructive">{shippers.filter(s => s.status === "disabled").length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold">{shippers.reduce((sum, s) => sum + s.totalBookings, 0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shippers..."
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
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShippers.map((shipper) => (
              <TableRow key={shipper.id}>
                <TableCell className="font-mono text-sm">{shipper.id}</TableCell>
                <TableCell className="font-medium">{shipper.name}</TableCell>
                <TableCell>{shipper.company}</TableCell>
                <TableCell>{shipper.email}</TableCell>
                <TableCell>{shipper.registeredDate}</TableCell>
                <TableCell>{shipper.totalBookings}</TableCell>
                <TableCell>
                  <Badge variant={shipper.status === "active" ? "default" : "destructive"}>
                    {shipper.status}
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
                      <DropdownMenuItem onClick={() => handleView(shipper)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(shipper)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(shipper.id)}>
                        <Ban className="h-4 w-4 mr-2" /> 
                        {shipper.status === "active" ? "Disable" : "Enable"}
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipper Details - {selectedShipper?.name}</DialogTitle>
          </DialogHeader>
          {selectedShipper && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Registration Details</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedShipper.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{selectedShipper.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedShipper.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedShipper.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedShipper.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registered Date</p>
                    <p className="font-medium">{selectedShipper.registeredDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={selectedShipper.status === "active" ? "default" : "destructive"}>
                      {selectedShipper.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="font-medium">{selectedShipper.totalBookings}</p>
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
                          <Badge variant={
                            booking.status === "completed" ? "default" :
                            booking.status === "in-transit" ? "secondary" : "outline"
                          }>
                            {booking.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{booking.date}</p>
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
                        <p className="font-medium">{msg.subject}</p>
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
            <DialogTitle>Edit Shipper</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
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
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
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

export default ManageShippers;
