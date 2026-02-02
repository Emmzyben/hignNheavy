import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Shield,
    Truck,
    Briefcase,
    Download,
    CheckCircle2,
    Calendar,
    Users,
    Key,
    MessageSquare,
    Star,
    X
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { toast } from "sonner";

interface ProviderProfileDialogProps {
    providerId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMessage?: (participantId: string, bookingId?: string | null) => void;
}

const ProviderProfileDialog = ({ providerId, open, onOpenChange, onMessage }: ProviderProfileDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loadingSecondary, setLoadingSecondary] = useState(false);
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    useEffect(() => {
        if (providerId && open) {
            fetchProfile();
        }
    }, [providerId, open]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/users/${providerId}`);
            if (response.data.success) {
                const profileData = response.data.data;
                console.log("Loaded profile for dialog:", profileData);
                setProfile(profileData);

                // Fetch secondary data
                if (profileData.role === 'shipper') {
                    setLoadingSecondary(false);
                    return;
                }

                // Fetch secondary data
                setLoadingSecondary(true);
                try {
                    const [vRes, rRes, sRes] = await Promise.all([
                        api.get(`/vehicles/provider/${providerId}`),
                        api.get(`/reviews/provider/${providerId}`),
                        api.get(`/reviews/stats/${providerId}`)
                    ]);
                    if (vRes.data.success) setVehicles(vRes.data.data);
                    if (rRes.data.success) setReviews(rRes.data.data);
                    if (sRes.data.success) setStats(sRes.data.data);

                    if (profileData.role === 'carrier') {
                        console.log("Fetching drivers for carrier:", providerId);
                        const dRes = await api.get(`/drivers/provider/${providerId}`);
                        console.log("Drivers response:", dRes.data);
                        if (dRes.data.success) setDrivers(dRes.data.data);
                    }
                } catch (err) {
                    console.error("Error fetching secondary data", err);
                } finally {
                    setLoadingSecondary(false);
                }
            }
        } catch (error) {
            toast.error("Failed to load provider profile");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!providerId) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        {profile?.role === 'carrier' ? (
                            <Truck className="h-6 w-6 text-primary" />
                        ) : profile?.role === 'escort' ? (
                            <Shield className="h-6 w-6 text-purple-600" />
                        ) : profile?.role === 'shipper' ? (
                            <Building className="h-6 w-6 text-blue-600" />
                        ) : (
                            <User className="h-6 w-6 text-gray-600" />
                        )}
                        <span className="capitalize">{profile?.role || 'User'} Profile</span>
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about {profile?.full_name || 'the service provider'}.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Fetching provider credentials...</p>
                    </div>
                ) : profile ? (
                    <div className="space-y-8 py-4">
                        {/* Header / Identity Section */}
                        <div className="flex flex-col md:flex-row gap-6 items-start bg-muted/30 p-6 rounded-2xl border">
                            <div
                                className={`w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0 overflow-hidden ${profile.avatar_url ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}
                                onClick={() => profile.avatar_url && setIsImageExpanded(true)}
                            >
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={48} className="text-primary" />
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-black">{profile.full_name}</h2>
                                    {profile.profile_completed && (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Profile Verified
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="capitalize">{profile.role}</Badge>
                                    {stats?.average_rating && (
                                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-200">
                                            <Star size={12} className="fill-yellow-600 text-yellow-600" />
                                            {Number(stats.average_rating).toFixed(1)} ({stats.total_reviews})
                                        </div>
                                    )}
                                </div>
                                <p className="text-lg font-bold text-muted-foreground">{profile.company_name || (profile.role === 'escort' ? 'Personal Escort Service' : 'Independent Carrier')}</p>
                                <div className="flex flex-wrap gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Mail size={14} className="text-primary" />
                                        {profile.email}
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Phone size={14} className="text-primary" />
                                        {profile.contact_number || profile.phone_number || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Calendar size={14} className="text-primary" />
                                        Joined {new Date(profile.created_at).toLocaleDateString()}
                                    </div>
                                    {onMessage && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-7 text-xs gap-1"
                                            onClick={() => onMessage(profile.id)}
                                        >
                                            <MessageSquare size={12} /> Chat with User
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className={`grid w-full ${profile.role === 'shipper' ? 'grid-cols-1 max-w-[200px]' : 'grid-cols-6'} bg-muted/50 p-1`}>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                {profile.role !== 'shipper' && (
                                    <>
                                        <TabsTrigger value="compliance">Compliance</TabsTrigger>
                                        <TabsTrigger value="fleet">Fleet ({vehicles.length})</TabsTrigger>
                                        {profile.role === 'carrier' ? (
                                            <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
                                        ) : (
                                            <TabsTrigger value="drivers" disabled className="opacity-50">Drivers</TabsTrigger>
                                        )}
                                        <TabsTrigger value="experience">Experience</TabsTrigger>
                                        <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                                    </>
                                )}
                            </TabsList>

                            <TabsContent value="overview" className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4 bg-muted/20 p-5 rounded-xl border">
                                        <h4 className="font-bold flex items-center gap-2 text-primary">
                                            <Building size={18} /> Physical Location
                                        </h4>
                                        <div className="flex gap-3">
                                            <MapPin size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium">{profile.address || 'N/A'}</p>
                                                <p className="text-sm text-muted-foreground">{profile.city}, {profile.state} {profile.zip_code}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-muted/20 p-5 rounded-xl border">
                                        <h4 className="font-bold flex items-center gap-2 text-primary">
                                            <Shield size={18} /> Status & Reliability
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full ${profile.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="font-bold uppercase tracking-wider text-sm">{profile.status} Member</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">This member is currently in good standing and authorized to provide services on the HighnHeavy platform.</p>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                    <h4 className="font-bold flex items-center gap-2 text-primary">
                                        <Briefcase size={18} /> Professional Bio
                                    </h4>
                                    <p className="text-sm leading-relaxed italic text-muted-foreground">
                                        {profile.bio || "No professional biography has been provided for this business yet."}
                                    </p>
                                </div>
                            </TabsContent>

                            {profile.role !== 'shipper' && (
                                <>
                                    <TabsContent value="compliance" className="pt-6 space-y-6">
                                        {profile.role === 'carrier' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-2">
                                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">MC Number</p>
                                                    <p className="text-2xl font-black text-primary">{profile.mc_number || 'N/A'}</p>
                                                </div>
                                                <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-2">
                                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">USDOT Number</p>
                                                    <p className="text-2xl font-black text-primary">{profile.dot_number || 'N/A'}</p>
                                                </div>
                                                <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-2">
                                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Fleet Size</p>
                                                    <p className="text-2xl font-black text-primary">{profile.fleet_size || '0'} Vehicles</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-2">
                                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Driver's License</p>
                                                    <p className="text-2xl font-black text-purple-600 font-mono">{profile.drivers_license_number || 'N/A'}</p>
                                                </div>
                                                <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-2">
                                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Certification ID</p>
                                                    <p className="text-2xl font-black text-purple-600 font-mono">{profile.certification_number || 'N/A'}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-muted/50 p-8 text-center rounded-2xl border border-dashed flex flex-col items-center gap-4">
                                            <Download className="h-10 w-10 text-muted-foreground opacity-50" />
                                            <div>
                                                <h5 className="font-bold">Compliance Documents</h5>
                                                <p className="text-sm text-muted-foreground">All insurance policies and certifications are stored securely. Contact member directly for PDF copies if needed for external audits.</p>
                                            </div>
                                            <Button variant="secondary" disabled>Available in Next Release</Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="fleet" className="pt-6">
                                        {loadingSecondary ? (
                                            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                                        ) : vehicles.length === 0 ? (
                                            <div className="text-center py-12 bg-muted/20 border-dashed border-2 rounded-xl">
                                                <Truck className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                                <p className="text-muted-foreground font-medium">No vehicles registered yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-6">
                                                {vehicles.map((v) => (
                                                    <div key={v.id} className="border rounded-2xl bg-card overflow-hidden shadow-sm flex flex-col md:flex-row">
                                                        {/* Photos Section */}
                                                        <div className="w-full md:w-48 h-32 md:h-auto bg-muted shrink-0 flex items-center justify-center border-b md:border-b-0 md:border-r">
                                                            {v.photos && (typeof v.photos === 'string' ? JSON.parse(v.photos) : v.photos).length > 0 ? (
                                                                <div className="flex w-full h-full overflow-x-auto snap-x no-scrollbar">
                                                                    {(typeof v.photos === 'string' ? JSON.parse(v.photos) : v.photos).map((imgUrl: string, i: number) => (
                                                                        <img
                                                                            key={i}
                                                                            src={imgUrl}
                                                                            className="w-full h-full object-cover snap-center shrink-0"
                                                                            alt={`Equipment ${i + 1}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <Truck className="h-8 w-8 text-muted-foreground opacity-20" />
                                                            )}
                                                        </div>

                                                        <div className="p-5 flex-1 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h5 className="font-bold text-lg">{v.name}</h5>
                                                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-wider">{v.type}</p>
                                                                </div>
                                                                <Badge variant="outline" className="capitalize">{v.status}</Badge>
                                                            </div>
                                                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                                                <div className="bg-muted/30 p-2 rounded">
                                                                    <span className="text-muted-foreground block">Plate</span>
                                                                    <span className="font-bold">{v.plate_number || 'N/A'}</span>
                                                                </div>
                                                                <div className="bg-muted/30 p-2 rounded">
                                                                    <span className="text-muted-foreground block">Year</span>
                                                                    <span className="font-bold">{v.year || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="drivers" className="pt-6">
                                        {loadingSecondary ? (
                                            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                                        ) : drivers.length === 0 ? (
                                            <div className="text-center py-12 bg-muted/20 border-dashed border-2 rounded-xl">
                                                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                                <p className="text-muted-foreground font-medium">No drivers registered yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="border rounded-xl overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Driver Name</TableHead>
                                                                <TableHead>License</TableHead>
                                                                <TableHead>Contact</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {drivers.map((d) => (
                                                                <TableRow key={d.id}>
                                                                    <TableCell className="font-bold">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                                                                                {d.avatar_url ? (
                                                                                    <img src={d.avatar_url} alt={d.name} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <User size={14} className="text-primary" />
                                                                                )}
                                                                            </div>
                                                                            {d.name}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="font-mono text-xs">{d.license_number || 'N/A'}</TableCell>
                                                                    <TableCell className="text-xs">
                                                                        <p>{d.email}</p>
                                                                        <p className="text-muted-foreground">{d.phone}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="capitalize">{d.status}</Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="experience" className="pt-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-3">
                                                <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider">Service Experience</h4>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-4xl font-black text-primary">{profile.years_experience || (profile.role === 'carrier' ? 'Verified' : '0')}</span>
                                                    <span className="text-muted-foreground mb-1 font-bold">{profile.role === 'carrier' ? 'Fleet Services' : 'Years Experience'}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 border rounded-2xl bg-background shadow-sm space-y-3">
                                                <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider">Operating Area</h4>
                                                <p className="font-bold text-lg">{profile.service_area || 'National (All States)'}</p>
                                                <p className="text-xs text-muted-foreground">Authorized to provide oversized load services within this geographic footprint.</p>
                                            </div>
                                        </div>

                                        {profile.role === 'escort' && profile.vehicle_details && (
                                            <div className="p-6 border rounded-2xl bg-muted/10 space-y-3">
                                                <h4 className="font-bold flex items-center gap-2 text-purple-600">
                                                    <Truck size={18} /> Escort Vehicle Details
                                                </h4>
                                                <p className="text-sm leading-relaxed">{profile.vehicle_details}</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="reviews" className="pt-6">
                                        {loadingSecondary ? (
                                            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Summary Card */}
                                                <div className="bg-muted/20 border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center">
                                                            <span className="text-4xl font-black text-foreground">{Number(stats?.average_rating || 0).toFixed(1)}</span>
                                                            <div className="flex gap-1 mt-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={14}
                                                                        className={star <= Math.round(stats?.average_rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="h-12 w-px bg-border" />
                                                        <div>
                                                            <p className="font-bold text-lg">{stats?.total_reviews || 0} Reviews</p>
                                                            <p className="text-xs text-muted-foreground">All time rating</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-sm">
                                                            {stats?.average_rating >= 4.5 ? "Top Rated Performer" : stats?.average_rating >= 3.5 ? "Reliable Provider" : "New Service Provider"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Based on validated feedback</p>
                                                    </div>
                                                </div>

                                                {reviews.length === 0 ? (
                                                    <div className="text-center py-12 bg-muted/10 border-dashed border-2 rounded-xl">
                                                        <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                                        <p className="text-muted-foreground font-medium">No reviews received yet.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {reviews.map((review) => (
                                                            <div key={review.id} className="p-4 border rounded-xl bg-card hover:bg-muted/5 transition-colors">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex gap-3">
                                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                            <User size={20} className="text-primary" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-sm">{review.reviewer_company || review.reviewer_name}</p>
                                                                            <div className="flex gap-0.5 my-1">
                                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                                    <Star
                                                                                        key={star}
                                                                                        size={12}
                                                                                        className={star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                            <p className="text-sm text-foreground italic">"{review.comment}"</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground font-medium">
                                                                        {new Date(review.created_at).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TabsContent>
                                </>
                            )}
                        </Tabs>
                    </div>
                ) : (
                    <div className="py-20 text-center text-muted-foreground">
                        Profile data could not be retrieved.
                    </div>
                )}

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8">Close Profile</Button>
                </DialogFooter>
            </DialogContent>

            {/* Full Image Preview Dialog */}
            <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
                <DialogContent className="max-w-3xl border-none bg-transparent shadow-none p-0 flex flex-col items-center justify-center sm:max-w-md lg:max-w-2xl z-[60]">
                    <DialogHeader className="hidden">
                        <DialogTitle>Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="relative group w-full aspect-square rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <img
                            src={profile?.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={() => setIsImageExpanded(false)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};

export default ProviderProfileDialog;
