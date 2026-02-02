import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MapPin,
    Navigation,
    Clock,
    Calendar,
    CheckCircle,
    XCircle,
    Hourglass,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Trip {
    id: string;
    cargoName: string;
    weight: string;
    status: string;
    origin: { city: string; state: string };
    destination: { city: string; state: string };
    distance: string;
    date: string;
    completedAt?: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "delivered":
        case "completed":
            return (
                <Badge className="bg-green-500/10 text-green-600 border-0 font-bold px-2 py-0.5 text-[10px] uppercase">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                </Badge>
            );
        case "in_transit":
            return (
                <Badge className="bg-primary/10 text-primary border-0 font-bold px-2 py-0.5 text-[10px] uppercase">
                    <Navigation className="w-3 h-3 mr-1" />
                    In Transit
                </Badge>
            );
        case "booked":
            return (
                <Badge className="bg-amber-500/10 text-amber-600 border-0 font-bold px-2 py-0.5 text-[10px] uppercase">
                    <Hourglass className="w-3 h-3 mr-1" />
                    Upcoming
                </Badge>
            );
        default:
            return (
                <Badge className="bg-muted text-muted-foreground border-0 font-bold px-2 py-0.5 text-[10px] uppercase">
                    {status}
                </Badge>
            );
    }
};

const MyTrips = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get("/bookings/my-bookings");
            if (response.data.success) {
                const mapped = response.data.data.map((b: any) => ({
                    id: b.id,
                    cargoName: b.cargo_type,
                    weight: `${b.weight_lbs.toLocaleString()} lbs`,
                    status: b.status,
                    origin: { city: b.pickup_city, state: b.pickup_state },
                    destination: { city: b.delivery_city, state: b.delivery_state },
                    distance: "TBD",
                    date: new Date(b.shipment_date).toLocaleDateString(),
                    completedAt: b.status === 'delivered' || b.status === 'completed' ? new Date(b.updated_at).toLocaleDateString() : undefined,
                }));
                setTrips(mapped);
            }
        } catch (error) {
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredTrips = trips.filter((trip) => {
        if (activeTab === "all") return true;
        if (activeTab === "completed") return trip.status === "delivered" || trip.status === "completed";
        if (activeTab === "pending") return trip.status === "booked" || trip.status === "in_transit";
        return trip.status === activeTab;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading trip history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">My Trips</h1>
                    <p className="text-muted-foreground">History of your assigned and completed loads</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/50 p-1 mb-6">
                    <TabsTrigger value="all" className="px-6">All Jobs</TabsTrigger>
                    <TabsTrigger value="completed" className="px-6">Completed</TabsTrigger>
                    <TabsTrigger value="pending" className="px-6">Active/Planned</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTrips.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-muted/20 rounded-xl border border-dashed">
                            <p className="text-muted-foreground font-medium">No trips found in this category</p>
                        </div>
                    ) : (
                        filteredTrips.map((trip) => (
                            <Card
                                key={trip.id}
                                className="p-6 transition-all hover:border-primary/50 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{trip.cargoName}</h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                            ID: #{trip.id.split('-')[0]} • {trip.weight}
                                        </p>
                                    </div>
                                    {getStatusBadge(trip.status)}
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                        <span className="text-sm font-semibold">{trip.origin.city}, {trip.origin.state}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                                        <span className="text-sm font-semibold">{trip.destination.city}, {trip.destination.state}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            {trip.date}
                                        </span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs font-bold" onClick={() => navigate(`/dashboard/driver/request/${trip.id}`)}>
                                        Details
                                    </Button>
                                </div>

                                {(trip.status === "completed" || trip.status === "delivered") && trip.completedAt && (
                                    <div className="mt-4 p-2 bg-green-500/10 rounded-lg">
                                        <p className="text-[10px] text-green-600 font-bold text-center uppercase tracking-tighter">
                                            Successfully Delivered on {trip.completedAt}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </Tabs>
        </div>
    );
};

export default MyTrips;
