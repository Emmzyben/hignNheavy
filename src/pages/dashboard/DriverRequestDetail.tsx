import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    Navigation as NavigationIcon,
    Clock,
    Weight,
    Shield,
    Box,
    Loader2
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import api from "@/lib/api";

const DriverRequestDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isAccepting, setIsAccepting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState<any>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // We use the same get booking by ID but need to ensure it's available
                // For now, let's fetch all available loads and find this one, or just assume there's a specific route
                // Actually, our API has /api/bookings/:id (wait, let's check)
                const response = await api.get(`/bookings/my-bookings`);
                if (response.data.success) {
                    const found = response.data.data.find((b: any) => b.id === id);
                    if (found) {
                        const photos = found.delivery_photos ? (typeof found.delivery_photos === 'string' ? JSON.parse(found.delivery_photos) : found.delivery_photos) : [];
                        setRequest({
                            id: found.id,
                            cargoName: found.cargo_type,
                            weight: `${found.weight_lbs.toLocaleString()} lbs`,
                            dimensions: `${found.dimensions_length_ft}ft x ${found.dimensions_width_ft}ft x ${found.dimensions_height_ft}ft`,
                            status: found.status,
                            origin: { city: found.pickup_city, state: found.pickup_state, address: found.pickup_address },
                            destination: { city: found.delivery_city, state: found.delivery_state, address: found.delivery_address },
                            distance: "Calculating...",
                            duration: new Date(found.shipment_date).toLocaleDateString(),
                            deliveryPhotos: photos,
                            deliverySignature: found.delivery_signature,
                            receiverName: found.receiver_name,
                            updatedAt: found.updated_at
                        });
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch load details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            const response = await api.post(`/drivers/accept-load/${id}`);
            if (response.data.success) {
                toast.success("Load Accepted! You are now in transit.");
                navigate("/dashboard/driver?section=active");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to accept load");
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDecline = () => {
        toast.info("Request Declined");
        navigate("/dashboard/driver?section=requests");
    };

    if (loading) {
        return (
            <DashboardLayout activeSection="requests">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader size="lg" text="Processing Request..." />
                </div>
            </DashboardLayout>
        );
    }

    if (!request) {
        return (
            <DashboardLayout activeSection="requests">
                <div className="text-center py-20">
                    <p className="text-muted-foreground">Load details not found</p>
                    <Button onClick={() => navigate(-1)} variant="link">Go Back</Button>
                </div>
            </DashboardLayout>
        );
    }

    const isCompleted = request.status === "delivered" || request.status === "completed";
    const isInTransit = request.status === "in_transit";
    const isBooked = request.status === "booked";

    return (
        <DashboardLayout activeSection={isCompleted ? "trips" : isBooked ? "requests" : "active"}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-bold">Trip Details</h1>
                        <p className="text-muted-foreground font-medium">
                            {isCompleted ? "Successfully delivered and closed" : isBooked ? "Review and accept your assignment" : "Currently in transit"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{request.cargoName}</h2>
                                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">ID: #{request.id.split('-')[0]}</p>
                                </div>
                                <Badge className={`${isCompleted ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"} border-0 font-bold px-4 py-1.5 uppercase tracking-wider text-xs`}>
                                    {request.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="space-y-8 relative ml-4 mb-8">
                                <div className="absolute left-0 top-2 bottom-2 w-px bg-border border-dashed border-l-2 ml-[5px]" />

                                <div className="relative flex items-start gap-6">
                                    <div className="w-3 h-3 rounded-full bg-primary mt-1.5 z-10 ring-4 ring-background" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Pickup</p>
                                        <p className="font-bold text-xl">{request.origin.city}, {request.origin.state}</p>
                                        <p className="text-muted-foreground">{request.origin.address}</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start gap-6">
                                    <div className="w-3 h-3 rounded-full bg-secondary mt-1.5 z-10 ring-4 ring-background" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Delivery</p>
                                        <p className="font-bold text-xl">{request.destination.city}, {request.destination.state}</p>
                                        <p className="text-muted-foreground">{request.destination.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
                                <div>
                                    <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-tighter">Distance</p>
                                    <div className="flex items-center gap-2">
                                        <NavigationIcon className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-xs">{request.distance}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-tighter">Date</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-xs">{request.duration}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-tighter">Weight</p>
                                    <div className="flex items-center gap-2">
                                        <Weight className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-xs">{request.weight}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-tighter">Dimensions</p>
                                    <div className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-[10px]">{request.dimensions}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {isCompleted && (
                            <Card className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Delivery Proof</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {request.deliveryPhotos.map((photo: string, idx: number) => (
                                            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-border">
                                                <img src={photo} alt={`Delivery Proof ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                                    <div className="space-y-4">
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Receiver Name</p>
                                        <p className="text-xl font-bold">{request.receiverName}</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Delivered On</p>
                                        <p className="text-sm font-medium">{new Date(request.updatedAt).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Signature</p>
                                        <div className="border border-border rounded-xl p-4 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                            <img src={request.deliverySignature} alt="Signature" className="max-h-32 mx-auto object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="p-6 bg-muted/30 border-dashed">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-background rounded-xl shadow-sm">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Insurance & Safety</p>
                                    <p className="text-sm font-medium">This load is fully covered by carrier liability insurance. Safety permits are required and provided by your employer.</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4">Status</h3>
                            <div className="space-y-3">
                                {isBooked ? (
                                    <>
                                        <Button
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg"
                                            onClick={handleAccept}
                                            disabled={isAccepting}
                                        >
                                            {isAccepting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Trip"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 font-bold"
                                            onClick={handleDecline}
                                            disabled={isAccepting}
                                        >
                                            Decline
                                        </Button>
                                    </>
                                ) : isInTransit ? (
                                    <Button
                                        className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg shadow-lg"
                                        onClick={() => navigate(`/dashboard/driver/complete-delivery?bookingId=${request.id}`)}
                                    >
                                        End Trip & Deliver
                                    </Button>
                                ) : isCompleted ? (
                                    <div className="p-4 bg-green-500/10 rounded-xl text-center">
                                        <p className="text-green-600 font-bold uppercase tracking-widest text-xs">Job Completed</p>
                                        <p className="text-[10px] text-green-500/70 mt-1">Proof of delivery captured successfully</p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-muted rounded-xl text-center font-bold text-muted-foreground uppercase tracking-widest text-xs">
                                        {request.status}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {isBooked && (
                            <p className="text-xs text-center text-muted-foreground px-4">
                                By starting this trip, you confirm you have inspected the load and the vehicle is ready for transport.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DriverRequestDetail;
