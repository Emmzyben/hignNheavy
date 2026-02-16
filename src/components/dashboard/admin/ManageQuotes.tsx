import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Truck,
  Car,
  Calendar,
  MapPin,
  Loader2,
  ChevronRight,
  Package
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Loader from "@/components/ui/Loader";

const ManageQuotes = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUnmatchedBookings();
  }, []);

  const fetchUnmatchedBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/unmatched-bookings");
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load unmatched bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.shipper_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.cargo_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match Center</h1>
          <p className="text-muted-foreground">Assign providers to pending load requests</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Fetching unmatched loads..." />
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, shipper, or cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-card border rounded-2xl border-dashed">
                <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No bookings awaiting assignment</p>
              </div>
            ) : filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm ring-1 ring-muted"
                onClick={() => navigate(`/dashboard/admin/booking/${booking.id}`)}
              >
                <CardContent className="p-0">
                  <div className="bg-primary/[0.03] p-5 border-b">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="font-mono text-[9px] px-1.5 min-h-0 bg-background">ID: {booking.id.slice(0, 8)}</Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-0 text-[10px] font-bold px-2">{booking.status.toUpperCase()}</Badge>
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{booking.cargo_type}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                      <span className="w-1 h-1 rounded-full bg-primary" /> Shipper: {booking.shipper_name}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-[10px] font-bold uppercase text-muted-foreground tracking-widest gap-2">
                        <MapPin size={10} className="text-primary" /> Route
                      </div>
                      <p className="text-sm font-medium pl-4 border-l-2 border-primary/20">{booking.pickup_city}, {booking.pickup_state} → {booking.delivery_city}</p>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center text-xs font-bold gap-1.5">
                        <Calendar size={12} className="text-muted-foreground" />
                        {new Date(booking.shipment_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-muted-foreground uppercase opacity-60">Carriers</span>
                          <div className="flex items-center text-sm font-bold gap-1.5">
                            <Truck className="h-3.5 w-3.5 text-primary" />
                            {booking.carrier_quote_count || 0}
                          </div>
                        </div>
                        {booking.requires_escort === 1 && (
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted-foreground uppercase opacity-60">Escorts</span>
                            <div className="flex items-center text-sm font-bold gap-1.5">
                              <Car className="h-3.5 w-3.5 text-purple-600" />
                              {booking.escort_quote_count || 0}
                            </div>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageQuotes;
