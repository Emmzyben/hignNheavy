import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    MapPin,
    Navigation,
    Clock,
    Phone,
    MessageCircle,
    Play,
    Square,
    Camera,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

type TripStatus = "accepted" | "in_progress" | "arrived";

interface ActiveTripProps {
    onMessage?: (participantId: string, bookingId?: string | null) => void;
}

const ActiveTrip = ({ onMessage }: ActiveTripProps) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [fetching, setFetching] = useState(true);
    const [employerId, setEmployerId] = useState<string | null>(null);
    const [trip, setTrip] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchActiveTrip = async () => {
        try {
            const response = await api.get("/drivers/active-trip");
            if (response.data.success && response.data.data) {
                const b = response.data.data;
                setTrip({
                    id: b.id,
                    cargoName: b.cargo_type,
                    weight: `${b.weight_lbs.toLocaleString()} lbs`,
                    shipper: {
                        name: b.shipper_company || b.shipper_name,
                        phone: b.shipper_phone || "+1 (555) 000-0000",
                    },
                    origin: { city: b.pickup_city, state: b.pickup_state, address: b.pickup_address },
                    destination: { city: b.delivery_city, state: b.delivery_state, address: b.delivery_address },
                    distance: "Calculating...",
                    eta: "TBD",
                    status: b.status
                });
            } else {
                setTrip(null);
            }
        } catch (error) {
            console.error("Failed to fetch active trip", error);
        }
    };

    useEffect(() => {
        const fetchDriverInfo = async () => {
            try {
                const response = await api.get("/drivers/me");
                if (response.data.success) {
                    setEmployerId(response.data.data.employer_id);
                }
            } catch (error) {
                console.error("Failed to fetch driver info", error);
            } finally {
                setFetching(false);
            }
        };

        fetchDriverInfo();
        fetchActiveTrip();
    }, []);

    const handleChatCarrier = () => {
        if (onMessage && employerId) {
            onMessage(employerId, trip?.id);
        } else {
            navigate("/dashboard/driver?section=messages");
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            let endpoint = `/bookings/${trip.id}/status`;
            let payload = { status: newStatus };

            // We can use our specialized routes too
            if (newStatus === "delivered") {
                navigate(`/dashboard/driver/complete-delivery?bookingId=${trip.id}`);
                return;
            }

            const response = await api.patch(endpoint, payload);
            if (response.data.success) {
                toast.success(`Trip status updated to ${newStatus}`);
                fetchActiveTrip();
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="py-20 text-center space-y-4">
                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Navigation className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">No Active Trip</h2>
                    <p className="text-muted-foreground">Go to Available Loads to start your next journey.</p>
                </div>
                <Button onClick={() => navigate("/dashboard/driver?section=requests")}>
                    View Available Loads
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold">Active Trip</h1>
                    <p className="text-muted-foreground font-medium">Monitoring load #{trip.id.split('-')[0]}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 font-bold px-3 py-1 uppercase tracking-widest text-[10px]">
                    {trip.status.replace('_', ' ')}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Map Placeholder */}
                    <Card className="h-64 bg-muted/30 flex items-center justify-center border-dashed overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                        <div className="text-center relative z-10">
                            <div className="p-4 bg-background rounded-full shadow-lg mb-3 mx-auto w-fit group-hover:scale-110 transition-transform">
                                <Navigation className="w-8 h-8 text-primary" />
                            </div>
                            <p className="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Live Map Tracking</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Route Information</h2>
                        <div className="space-y-6 relative ml-4">
                            <div className="absolute left-0 top-2 bottom-2 w-px bg-border border-dashed border-l-2 ml-[5px]" />

                            <div className="relative flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full bg-primary mt-1.5 z-10 ring-4 ring-background" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1">Pickup</p>
                                    <p className="font-bold text-lg">{trip.origin.city}, {trip.origin.state}</p>
                                    <p className="text-sm text-muted-foreground">{trip.origin.address}</p>
                                </div>
                            </div>

                            <div className="relative flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full bg-secondary mt-1.5 z-10 ring-4 ring-background" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1">Delivery</p>
                                    <p className="font-bold text-lg">{trip.destination.city}, {trip.destination.state}</p>
                                    <p className="text-sm text-muted-foreground">{trip.destination.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-lg">
                                    <Navigation className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Distance</p>
                                    <p className="font-bold text-sm">{trip.distance}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-lg">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">ETA</p>
                                    <p className="font-bold text-sm">{trip.eta}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-primary text-primary-foreground overflow-hidden relative shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Camera className="w-24 h-24" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{trip.cargoName}</h3>
                        <p className="opacity-80 text-xs mb-4">{trip.weight}</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-[10px]">High Priority</Badge>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Support & Logistics</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-sm tracking-tight">Contact Carrier</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Your Employer</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg border-primary/20 hover:bg-primary/5"
                                        onClick={handleChatCarrier}
                                    >
                                        <MessageCircle className="w-4 h-4 text-primary" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t">
                                <div>
                                    <p className="font-bold text-sm tracking-tight">Shipper Support</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{trip.shipper.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-primary/20 hover:bg-primary/5">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-3">
                        {trip.status === "in_transit" && (
                            <Button
                                className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg shadow-lg hover:scale-[1.02] transition-all"
                                onClick={() => handleUpdateStatus("delivered")}
                                disabled={isUpdating}
                            >
                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Square className="w-5 h-5 mr-2" />
                                        Complete Delivery
                                    </>
                                )}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            className="w-full text-xs text-muted-foreground"
                            onClick={() => fetchActiveTrip()}
                        >
                            Refresh Status
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveTrip;
