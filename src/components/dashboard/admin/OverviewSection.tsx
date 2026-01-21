import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users, Truck, Car, Package,
    TrendingUp, AlertCircle, Loader2,
    MapPin, Calendar, ChevronRight, Info,
    CheckCircle2,
    User
} from "lucide-react";
import ProviderProfileDialog from "./ProviderProfileDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "sonner";

interface OverviewSectionProps {
    setActiveSection: (section: string) => void;
}

const OverviewSection = ({ setActiveSection }: OverviewSectionProps) => {
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Assignment Dialog State
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loadingQuotes, setLoadingQuotes] = useState(false);
    const [selectedCarrierQuote, setSelectedCarrierQuote] = useState<string>("");
    const [selectedEscortQuote, setSelectedEscortQuote] = useState<string>("");
    const [isAssigning, setIsAssigning] = useState(false);
    const [viewProviderId, setViewProviderId] = useState<string | null>(null);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/stats");
            if (response.data.success) {
                setStatsData(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleOpenAssignment = async (booking: any) => {
        setSelectedBooking(booking);
        setDetailsOpen(true);
        setLoadingQuotes(true);
        setSelectedCarrierQuote("");
        setSelectedEscortQuote("");
        try {
            const response = await api.get(`/quotes/booking/${booking.id}`);
            if (response.data.success) {
                setQuotes(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load quotes");
        } finally {
            setLoadingQuotes(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedBooking || !selectedCarrierQuote) {
            toast.error("Please select a carrier quote");
            return;
        }

        setIsAssigning(true);
        try {
            const response = await api.post("/admin/assign-providers", {
                booking_id: selectedBooking.id,
                carrier_quote_id: selectedCarrierQuote,
                escort_quote_id: selectedEscortQuote || null
            });

            if (response.data.success) {
                toast.success("Assignment complete!");
                setDetailsOpen(false);
                fetchStats(); // Refresh to update latest bookings and stats
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Assignment failed");
        } finally {
            setIsAssigning(false);
        }
    };

    const stats = [
        { label: "Total Shippers", value: statsData?.shippers || "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", section: "shippers" },
        { label: "Active Carriers", value: statsData?.carriers || "0", icon: Truck, color: "text-green-500", bg: "bg-green-500/10", section: "carriers" },
        { label: "Escort Drivers", value: statsData?.escorts || "0", icon: Car, color: "text-purple-500", bg: "bg-purple-500/10", section: "escorts" },
        { label: "Total Bookings", value: statsData?.bookings || "0", icon: Package, color: "text-orange-500", bg: "bg-orange-500/10", section: "bookings" },
    ];

    if (loading && !statsData) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const carrierQuotes = quotes.filter(q => q.role === 'carrier');
    const escortQuotes = quotes.filter(q => q.role === 'escort');

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setActiveSection(stat.section)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={stat.bg + " p-3 rounded-xl"}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Latest Booking Requests */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-lg">Latest Booking Requests</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection("quotes")}>View All Market</Button>
                </div>
                <div className="divide-y divide-border">
                    {statsData?.latestUnmatched?.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No pending booking requests found.
                        </div>
                    ) : statsData?.latestUnmatched?.map((booking: any) => (
                        <div key={booking.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-sm md:text-base">{booking.cargo_type}</h4>
                                        <Badge variant="outline" className="text-[10px] h-4">Pending</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {booking.pickup_city} → {booking.delivery_city}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(booking.shipment_date).toLocaleDateString()}
                                        </div>
                                        <div className="text-primary font-medium">Shipper: {booking.shipper_name}</div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="hero-gradient border-0 text-xs h-9"
                                size="sm"
                                onClick={() => handleOpenAssignment(booking)}
                            >
                                Assign Providers <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                    ))}
                </div>
                {statsData?.latestUnmatched?.length > 0 && (
                    <div className="p-4 bg-muted/20 border-t border-border flex justify-center">
                        <Button variant="link" className="text-xs" onClick={() => setActiveSection("quotes")}>
                            See more bookings in Match Center
                        </Button>
                    </div>
                )}
            </div>

            {/* Assignment Dialog (Same as ManageQuotes) */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <Info className="h-6 w-6 text-primary" /> Quick Assignment
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Quickly assign a carrier and escort to this booking request.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {loadingQuotes ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                {/* Detailed Booking Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-xl border">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Cargo Details</p>
                                            <h4 className="font-bold text-lg">{selectedBooking?.cargo_type}</h4>
                                            <p className="text-sm text-balance italic mb-2">{selectedBooking?.cargo_description}</p>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-background p-2 rounded border">
                                                    <span className="text-muted-foreground block">Dimensions</span>
                                                    <span className="font-medium">{selectedBooking?.dimensions_length_ft}ft x {selectedBooking?.dimensions_width_ft}ft x {selectedBooking?.dimensions_height_ft}ft</span>
                                                </div>
                                                <div className="bg-background p-2 rounded border">
                                                    <span className="text-muted-foreground block">Weight</span>
                                                    <span className="font-medium">{selectedBooking?.weight_lbs?.toLocaleString()} lbs</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Shipper Information</p>
                                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                                <p className="text-sm font-bold">{selectedBooking?.shipper_name}</p>
                                                <p className="text-[11px] font-medium text-primary mt-0.5">{selectedBooking?.shipper_company || 'Independent Shipper'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Schedule</p>
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {selectedBooking && new Date(selectedBooking.shipment_date).toLocaleDateString()}
                                                {selectedBooking?.flexible_dates ? <Badge variant="secondary" className="text-[10px]">Flexible</Badge> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Route & Locations</p>
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <div className="mt-1 shrink-0 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold leading-none">Pickup</p>
                                                        <p className="text-[13px] font-medium">{selectedBooking?.pickup_address}</p>
                                                        <p className="text-[11px] text-muted-foreground">{selectedBooking?.pickup_city}, {selectedBooking?.pickup_state}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="mt-1 shrink-0 h-4 w-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold leading-none">Delivery</p>
                                                        <p className="text-[13px] font-medium">{selectedBooking?.delivery_address}</p>
                                                        <p className="text-[11px] text-muted-foreground">{selectedBooking?.delivery_city}, {selectedBooking?.delivery_state}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedBooking?.special_instructions && (
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Special Instructions</p>
                                                <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100 italic">
                                                    {selectedBooking.special_instructions}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Requirements</p>
                                            {selectedBooking?.requires_escort ? (
                                                <Badge className="bg-purple-100 text-purple-800 border-0">High-Heavy Escort Required</Badge>
                                            ) : (
                                                <Badge variant="outline">No Escort Needed</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Carrier Bids */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                        <Truck className="h-4 w-4" /> Carrier Quotes ({carrierQuotes.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {carrierQuotes.map((quote) => (
                                            <div
                                                key={quote.id}
                                                className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${selectedCarrierQuote === quote.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                                                    }`}
                                                onClick={() => setSelectedCarrierQuote(quote.id)}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{quote.carrier_name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{quote.company_name}</p>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="h-auto p-0 text-[10px] mt-0.5"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setViewProviderId(quote.provider_id);
                                                            setProfileDialogOpen(true);
                                                        }}
                                                    >
                                                        <User className="h-2.5 w-2.5 mr-1" /> Profile
                                                    </Button>
                                                </div>
                                                <p className="font-black text-primary">${parseFloat(quote.amount).toLocaleString()}</p>
                                            </div>
                                        ))}
                                        {carrierQuotes.length === 0 && <p className="text-xs text-muted-foreground italic">No carrier bids yet.</p>}
                                    </div>
                                </div>

                                {/* Escort Bids */}
                                {selectedBooking?.requires_escort && (
                                    <div>
                                        <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                            <Car className="h-4 w-4" /> Escort Quotes ({escortQuotes.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {escortQuotes.map((quote) => (
                                                <div
                                                    key={quote.id}
                                                    className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${selectedEscortQuote === quote.id ? 'border-purple-600 bg-purple-50' : 'hover:bg-muted/50'
                                                        }`}
                                                    onClick={() => setSelectedEscortQuote(quote.id)}
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-bold text-sm">{quote.carrier_name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{quote.company_name}</p>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="h-auto p-0 text-[10px] mt-0.5 text-purple-600 hover:text-purple-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setViewProviderId(quote.provider_id);
                                                                setProfileDialogOpen(true);
                                                            }}
                                                        >
                                                            <User className="h-2.5 w-2.5 mr-1" /> Profile
                                                        </Button>
                                                    </div>
                                                    <p className="font-black text-purple-600">${parseFloat(quote.amount).toLocaleString()}</p>
                                                </div>
                                            ))}
                                            {escortQuotes.length === 0 && <p className="text-xs text-muted-foreground italic">No escort bids yet.</p>}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <DialogFooter className="p-6 border-t bg-muted/10">
                        <Button variant="outline" onClick={() => setDetailsOpen(false)} disabled={isAssigning}>Cancel</Button>
                        <Button
                            className="hero-gradient border-0 font-bold"
                            onClick={handleAssign}
                            disabled={isAssigning || !selectedCarrierQuote}
                        >
                            {isAssigning ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                            Confirm Selection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ProviderProfileDialog
                providerId={viewProviderId}
                open={profileDialogOpen}
                onOpenChange={setProfileDialogOpen}
            />
        </div>
    );
};

export default OverviewSection;
