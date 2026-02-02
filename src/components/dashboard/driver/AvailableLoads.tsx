import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    MapPin,
    Navigation,
    Clock,
    RefreshCw,
    Search,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";

interface LoadRequest {
    id: string;
    cargoName: string;
    weight: string;
    status: string;
    origin: { city: string; state: string };
    destination: { city: string; state: string };
    distance: string;
    estimatedTime: string;
}

const getStatusBadge = (weight: number) => {
    if (weight > 80000) {
        return <Badge className="bg-amber-500/10 text-amber-600 border-0 text-xs">Overweight</Badge>;
    }
    if (weight > 40000) {
        return <Badge className="bg-primary/10 text-primary border-0 text-xs">Heavy Load</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground border-0 text-xs">Standard</Badge>;
};

const AvailableLoads = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<LoadRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLoads = async (silent = false) => {
        if (!silent) setLoading(true);
        else setIsRefreshing(true);

        try {
            const response = await api.get("/drivers/available-loads");
            if (response.data.success) {
                const mapped = response.data.data.map((b: any) => ({
                    id: b.id,
                    cargoName: b.cargo_type,
                    weight: `${b.weight_lbs.toLocaleString()} lbs`,
                    weight_val: b.weight_lbs,
                    status: b.status,
                    origin: { city: b.pickup_city, state: b.pickup_state },
                    destination: { city: b.delivery_city, state: b.delivery_state },
                    distance: "Calculating...", // We don't have distance in DB yet
                    estimatedTime: b.shipment_date ? new Date(b.shipment_date).toLocaleDateString() : "TBD",
                }));
                setRequests(mapped);
            }
        } catch (error) {
            toast.error("Failed to load available loads");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLoads();
    }, []);

    const handleRefresh = () => {
        fetchLoads(true);
    };

    const filteredRequests = requests.filter(r =>
        r.cargoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Fetching assigned loads...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">Available Loads</h1>
                    <p className="text-muted-foreground">Loads assigned to you that are ready to start</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search loads..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        className={isRefreshing ? "animate-spin" : ""}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequests.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                        <p className="font-medium text-lg mb-1">No new loads assigned</p>
                        <p className="text-sm">When your carrier assigns you a load and it's approved by admin, it will appear here.</p>
                    </div>
                ) : (
                    filteredRequests.map((request) => (
                        <Card
                            key={request.id}
                            className="p-6 hover:border-primary/50 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{request.cargoName}</h3>
                                        {getStatusBadge((request as any).weight_val)}
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                                        ID: #{request.id.split('-')[0]} • {request.weight}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Pickup</p>
                                        <p className="font-semibold">{request.origin.city}, {request.origin.state}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Delivery</p>
                                        <p className="font-semibold">{request.destination.city}, {request.destination.state}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-bold">
                                        <Clock className="w-4 h-4" />
                                        {request.estimatedTime}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => navigate(`/dashboard/driver/request/${request.id}`)}
                                    className="gap-2"
                                    size="sm"
                                >
                                    View Details
                                    <Navigation className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AvailableLoads;
