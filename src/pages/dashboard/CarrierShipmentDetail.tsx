import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Package,
    Shield,
    Loader2,
    User,
    ExternalLink,
    Camera,
    Pencil,
    Eye,
    FileCheck
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import api from "@/lib/api";
import ProviderProfileDialog from "@/components/dashboard/admin/ProviderProfileDialog";

const CarrierShipmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
    const [shipperProfileOpen, setShipperProfileOpen] = useState(false);
    const [selectedShipperId, setSelectedShipperId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/bookings/${id}`);
                if (response.data.success) {
                    setBooking(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch shipment details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleOpenShipperProfile = (shipperId: string) => {
        setSelectedShipperId(shipperId);
        setShipperProfileOpen(true);
    };

    if (loading) {
        return (
            <DashboardLayout activeSection="loads">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader size="lg" text="Fetching Shipment..." />
                </div>
            </DashboardLayout>
        );
    }

    if (!booking) {
        return (
            <DashboardLayout activeSection="loads">
                <div className="text-center py-20">
                    <p className="text-muted-foreground">Shipment details not found</p>
                    <Button onClick={() => navigate(-1)} variant="link">Go Back</Button>
                </div>
            </DashboardLayout>
        );
    }

    const isCompleted = booking.status === 'delivered' || booking.status === 'completed';

    return (
        <DashboardLayout activeSection="loads">
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
                        <h1 className="text-3xl font-display font-bold">Shipment Details</h1>
                        <p className="text-muted-foreground font-medium">
                            Complete technical and logistical overview of the load
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{booking.cargo_type}</h2>
                                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">ID: #{booking.id.split('-')[0]}</p>
                                </div>
                                <Badge className={`${isCompleted ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"} border-0 font-bold px-4 py-1.5 uppercase tracking-wider text-xs`}>
                                    {booking.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-3">Route Details</p>
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-bold uppercase">Pickup Point</p>
                                                    <p className="font-bold">{booking.pickup_address}</p>
                                                    <p className="text-sm text-muted-foreground">{booking.pickup_city}, {booking.pickup_state} {booking.pickup_zip}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-bold uppercase">Delivery Point</p>
                                                    <p className="font-bold">{booking.delivery_address}</p>
                                                    <p className="text-sm text-muted-foreground">{booking.delivery_city}, {booking.delivery_state} {booking.delivery_zip}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-3">Shipment Timeline</p>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-bold uppercase">Dispatch Date</p>
                                                <p className="font-bold">{new Date(booking.shipment_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-3">Cargo Information</p>
                                        <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground font-medium">Type:</span>
                                                <span className="font-bold">{booking.cargo_type}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground font-medium">Net Weight:</span>
                                                <span className="font-bold">{Number(booking.weight_lbs).toLocaleString()} lbs</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground font-medium">Dimensions (LxWxH):</span>
                                                <span className="font-bold text-xs">{booking.dimensions_length_ft}' x {booking.dimensions_width_ft}' x {booking.dimensions_height_ft}'</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
                                                <span className="text-muted-foreground font-medium">Escort Required:</span>
                                                <Badge variant={booking.requires_escort === 1 ? "default" : "outline"} className="scale-75 origin-right">
                                                    {booking.requires_escort === 1 ? 'YES' : 'NO'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-3">Special Handling</p>
                                        <p className="text-sm italic text-muted-foreground p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                                            {booking.special_instructions || "No special instructions provided by shipper."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border">
                                <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-4">Contact Information</p>
                                <button
                                    onClick={() => handleOpenShipperProfile(booking.shipper_id)}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group w-full"
                                >
                                    <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Shipper</p>
                                        <p className="font-bold group-hover:text-primary transition-colors">{booking.shipper_name}</p>
                                    </div>
                                    <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </Card>

                        {isCompleted && (
                            <Card className="p-8 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-500/10 rounded-xl">
                                        <FileCheck className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Proof of Delivery</h3>
                                        <p className="text-sm text-muted-foreground font-medium">Digital records and validation of handover</p>
                                    </div>
                                </div>

                                {booking.delivery_photos && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Camera size={14} /> Delivery Photos
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {(() => {
                                                try {
                                                    const photos = typeof booking.delivery_photos === 'string'
                                                        ? JSON.parse(booking.delivery_photos)
                                                        : booking.delivery_photos;

                                                    return Array.isArray(photos) && photos.map((photo: string, idx: number) => (
                                                        <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-muted group relative border shadow-sm">
                                                            <img
                                                                src={photo}
                                                                alt={`Delivery ${idx + 1}`}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <a
                                                                href={photo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                                <Eye className="text-white" size={24} />
                                                            </a>
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return <p className="text-sm text-muted-foreground">Error loading photos</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Signatory Name</p>
                                            <p className="text-xl font-bold">{booking.receiver_name || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Delivery Timestamp</p>
                                            <p className="font-bold">
                                                {booking.updated_at
                                                    ? new Date(booking.updated_at).toLocaleString()
                                                    : 'TBD'}
                                            </p>
                                        </div>
                                    </div>
                                    {booking.delivery_signature && (
                                        <div className="space-y-4 text-center md:text-left">
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                                                <Pencil size={14} /> Digital Signature
                                            </p>
                                            <div className="bg-white rounded-xl border border-border p-6 shadow-inner ring-4 ring-muted/20">
                                                <img
                                                    src={booking.delivery_signature}
                                                    alt="Receiver Signature"
                                                    className="max-h-32 mx-auto object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4">Financials</h3>
                            <div className="space-y-4 text-center">
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Agreed Price</p>
                                    <p className="text-3xl font-display font-bold text-primary">
                                        {(booking.agreed_price || booking.amount)
                                            ? `$${Number(booking.agreed_price || booking.amount).toLocaleString()}`
                                            : "PENDING"}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl font-bold uppercase tracking-widest text-xs border ${isCompleted ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                    "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    }`}>
                                    Status: {booking.status.replace('_', ' ')}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-muted/30 border-dashed border-2">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-background rounded-xl shadow-sm">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Carrier Security</p>
                                    <p className="text-[11px] leading-relaxed text-muted-foreground mt-1">This shipment is tracked in real-time. Ensure GPS monitoring is active throughout the journey.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <ProviderProfileDialog
                providerId={selectedShipperId}
                open={shipperProfileOpen}
                onOpenChange={setShipperProfileOpen}
            />
        </DashboardLayout>
    );
};

export default CarrierShipmentDetail;
