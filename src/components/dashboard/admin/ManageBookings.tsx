import { useState, useEffect } from "react";
import { Search, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import Loader from "@/components/ui/Loader";

const statusConfig: Record<string, { label: string; color: string }> = {
  "pending_quote": { label: "Awaiting Quotes", color: "bg-blue-100 text-blue-800" },
  "quoted": { label: "Quotes Received", color: "bg-purple-100 text-purple-800" },
  "booked": { label: "Booked", color: "bg-green-100 text-green-800" },
  "in_transit": { label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
  "delivered": { label: "Delivered", color: "bg-teal-100 text-teal-800" },
  "completed": { label: "Completed", color: "bg-gray-100 text-gray-800" },
  "cancelled": { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/bookings/my-bookings");
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shipper_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cargo_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground">Monitor all cargo and shipments in the system</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Fetching bookings..." />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, shipper, or cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Shipper</TableHead>
                  <TableHead>Cargo Type</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Pickup Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No bookings found</TableCell>
                  </TableRow>
                ) : filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.shipper_name || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{booking.shipper_company || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="capitalize">{booking.cargo_type}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {booking.pickup_city}, {booking.pickup_state}
                        <div className="text-muted-foreground">→ {booking.delivery_city}, {booking.delivery_state}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(booking.shipment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[booking.status]?.color || "bg-gray-100"} variant="secondary">
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(val) => handleUpdateStatus(booking.id, val)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending_quote">Pending Quote</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/admin/booking/${booking.id}`)}
                          className="h-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBookings;
