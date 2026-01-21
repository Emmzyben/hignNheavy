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

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const response = await api.post("/reviews", {
        bookingId: selectedBooking.id,
        subjectId: selectedBooking.carrier_id,
        rating,
        comment
      });

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setSelectedBooking(null);
        setRating(0);
        setComment("");
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
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
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Completed:</span> {new Date(booking.shipment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {booking.review_id ? (
                    <div className="bg-muted/50 p-4 rounded-lg min-w-[250px] border border-border/50">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= booking.review_rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}
                          />
                        ))}
                      </div>
                      <p className="text-sm italic text-muted-foreground leading-relaxed">"{booking.review_comment}"</p>
                    </div>
                  ) : (
                    <Button
                      variant={selectedBooking?.id === booking.id ? "secondary" : "default"}
                      onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                      className="shrink-0"
                    >
                      <Star size={16} className="mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>

                {/* Review Form */}
                {selectedBooking?.id === booking.id && !booking.review_id && (
                  <div className="mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="font-semibold mb-4 text-base">Rate your experience with {booking.carrier_company || booking.carrier_name}</h3>

                    {/* Star Rating */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-all hover:scale-125 focus:outline-none"
                          >
                            <Star
                              size={36}
                              className={
                                star <= (hoverRating || rating)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground/30 hover:text-muted-foreground"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full min-w-[100px] text-center">
                        {rating > 0 ? (
                          <>
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                          </>
                        ) : "Select Rating"}
                      </span>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-semibold">Your feedback</label>
                      <Textarea
                        placeholder="What went well? Any areas for improvement? Your detailed feedback helps others."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[120px] resize-none focus-visible:ring-primary"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={submitReview} size="lg" className="px-8 shadow-lg shadow-primary/20">
                        <Send size={18} className="mr-2" />
                        Submit Review
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => setSelectedBooking(null)}>
                        Cancel
                      </Button>
                    </div>
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
