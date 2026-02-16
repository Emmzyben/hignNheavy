import { useState, useEffect } from "react";
import { Search, Eye, Edit, Ban, MessageSquare, Package, MoreVertical, Loader2, User } from "lucide-react";
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
import Loader from "@/components/ui/Loader";

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
  avatar_url?: string;
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
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any | null>(null);
  const [bookingDetailOpen, setBookingDetailOpen] = useState(false);

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

  const handleViewBooking = (booking: any) => {
    setSelectedBookingDetail(booking);
    setBookingDetailOpen(true);
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
          <Loader size="lg" text="Fetching shippers..." />
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
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                          {shipper.avatar_url ? (
                            <img src={shipper.avatar_url} alt={shipper.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} className="text-primary" />
                          )}
                        </div>
                        {shipper.full_name}
                      </div>
                    </TableCell>
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
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">Profile Details</TabsTrigger>
                <TabsTrigger value="history">Bookings ({userBookings.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-md shrink-0">
                    {selectedShipper.avatar_url ? (
                      <img src={selectedShipper.avatar_url} alt={selectedShipper.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-bold tracking-tight">{selectedShipper.full_name}</h3>
                    <p className="text-sm text-primary font-medium">{selectedShipper.company_name || "Independent Shipper"}</p>
                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                      <Badge variant="outline" className="bg-white/50 border-primary/20 capitalize">
                        {selectedShipper.status}
                      </Badge>
                      {selectedShipper.profile_completed && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  {onMessage && (
                    <Button
                      onClick={() => onMessage(selectedShipper.id)}
                      className="shrink-0 gap-2 shadow-sm"
                    >
                      <MessageSquare size={18} />
                      Chat with Shipper
                    </Button>
                  )}
                </div>

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
                    <Loader size="md" text="Fetching history..." />
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
                          <TableHead className="text-[10px] uppercase text-right">Action</TableHead>
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
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewBooking(booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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

      {/* Booking Details Dialog (Nested) */}
      <Dialog open={bookingDetailOpen} onOpenChange={setBookingDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto z-[60]">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBookingDetail?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedBookingDetail && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Load Information</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Cargo Type:</span>
                      <span className="capitalize">{selectedBookingDetail.cargo_type}</span>
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{selectedBookingDetail.dimensions_length_ft}' x {selectedBookingDetail.dimensions_width_ft}' x {selectedBookingDetail.dimensions_height_ft}'</span>
                      <span className="text-muted-foreground">Weight:</span>
                      <span>{selectedBookingDetail.weight_lbs?.toLocaleString()} lbs</span>
                      <span className="text-muted-foreground">Escort Req:</span>
                      <span>{selectedBookingDetail.requires_escort ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Route & Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground font-bold italic">PICKUP</p>
                        <p className="font-medium">{selectedBookingDetail.pickup_address}</p>
                        <p className="text-xs text-muted-foreground">{selectedBookingDetail.pickup_city}, {selectedBookingDetail.pickup_state}</p>
                      </div>
                      <div className="pt-2 border-t border-muted">
                        <p className="text-xs text-muted-foreground font-bold italic">DELIVERY</p>
                        <p className="font-medium">{selectedBookingDetail.delivery_address}</p>
                        <p className="text-xs text-muted-foreground">{selectedBookingDetail.delivery_city}, {selectedBookingDetail.delivery_state}</p>
                      </div>
                      <div className="pt-2 border-t border-muted">
                        <p className="text-xs text-muted-foreground font-bold">SHIPMENT DATE</p>
                        <p className="font-bold text-primary">{new Date(selectedBookingDetail.shipment_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Current Status</h4>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="w-fit text-sm py-1 px-3 bg-secondary/20">
                        {selectedBookingDetail.status?.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground">Last updated: {new Date(selectedBookingDetail.updated_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-bold text-sm uppercase text-muted-foreground mb-3">Special Instructions</h4>
                    <p className="text-sm italic text-muted-foreground leading-relaxed">
                      {selectedBookingDetail.special_instructions || 'No special instructions provided for this shipment.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDetailOpen(false)}>Back to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ManageShippers;
