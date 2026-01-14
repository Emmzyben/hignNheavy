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

interface Escort {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: "active" | "disabled";
  totalJobs: number;
  vehiclesCount: number;
  address: string;
  certifications: string[];
}

const mockEscorts: Escort[] = [
  { id: "ES-001", name: "David Miller", company: "SafeRoute Escorts", email: "david@saferoute.com", phone: "(555) 444-5555", registeredDate: "2024-01-20", status: "active", totalJobs: 67, vehiclesCount: 4, address: "500 Pilot Way, Houston, TX", certifications: ["TxDOT Certified", "FMCSA Compliant"] },
  { id: "ES-002", name: "Jennifer Lee", company: "Highway Guard LLC", email: "jennifer@highwayguard.com", phone: "(555) 555-6666", registeredDate: "2024-02-25", status: "active", totalJobs: 45, vehiclesCount: 3, address: "600 Escort Rd, Dallas, TX", certifications: ["TxDOT Certified", "CDL-A"] },
  { id: "ES-003", name: "Kevin Brown", company: "LoadWatch Services", email: "kevin@loadwatch.com", phone: "(555) 666-7777", registeredDate: "2024-03-15", status: "disabled", totalJobs: 23, vehiclesCount: 2, address: "700 Safety Ln, Austin, TX", certifications: ["TxDOT Certified"] },
];

const mockVehicles = [
  { id: "VH-001", type: "Pilot Vehicle", make: "Ford F-150", year: "2023", plate: "TX-ESC-001", status: "available", equipment: ["Height Pole", "Wide Load Signs", "CB Radio", "Strobe Lights"] },
  { id: "VH-002", type: "Escort Vehicle", make: "Chevrolet Silverado", year: "2022", plate: "TX-ESC-002", status: "in-use", equipment: ["Height Pole", "Oversize Signs", "GPS Tracker"] },
];

const mockPricing = {
  frontPilot: 75,
  rearEscort: 65,
  bothPositions: 130,
  nightRate: 25,
  weekendRate: 20,
  rushRate: 35,
  stateLineCrossing: 100,
};

const mockBookings = [
  { id: "BK-2024-008", cargo: "Wind Turbine Nacelle", route: "Houston → Amarillo", status: "completed", earnings: "$1,200", date: "2024-12-03" },
  { id: "BK-2024-022", cargo: "Bridge Beam Section", route: "Dallas → El Paso", status: "in-progress", earnings: "$1,850", date: "2024-12-14" },
];

const mockMessages = [
  { id: 1, from: "Carrier - FastHaul", subject: "Route coordination for BK-2024-022", date: "2024-12-14", preview: "Can we sync up on the route..." },
  { id: 2, from: "Admin", subject: "Certification renewal reminder", date: "2024-12-12", preview: "Your TxDOT certification expires..." },
];

const ManageEscorts = () => {
  const [escorts, setEscorts] = useState(mockEscorts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEscort, setSelectedEscort] = useState<Escort | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Escort | null>(null);

  const filteredEscorts = escorts.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (escort: Escort) => {
    setSelectedEscort(escort);
    setDialogOpen(true);
  };

  const handleEdit = (escort: Escort) => {
    setEditForm({ ...escort });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setEscorts(escorts.map(e => e.id === editForm.id ? editForm : e));
      setEditDialogOpen(false);
    }
  };

  const handleToggleStatus = (escortId: string) => {
    setEscorts(escorts.map(e => 
      e.id === escortId 
        ? { ...e, status: e.status === "active" ? "disabled" : "active" }
        : e
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Escorts</h1>
        <p className="text-muted-foreground">View and manage all registered escort/pilot car services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Escorts</p>
          <p className="text-2xl font-bold">{escorts.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{escorts.filter(e => e.status === "active").length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
          <p className="text-2xl font-bold">{escorts.reduce((sum, e) => sum + e.vehiclesCount, 0)}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Jobs</p>
          <p className="text-2xl font-bold">{escorts.reduce((sum, e) => sum + e.totalJobs, 0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search escorts..."
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
              <TableHead>Vehicles</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Certifications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEscorts.map((escort) => (
              <TableRow key={escort.id}>
                <TableCell className="font-mono text-sm">{escort.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{escort.company}</p>
                    <p className="text-sm text-muted-foreground">{escort.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{escort.email}</p>
                    <p className="text-sm text-muted-foreground">{escort.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{escort.vehiclesCount}</TableCell>
                <TableCell>{escort.totalJobs}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {escort.certifications.slice(0, 2).map((cert, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{cert}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={escort.status === "active" ? "default" : "destructive"}>
                    {escort.status}
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
                      <DropdownMenuItem onClick={() => handleView(escort)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(escort)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(escort.id)}>
                        <Ban className="h-4 w-4 mr-2" /> 
                        {escort.status === "active" ? "Disable" : "Enable"}
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
            <DialogTitle>Escort Details - {selectedEscort?.company}</DialogTitle>
          </DialogHeader>
          {selectedEscort && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="font-medium">{selectedEscort.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{selectedEscort.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedEscort.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedEscort.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedEscort.address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Certifications</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedEscort.certifications.map((cert, i) => (
                        <Badge key={i} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vehicles" className="mt-4">
                <div className="space-y-3">
                  {mockVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{vehicle.make} ({vehicle.year})</p>
                          <p className="text-sm text-muted-foreground">{vehicle.type} • {vehicle.plate}</p>
                        </div>
                        <Badge variant={vehicle.status === "available" ? "default" : "secondary"}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Equipment:</p>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.equipment.map((eq, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{eq}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Front Pilot Rate</p>
                    <p className="text-xl font-bold">${mockPricing.frontPilot}/hr</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Rear Escort Rate</p>
                    <p className="text-xl font-bold">${mockPricing.rearEscort}/hr</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Both Positions</p>
                    <p className="text-xl font-bold">${mockPricing.bothPositions}/hr</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Night Surcharge</p>
                    <p className="text-xl font-bold">+{mockPricing.nightRate}%</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Weekend Surcharge</p>
                    <p className="text-xl font-bold">+{mockPricing.weekendRate}%</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">State Line Crossing</p>
                    <p className="text-xl font-bold">${mockPricing.stateLineCrossing}</p>
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
                          <p className="font-bold text-green-600">{booking.earnings}</p>
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
            <DialogTitle>Edit Escort</DialogTitle>
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

export default ManageEscorts;
