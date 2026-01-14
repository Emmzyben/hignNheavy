import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const completedBookings = [
  {
    id: "BK-002",
    cargoType: "Industrial Machinery",
    carrier: "Big Rig Transport LLC",
    date: "2024-01-10",
    route: "Austin, TX → San Antonio, TX",
    hasReview: false,
  },
  {
    id: "BK-004",
    cargoType: "Pre-Fab Building",
    carrier: "Lone Star Carriers",
    date: "2024-01-08",
    route: "Fort Worth, TX → El Paso, TX",
    hasReview: true,
    review: {
      rating: 5,
      comment: "Excellent service! The team was professional and the delivery was on time.",
    },
  },
];

const ReviewBooking = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    toast.success("Review submitted successfully!", {
      description: "Thank you for your feedback.",
    });
    setSelectedBooking(null);
    setRating(0);
    setComment("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-display font-bold mb-4">Completed Bookings</h2>
        <p className="text-muted-foreground mb-6">
          Share your experience to help other shippers and improve carrier services.
        </p>

        <div className="space-y-4">
          {completedBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-semibold text-primary">{booking.id}</span>
                    {booking.hasReview && (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle2 size={14} />
                        Reviewed
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{booking.cargoType}</p>
                  <p className="text-sm text-muted-foreground">{booking.route}</p>
                  <p className="text-sm text-muted-foreground">Carrier: {booking.carrier}</p>
                  <p className="text-sm text-muted-foreground">Completed: {booking.date}</p>
                </div>
                
                {booking.hasReview ? (
                  <div className="bg-muted/50 p-4 rounded-lg min-w-[250px]">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={star <= (booking.review?.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{booking.review?.comment}</p>
                  </div>
                ) : (
                  <Button
                    variant={selectedBooking === booking.id ? "secondary" : "default"}
                    onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                  >
                    <Star size={18} className="mr-2" />
                    Write Review
                  </Button>
                )}
              </div>

              {/* Review Form */}
              {selectedBooking === booking.id && !booking.hasReview && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Rate your experience with {booking.carrier}</h3>
                  
                  {/* Star Rating */}
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={
                            star <= (hoverRating || rating)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-muted-foreground self-center">
                      {rating > 0 && (
                        <>
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent"}
                        </>
                      )}
                    </span>
                  </div>

                  {/* Comment */}
                  <Textarea
                    placeholder="Share details about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] mb-4"
                  />

                  <div className="flex gap-3">
                    <Button onClick={submitReview}>
                      <Send size={18} className="mr-2" />
                      Submit Review
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Guidelines */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Review Guidelines</h3>
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
