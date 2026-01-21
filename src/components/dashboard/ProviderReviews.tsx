import { useState, useEffect } from "react";
import { Star, MessageSquare, User, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ProviderReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const [reviewsRes, statsRes] = await Promise.all([
                api.get(`/reviews/provider/${user.id}`),
                api.get(`/reviews/stats/${user.id}`)
            ]);

            if (reviewsRes.data.success) {
                setReviews(reviewsRes.data.data);
            }
            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (error) {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Rating Overview</h3>
                    <div className="flex items-end gap-3">
                        <div className="text-5xl font-black text-foreground">
                            {stats?.average_rating ? Number(stats.average_rating).toFixed(1) : "0.0"}
                        </div>
                        <div className="flex flex-col mb-1">
                            <div className="flex gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={star <= Math.round(stats?.average_rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">{stats?.total_reviews || 0} Total Reviews</p>
                        </div>
                    </div>
                </div>

                {/* Growth Card */}
                <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Reputation Status</h3>
                        <p className="text-2xl font-bold mb-1">
                            {stats?.average_rating >= 4.5 ? "Top Rated Performer" : stats?.average_rating >= 3.5 ? "Reliable Provider" : "New Service Provider"}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                            Your rating is calculated based on feedback from the last {reviews.length} completed shipments.
                        </p>
                    </div>
                    <div className="hidden lg:block p-4 bg-primary/5 rounded-full">
                        <Star size={40} className="text-primary animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                    <h2 className="text-xl font-display font-bold flex items-center gap-2">
                        <MessageSquare size={20} className="text-primary" />
                        Recent Feedback
                    </h2>
                </div>

                <div className="divide-y divide-border">
                    {reviews.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star size={32} className="text-muted-foreground/30" />
                            </div>
                            <p className="text-muted-foreground font-medium">No reviews received yet.</p>
                            <p className="text-sm text-muted-foreground">Complete more bookings to build your reputation!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-muted/5 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <User size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-foreground">{review.reviewer_company || review.reviewer_name}</p>
                                                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-black uppercase text-muted-foreground tracking-widest">Shipper</span>
                                            </div>
                                            <div className="flex gap-0.5 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        className={star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold uppercase tracking-tight">
                                            <Calendar size={12} />
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderReviews;
