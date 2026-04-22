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
    FileCheck,
    Clock,
    CheckCircle2
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import api from "@/lib/api";
import ProviderProfileDialog from "@/components/dashboard/admin/ProviderProfileDialog";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

const CarrierShipmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
    const [shipperProfileOpen, setShipperProfileOpen] = useState(false);
    const [selectedShipperId, setSelectedShipperId] = useState<string | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    const openLightbox = (image: string) => {
        setSelectedImage(image);
        setLightboxOpen(true);
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
            <div className="max-w-5xl mx-auto space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full w-12 h-12 shrink-0 border-border/60 hover:bg-muted/50 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-display font-black tracking-tight">Shipment Details</h1>
                                <Badge className={`${isCompleted ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"} border-0 font-black px-2.5 py-0.5 uppercase tracking-widest text-[9px]`}>
                                    {booking.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Logistics overview for Load <span className="text-foreground font-bold">#{booking.id.split('-')[0]}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-0 border-border/60 rounded-3xl overflow-hidden shadow-sm shadow-black/[0.02]">
                            <div className="p-8 md:p-10 space-y-12">
                                {/* Route Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <MapPin className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Logistics Path</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Origin</p>
                                            <div className="space-y-0.5">
                                                <p className="text-lg font-bold text-foreground leading-tight">{booking.pickup_address}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{booking.pickup_city}, {booking.pickup_state} {booking.pickup_zip}</p>
                                            </div>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                                                <p className="text-xs font-bold text-foreground/80">
                                                    {new Date(booking.shipment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 relative">
                                            <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-px bg-border/40" />
                                            <p className="text-[9px] font-black uppercase tracking-widest text-green-600/70">Destination</p>
                                            <div className="space-y-0.5">
                                                <p className="text-lg font-bold text-foreground leading-tight">{booking.delivery_address}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{booking.delivery_city}, {booking.delivery_state} {booking.delivery_zip}</p>
                                            </div>

                                        </div>
                                    </div>
                                </section>

                                {/* Cargo Section */}
                                <section className="pt-10 border-t border-border/40">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Package className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Load Specifications</h3>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Net Weight</p>
                                            <p className="text-sm font-black text-foreground">{Number(booking.weight_lbs).toLocaleString()} <span className="text-xs font-bold text-muted-foreground uppercase">{booking.weight_unit || 'lbs'}</span></p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Cargo Type</p>
                                            <p className="text-sm font-black text-foreground">{booking.cargo_type}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Escort</p>
                                            <p className={`text-sm font-black ${booking.requires_escort === 1 ? 'text-orange-600' : 'text-foreground'}`}>
                                                {booking.requires_escort === 1 ? 'REQUIRED' : 'NOT REQ'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Dimensions</p>
                                            <p className="text-xs font-black text-foreground">
                                                {booking.dimensions_length_ft}L × {booking.dimensions_width_ft}W × {booking.dimensions_height_ft}H
                                            </p>
                                        </div>
                                    </div>

                                    {booking.special_instructions && (
                                        <div className="mt-10 p-6 bg-primary/[0.02] border border-dashed border-primary/20 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2">Special Handling Instructions</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">"{booking.special_instructions}"</p>
                                        </div>
                                    )}
                                </section>

                                {/* Stakeholders Section */}
                                <section className="pt-10 border-t border-border/40">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Primary Shipper</p>
                                            <button
                                                onClick={() => handleOpenShipperProfile(booking.shipper_id)}
                                                className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary text-sm font-black shadow-sm group-hover:scale-110 transition-transform">
                                                        {booking.shipper_name?.charAt(0)}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold text-foreground">{booking.shipper_name}</p>
                                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Verified Client</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                            </button>
                                        </div>

                                        {booking.driver_name && (
                                            <div className="flex-1 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Assigned Driver</p>
                                                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-primary/5 border border-primary/10">
                                                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-black shadow-sm">
                                                        {booking.driver_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-primary">{booking.driver_name}</p>
                                                        <p className="text-[9px] text-primary/60 font-bold uppercase tracking-tighter">{booking.driver_phone || 'In-Transit Partner'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </Card>

                        {isCompleted && (
                            <Card className="p-10 space-y-12 border-green-500/20 bg-green-500/[0.01] rounded-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-green-500/10 rounded-xl shadow-sm">
                                        <FileCheck className="text-green-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight">Proof of Delivery</h3>
                                        <p className="text-xs text-muted-foreground font-medium">Digital authentication records</p>
                                    </div>
                                </div>

                                {booking.delivery_photos && (
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Camera size={14} className="text-green-600" /> Site Documentation
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {(() => {
                                                try {
                                                    const photos = typeof booking.delivery_photos === 'string'
                                                        ? JSON.parse(booking.delivery_photos)
                                                        : booking.delivery_photos;

                                                    return Array.isArray(photos) && photos.map((photo: string, idx: number) => (
                                                        <div 
                                                            key={idx} 
                                                            className="aspect-video rounded-2xl overflow-hidden bg-muted group relative border border-border/40 shadow-sm transition-all hover:shadow-md cursor-pointer"
                                                            onClick={() => openLightbox(photo)}
                                                        >
                                                            <img
                                                                src={photo}
                                                                alt={`Delivery ${idx + 1}`}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <Eye className="text-white w-6 h-6" />
                                                            </div>
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return <p className="text-sm text-muted-foreground">Error loading photos</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-border/40">
                                    <div className="space-y-6">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Signatory Name</p>
                                            <p className="text-lg font-bold text-foreground">{booking.receiver_name || 'Not logged'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</p>
                                            <p className="text-sm font-bold text-foreground">
                                                {booking.updated_at
                                                    ? new Date(booking.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                                                    : 'TBD'}
                                            </p>
                                        </div>
                                    </div>
                                    {booking.delivery_signature && (
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <Pencil size={14} className="text-green-600" /> Digital Auth
                                            </p>
                                            <div 
                                                className="bg-white rounded-2xl border border-border/40 p-4 flex items-center justify-center shadow-sm cursor-pointer hover:bg-muted/30 transition-colors"
                                                onClick={() => openLightbox(booking.delivery_signature)}
                                            >
                                                <img
                                                    src={booking.delivery_signature}
                                                    alt="Receiver Signature"
                                                    className="max-h-20 object-contain opacity-80"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-8">
                        <Card className="p-8 border-border/60 rounded-3xl shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl" />
                            <h3 className="font-black text-[9px] uppercase tracking-widest text-muted-foreground mb-6">Financial Overview</h3>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Total Settlement</p>
                                    <p className="text-3xl font-black text-foreground tracking-tighter">
                                        {(booking.agreed_price || booking.amount)
                                            ? `$${Number(booking.agreed_price || booking.amount).toLocaleString()}`
                                            : "PENDING"}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px] border ${isCompleted ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                    "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    }`}>
                                    {isCompleted ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                    {booking.status.replace('_', ' ')}
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

            <ImageLightbox
                src={selectedImage}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </DashboardLayout>
    );
};

export default CarrierShipmentDetail;
