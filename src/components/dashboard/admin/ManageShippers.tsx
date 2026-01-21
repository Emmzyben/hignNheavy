import { useState, useEffect } from "react";
import { Search, Eye, Edit, Ban, MessageSquare, Package, MoreVertical, Loader2 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/lib/api";

interface Shipper {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  contact_number: string;
  created_at: string;
  status: "active" | "disabled";
  totalBookings?: number;
  address?: string;
  city?: string;
  state?: string;
}

interface ManageShippersProps {
  onMessage?: (participantId: string, bookingId?: string | null) => void;
}

const ManageShippers = ({ onMessage }: ManageShippersProps) => {
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShipper, setSelectedShipper] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchShippers();
  }, []);

  const fetchShippers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/list/shipper");
      if (response.data.success) {
        setShippers(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load shippers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShippers = shippers.filter(s =>
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (shipper: Shipper) => {
    setSelectedShipper(null);
    setUserBookings([]);
    try {
      const response = await api.get(`/users/${shipper.id}`);
      if (response.data.success) {
        setSelectedShipper(response.data.data);
        setDialogOpen(true);

        // Fetch user's booking history
        setLoadingHistory(true);
        try {
          const bookingsRes = await api.get(`/admin/users/${shipper.id}/bookings`);
          if (bookingsRes.data.success) {
            setUserBookings(bookingsRes.data.data);
          }
        } catch (err) {
          console.error("Failed to load user bookings", err);
        } finally {
          setLoadingHistory(false);
        }
      }
    } catch (error) {
      toast.error("Failed to load shipper details");
    }
  };

  const handleEdit = (shipper: Shipper) => {
    handleView(shipper).then(() => {
      // details are loaded into selectedShipper, but we need them in editForm
    });
    // For now, let's just pre-fill with what we have
    setEditForm({ ...shipper });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    setIsSaving(true);
    try {
      // In a real scenario, we might have an update user endpoint
      // For now, let's just update the status if that's all we can do via API
      // If we had a full update endpoint:
      // await api.put(`/users/${editForm.id}`, editForm);
      toast.info("Update functionality is limited to status and profile completion in this version.");
      setEditDialogOpen(false);
      fetchShippers();
    } catch (error) {
      toast.error("Failed to update shipper");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (shipper: Shipper) => {
    const newStatus = shipper.status === "active" ? "disabled" : "active";
    try {
      const response = await api.patch(`/users/${shipper.id}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Shipper ${newStatus} successfully`);
        fetchShippers();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Shippers</h1>
          <p className="text-muted-foreground">View and manage all registered shippers</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Shippers</p>
              <p className="text-2xl font-bold">{shippers.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{shippers.filter(s => s.status === "active").length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Disabled</p>
              <p className="text-2xl font-bold text-destructive">{shippers.filter(s => s.status === "disabled").length}</p>
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
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShippers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No shippers found</TableCell>
                  </TableRow>
                ) : filteredShippers.map((shipper) => (
                  <TableRow key={shipper.id}>
                    <TableCell className="font-medium">{shipper.full_name}</TableCell>
                    <TableCell>{shipper.company_name || "N/A"}</TableCell>
                    <TableCell>{shipper.email}</TableCell>
                    <TableCell>{new Date(shipper.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={shipper.status === "active" ? "default" : "destructive"} className="capitalize">
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
                          {onMessage && (
                            <DropdownMenuItem onClick={() => onMessage(shipper.id)}>
                              <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleStatus(shipper)}>
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
        </>
      )}

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipper Details - {selectedShipper?.full_name}</DialogTitle>
          </DialogHeader>
          {selectedShipper && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Profile Details</TabsTrigger>
                <TabsTrigger value="history">Bookings ({userBookings.length})</TabsTrigger>
                {onMessage && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    onClick={() => onMessage(selectedShipper.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" /> Chat
                  </Button>
                )}
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Full Name</p>
                    <p className="font-medium">{selectedShipper.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Company</p>
                    <p className="font-medium">{selectedShipper.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Email</p>
                    <p className="font-medium">{selectedShipper.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Phone</p>
                    <p className="font-medium">{selectedShipper.contact_number || selectedShipper.phone_number || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Address</p>
                    <p className="font-medium">{selectedShipper.address ? `${selectedShipper.address}, ${selectedShipper.city}, ${selectedShipper.state} ${selectedShipper.zip_code}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Registered Date</p>
                    <p className="font-medium">{new Date(selectedShipper.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Status</p>
                    <Badge variant={selectedShipper.status === "active" ? "default" : "destructive"} className="capitalize">
                      {selectedShipper.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Profile Completed</p>
                    <p className="font-medium">{selectedShipper.profile_completed ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                {loadingHistory ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : userBookings.length === 0 ? (
                  <div className="p-8 text-center bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
                    This user has not created any bookings yet.
                  </div>
                ) : (
                  <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="text-[10px] uppercase">ID</TableHead>
                          <TableHead className="text-[10px] uppercase">Cargo</TableHead>
                          <TableHead className="text-[10px] uppercase">Route</TableHead>
                          <TableHead className="text-[10px] uppercase">Date</TableHead>
                          <TableHead className="text-[10px] uppercase">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-mono text-[10px]">{booking.id.slice(0, 8)}</TableCell>
                            <TableCell className="text-sm font-medium">{booking.cargo_type}</TableCell>
                            <TableCell className="text-[10px]">
                              {booking.pickup_city} → {booking.delivery_city}
                            </TableCell>
                            <TableCell className="text-[10px]">{new Date(booking.shipment_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[9px] h-5 capitalize">
                                {booking.status?.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageShippers;
