import { useState, useEffect } from "react";
import { Star, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";

const ReviewBooking = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [escortRating, setEscortRating] = useState(0);
  const [escortHoverRating, setEscortHoverRating] = useState(0);
  const [escortComment, setEscortComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/bookings/my-bookings");
      if (response.data.success) {
        // Only show completed bookings
        setBookings(response.data.data.filter((b: any) => b.status === "completed"));
      }
    } catch (error) {
      toast.error("Failed to load completed bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const submitReview = async (type: 'carrier' | 'escort') => {
    const isEscort = type === 'escort';
    const currentRating = isEscort ? escortRating : rating;
    const currentComment = isEscort ? escortComment : comment;
    const subjectId = isEscort ? selectedBooking.escort_id : selectedBooking.carrier_id;

    if (currentRating === 0) {
      toast.error(`Please select a rating for the ${type}`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/reviews", {
        bookingId: selectedBooking.id,
        subjectId,
        rating: currentRating,
        comment: currentComment
      });

      if (response.data.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} review submitted!`);
        if (isEscort) {
          setEscortRating(0);
          setEscortComment("");
        } else {
          setRating(0);
          setComment("");
        }
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to submit ${type} review`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-xl font-display font-bold mb-4">Completed Bookings</h2>
        <p className="text-muted-foreground mb-6">
          Share your experience to help other shippers and improve carrier services.
        </p>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
              No completed bookings found to review.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-semibold text-primary">{booking.id.slice(0, 8)}</span>
                      {booking.review_id && (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={12} />
                          Reviewed
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-lg">{booking.cargo_type}</p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {booking.pickup_city}, {booking.pickup_state} → {booking.delivery_city}, {booking.delivery_state}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Carrier:</span> {booking.carrier_company || booking.carrier_name || "N/A"}
                      </p>
                      {booking.escort_id && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">Escort:</span> {booking.escort_company || booking.escort_name || "N/A"}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Completed:</span> {new Date(booking.shipment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.carrier_review_id ? (
                      <div className="bg-muted/50 p-3 rounded-lg min-w-[200px] border border-border/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Carrier Review</p>
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= booking.carrier_review_rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}
                            />
                          ))}
                        </div>
                        <p className="text-xs italic text-muted-foreground truncate max-w-[200px]">"{booking.carrier_review_comment}"</p>
                      </div>
                    ) : (
                      <Button
                        variant={selectedBooking?.id === booking.id ? "secondary" : "default"}
                        size="sm"
                        onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                      >
                        <Star size={14} className="mr-2" /> Review Carrier
                      </Button>
                    )}

                    {booking.escort_id && (
                      booking.escort_review_id ? (
                        <div className="bg-purple-50/50 p-3 rounded-lg min-w-[200px] border border-purple-100/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-1">Escort Review</p>
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={star <= booking.escort_review_rating ? "fill-purple-500 text-purple-500" : "text-muted-foreground"}
                              />
                            ))}
                          </div>
                          <p className="text-xs italic text-purple-600 truncate max-w-[200px]">"{booking.escort_review_comment}"</p>
                        </div>
                      ) : (
                        <Button
                          variant={selectedBooking?.id === booking.id ? "outline" : "outline"}
                          size="sm"
                          onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Star size={14} className="mr-2" /> Review Escort
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {/* Review Form */}
                {selectedBooking?.id === booking.id && (
                  <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    {/* Carrier Review Form */}
                    {!booking.carrier_review_id && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Star size={20} className="text-yellow-500 fill-yellow-500" />
                          Review Carrier
                        </h3>
                        <p className="text-sm text-muted-foreground -mt-2">Rate {booking.carrier_company || booking.carrier_name}</p>

                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={24}
                                className={star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}
                              />
                            </button>
                          ))}
                        </div>

                        <Textarea
                          placeholder="Your feedback for the carrier..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[100px] text-sm"
                        />

                        <Button 
                          onClick={() => submitReview('carrier')} 
                          disabled={submitting}
                          className="w-full shadow-md"
                        >
                          {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send size={16} className="mr-2" />}
                          Submit Carrier Review
                        </Button>
                      </div>
                    )}

                    {/* Escort Review Form */}
                    {booking.escort_id && !booking.escort_review_id && (
                      <div className="space-y-4 border-l pl-8 border-border">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Star size={20} className="text-purple-500 fill-purple-500" />
                          Review Escort
                        </h3>
                        <p className="text-sm text-muted-foreground -mt-2">Rate {booking.escort_company || booking.escort_name}</p>

                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEscortRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={24}
                                className={star <= escortRating ? "fill-purple-500 text-purple-500" : "text-muted-foreground/30"}
                              />
                            </button>
                          ))}
                        </div>

                        <Textarea
                          placeholder="Your feedback for the escort service..."
                          value={escortComment}
                          onChange={(e) => setEscortComment(e.target.value)}
                          className="min-h-[100px] text-sm"
                        />

                        <Button 
                          onClick={() => submitReview('escort')} 
                          disabled={submitting}
                          variant="secondary"
                          className="w-full shadow-md bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                          {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send size={16} className="mr-2" />}
                          Submit Escort Review
                        </Button>
                      </div>
                    )}

                    {booking.carrier_review_id && (!booking.escort_id || booking.escort_review_id) && (
                      <div className="col-span-2 text-center py-8">
                        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-2" />
                        <p className="font-bold text-lg">Thank you for your feedback!</p>
                        <Button variant="ghost" className="mt-4" onClick={() => setSelectedBooking(null)}>Done</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Guidelines */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-primary" />
          Review Guidelines
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Be honest and specific about your experience</li>
          <li>• Focus on the service quality, timeliness, and communication</li>
          <li>• Avoid personal information or offensive language</li>
          <li>• Your review helps other shippers make informed decisions</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewBooking;
