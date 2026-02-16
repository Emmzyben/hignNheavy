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
    TrendingUp,
    Clock,
    CheckCircle2,
    Truck,
    Car,
    Info
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import api from "@/lib/api";
import ProviderProfileDialog from "@/components/dashboard/admin/ProviderProfileDialog";

const statusConfig: Record<string, { label: string; color: string }> = {
    "pending_quote": { label: "Awaiting Quotes", color: "bg-blue-100 text-blue-800" },
    "quoted": { label: "Quotes Received", color: "bg-purple-100 text-purple-800" },
    "booked": { label: "Booked", color: "bg-green-100 text-green-800" },
    "in_transit": { label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
    "delivered": { label: "Delivered", color: "bg-teal-100 text-teal-800" },
    "completed": { label: "Completed", color: "bg-gray-100 text-gray-800" },
    "cancelled": { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const AdminBookingDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loadingQuotes, setLoadingQuotes] = useState(false);
    const [providerProfileOpen, setProviderProfileOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

    // Assignment state
    const [selectedCarrierQuote, setSelectedCarrierQuote] = useState<string>("");
    const [selectedEscortQuote, setSelectedEscortQuote] = useState<string>("");
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/bookings/${id}`);
                if (response.data.success) {
                    setBooking(response.data.data);
                    fetchQuotes();
                }
            } catch (error) {
                toast.error("Failed to fetch booking details");
            } finally {
                setLoading(false);
            }
        };

        const fetchQuotes = async () => {
            setLoadingQuotes(true);
            try {
                const response = await api.get(`/quotes/booking/${id}`);
                if (response.data.success) {
                    setQuotes(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load quotes");
            } finally {
                setLoadingQuotes(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleOpenProviderProfile = (providerId: string) => {
        setSelectedProviderId(providerId);
        setProviderProfileOpen(true);
    };

    const handleAssign = async () => {
        if (!booking || !selectedCarrierQuote) {
            toast.error("Please select a carrier quote");
            return;
        }

        if (booking.requires_escort && !selectedEscortQuote) {
            if (!confirm("This booking requires an escort but none is selected. Proceed anyway?")) {
                return;
            }
        }

        setIsAssigning(true);
        try {
            const response = await api.post("/admin/assign-providers", {
                booking_id: booking.id,
                carrier_quote_id: selectedCarrierQuote,
                escort_quote_id: selectedEscortQuote || null
            });

            if (response.data.success) {
                toast.success("Providers assigned successfully!");
                window.location.reload();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to assign providers");
        } finally {
            setIsAssigning(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout activeSection="bookings">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader size="lg" text="Fetching Record..." />
                </div>
            </DashboardLayout>
        );
    }

    if (!booking) {
        return (
            <DashboardLayout activeSection="bookings">
                <div className="text-center py-20">
                    <p className="text-muted-foreground">Booking details not found</p>
                    <Button onClick={() => navigate(-1)} variant="link">Go Back</Button>
                </div>
            </DashboardLayout>
        );
    }

    const carrierQuotes = quotes.filter(q => q.role === 'carrier');
    const escortQuotes = quotes.filter(q => q.role === 'escort');
    const isCompleted = booking.status === 'delivered' || booking.status === 'completed';
    const isUnmatched = booking.status === 'pending_quote' || booking.status === 'quoted';

    return (
        <DashboardLayout activeSection="bookings">
            <div className="max-w-5xl mx-auto space-y-6 pb-20 relative">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-display font-bold">Booking Details</h1>
                            <Badge className={`${statusConfig[booking.status]?.color || "bg-gray-100"} border-0 px-3 py-1 text-xs uppercase font-bold tracking-wider`}>
                                {statusConfig[booking.status]?.label || booking.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium">
                            Administrative overview and quote management
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-8">
                            <div className="flex items-start justify-between mb-8 pb-6 border-b">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{booking.cargo_type}</h2>
                                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">ID: #{booking.id.split('-')[0]} • Created {new Date(booking.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="flex flex-col items-end">
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Carrier Partner</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">{booking.carrier_name || "Awaiting Match"}</p>
                                            {booking.carrier_id && (
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleOpenProviderProfile(booking.carrier_id)}>
                                                    <ExternalLink size={12} className="text-primary" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {booking.escort_id && (
                                        <div className="flex flex-col items-end pt-2 border-t border-muted">
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Escort Partner</p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold">{booking.escort_name}</p>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleOpenProviderProfile(booking.escort_id)}>
                                                    <ExternalLink size={12} className="text-primary" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" /> Route Details
                                        </p>
                                        <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted-foreground/20">
                                            <div className="flex gap-4 relative z-10">
                                                <div className="w-[20px] h-[20px] rounded-full bg-primary border-4 border-background shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground font-black uppercase">Pickup Location</p>
                                                    <p className="font-bold text-sm leading-tight">{booking.pickup_address}</p>
                                                    <p className="text-xs text-muted-foreground">{booking.pickup_city}, {booking.pickup_state} {booking.pickup_zip}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 relative z-10">
                                                <div className="w-[20px] h-[20px] rounded-full bg-green-600 border-4 border-background shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground font-black uppercase">Delivery Destination</p>
                                                    <p className="font-bold text-sm leading-tight">{booking.delivery_address}</p>
                                                    <p className="text-xs text-muted-foreground">{booking.delivery_city}, {booking.delivery_state} {booking.delivery_zip}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                                            <Package className="w-3.5 h-3.5" /> Specifications
                                        </p>
                                        <div className="p-4 bg-muted/20 rounded-xl border space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground font-medium">Dimension:</span>
                                                <span className="font-bold">{booking.dimensions_length_ft}'L x {booking.dimensions_width_ft}'W x {booking.dimensions_height_ft}'H</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground font-medium">Gross Weight:</span>
                                                <span className="font-bold font-mono">{Number(booking.weight_lbs).toLocaleString()} LBS</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs pt-2 border-t">
                                                <span className="text-muted-foreground font-medium">Escort:</span>
                                                <Badge variant={booking.requires_escort === 1 ? "default" : "outline"} className="scale-[0.8] origin-right">
                                                    {booking.requires_escort === 1 ? 'MANDATORY' : 'NOT REQ'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" /> Timeline
                                        </p>
                                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase">Target Shipment Date</p>
                                                <p className="font-bold text-sm">{new Date(booking.shipment_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t space-y-6">
                                <div>
                                    <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Customer Profile
                                    </p>
                                    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border group hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                                                {booking.shipper_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm group-hover:text-primary transition-colors">{booking.shipper_name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Primary Shipper</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleOpenProviderProfile(booking.shipper_id)}>
                                            View Account <ExternalLink size={12} className="ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-8">
                            {/* Carrier Quotes */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Truck className="text-primary" />
                                    Carrier Bids
                                    <Badge variant="secondary" className="rounded-full px-2.5">{carrierQuotes.length}</Badge>
                                </h3>

                                {loadingQuotes ? (
                                    <div className="flex justify-center p-12"><Loader size="md" text="Loading Bids..." /></div>
                                ) : carrierQuotes.length === 0 ? (
                                    <div className="text-center p-12 bg-muted/10 rounded-2xl border-2 border-dashed border-muted/50">
                                        <p className="text-muted-foreground text-sm">No carrier bids submitted for this booking.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {carrierQuotes.map((quote) => (
                                            <Card
                                                key={quote.id}
                                                className={`p-6 transition-all relative cursor-pointer hover:shadow-md ${selectedCarrierQuote === quote.id ? 'ring-2 ring-primary bg-primary/5' : ''} ${quote.status === 'accepted' ? 'border-green-500 bg-green-50/10' : ''}`}
                                                onClick={() => isUnmatched && setSelectedCarrierQuote(quote.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black group-hover:bg-primary/10 transition-colors">
                                                            {quote.carrier_name?.charAt(0) || quote.full_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg">{quote.carrier_name || quote.full_name}</p>
                                                            <p className="text-xs text-muted-foreground font-medium">{quote.company_name || "Carrier Partner"}</p>
                                                            <div className="flex gap-2 mt-2">
                                                                <Badge variant="outline" className="text-[10px] py-0">{quote.driver_name || 'Generic Driver'}</Badge>
                                                                <Badge variant="outline" className="text-[10px] py-0">{quote.vehicle_name || 'Main Unit'}</Badge>
                                                            </div>
                                                            <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-2" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenProviderProfile(quote.provider_id);
                                                            }}>
                                                                View Profile
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-display font-black text-green-600">${parseFloat(quote.amount).toLocaleString()}</p>
                                                        {quote.status === 'accepted' && (
                                                            <Badge className="bg-green-500 hover:bg-green-600 border-0 flex items-center gap-1 mt-1">
                                                                <CheckCircle2 size={10} /> WINNING BID
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Escort Quotes if needed */}
                            {booking.requires_escort === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <Car className="text-purple-600" />
                                        Escort Bids
                                        <Badge variant="secondary" className="rounded-full px-2.5">{escortQuotes.length}</Badge>
                                    </h3>

                                    {loadingQuotes ? (
                                        <div className="flex justify-center p-12"><Loader size="md" text="Loading Bids..." /></div>
                                    ) : escortQuotes.length === 0 ? (
                                        <div className="text-center p-12 bg-muted/10 rounded-2xl border-2 border-dashed border-muted/50">
                                            <p className="text-muted-foreground text-sm">No escort bids submitted yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {escortQuotes.map((quote) => (
                                                <Card
                                                    key={quote.id}
                                                    className={`p-6 transition-all relative cursor-pointer hover:shadow-md ${selectedEscortQuote === quote.id ? 'ring-2 ring-purple-600 bg-purple-50/10' : ''} ${quote.status === 'accepted' ? 'border-green-500 bg-green-50/10' : ''}`}
                                                    onClick={() => isUnmatched && setSelectedEscortQuote(quote.id)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black group-hover:bg-purple-10/10 transition-colors">
                                                                {quote.full_name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-lg">{quote.full_name}</p>
                                                                <p className="text-xs text-muted-foreground font-medium">{quote.company_name || "Escort Professional"}</p>
                                                                <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-2" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenProviderProfile(quote.provider_id);
                                                                }}>
                                                                    View Profile
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-3xl font-display font-black text-purple-600">${parseFloat(quote.amount).toLocaleString()}</p>
                                                            {quote.status === 'accepted' && (
                                                                <Badge className="bg-green-500 hover:bg-green-600 border-0 flex items-center gap-1 mt-1">
                                                                    <CheckCircle2 size={10} /> ASSIGNED
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Shield className="text-primary w-5 h-5" /> Administrative
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-muted-foreground font-bold uppercase mb-3">Status Monitoring</p>
                                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${isCompleted ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                                        <Info className={isCompleted ? 'text-green-600' : 'text-blue-600'} size={20} />
                                        <div>
                                            <p className={`text-sm font-bold ${isCompleted ? 'text-green-900' : 'text-blue-900'}`}>
                                                System Message
                                            </p>
                                            <p className={`text-[10px] font-medium ${isCompleted ? 'text-green-800/70' : 'text-blue-800/70'}`}>
                                                {isCompleted ? 'All delivery records are finalized and archived.' : 'Monitoring active quotes for placement.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>



                                <div className="pt-6 border-t font-mono text-[10px] text-muted-foreground space-y-1 opacity-60">
                                    <p>UUID: {booking.id}</p>
                                    <p>CREATED: {booking.created_at}</p>
                                    <p>ROLE: ADMIN_SECURED</p>
                                </div>
                            </div>
                        </Card>

                        {isCompleted && (
                            <Card className="p-6 border-green-200 bg-green-50/20">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <FileCheck className="text-green-600 w-5 h-5" /> Evidence Log
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-white rounded-xl border space-y-2 shadow-sm">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Receiver Identity</p>
                                        <p className="text-sm font-bold">{booking.receiver_name || 'Not logged'}</p>
                                    </div>

                                    {booking.delivery_photos && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                <Camera size={12} /> Delivery Photos
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(() => {
                                                    try {
                                                        const photos = typeof booking.delivery_photos === 'string'
                                                            ? JSON.parse(booking.delivery_photos)
                                                            : booking.delivery_photos;

                                                        return Array.isArray(photos) && photos.map((photo: string, idx: number) => (
                                                            <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-muted group relative border">
                                                                <img
                                                                    src={photo}
                                                                    alt={`Delivery ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <a
                                                                    href={photo}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                                >
                                                                    <Eye className="text-white" size={16} />
                                                                </a>
                                                            </div>
                                                        ));
                                                    } catch (e) {
                                                        return <p className="text-[10px] text-muted-foreground">Error loading photos</p>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                    {booking.delivery_signature && (
                                        <div className="p-3 bg-white rounded-xl border space-y-2 shadow-sm">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                <Pencil size={12} /> Digital Sign
                                            </p>
                                            <div className="h-20 flex items-center justify-center bg-muted/20 rounded-lg">
                                                <img src={booking.delivery_signature} className="max-h-full" alt="signature" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Sticky Assignment Footer */}
                {isUnmatched && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t p-6 lg:pl-[280px]">
                        <div className="max-w-5xl mx-auto flex items-center justify-between gap-8">
                            <div className="hidden md:block">
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Projected Total Cost</p>
                                <p className="text-3xl font-black">
                                    ${(
                                        (selectedCarrierQuote ? parseFloat(carrierQuotes.find(q => q.id === selectedCarrierQuote)?.amount || 0) : 0) +
                                        (selectedEscortQuote ? parseFloat(escortQuotes.find(q => q.id === selectedEscortQuote)?.amount || 0) : 0)
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex-1 max-w-lg space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Matches Selected</p>
                                <div className="flex gap-2">
                                    <Badge variant={selectedCarrierQuote ? 'default' : 'outline'} className="h-6">
                                        Carrier: {selectedCarrierQuote ? 'SELECT' : 'NONE'}
                                    </Badge>
                                    {booking.requires_escort === 1 && (
                                        <Badge variant={selectedEscortQuote ? 'secondary' : 'outline'} className="h-6">
                                            Escort: {selectedEscortQuote ? 'SELECT' : 'NONE'}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button
                                className="h-14 px-12 font-black text-lg bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20 rounded-2xl"
                                onClick={handleAssign}
                                disabled={isAssigning || !selectedCarrierQuote}
                            >
                                {isAssigning ? <Loader size="sm" text="" /> : <CheckCircle2 className="mr-3" />}
                                FINALIZE MATCHING
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ProviderProfileDialog
                providerId={selectedProviderId}
                open={providerProfileOpen}
                onOpenChange={setProviderProfileOpen}
            />
        </DashboardLayout>
    );
};

export default AdminBookingDetail;
