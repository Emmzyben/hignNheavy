import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Camera, 
  Upload,
  X,
  Check,
  PenTool
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DriverCompleteDelivery = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setSignature(dataUrl);
      setShowSignaturePad(false);
      toast({
        title: "Signature Saved",
        description: "Signature has been captured successfully",
      });
    }
  };

  const handleComplete = () => {
    if (photos.length === 0) {
      toast({
        title: "Photos Required",
        description: "Please upload at least one delivery photo",
        variant: "destructive",
      });
      return;
    }

    if (!signature) {
      toast({
        title: "Signature Required",
        description: "Please obtain receiver's signature",
        variant: "destructive",
      });
      return;
    }

    if (!receiverName.trim()) {
      toast({
        title: "Receiver Name Required",
        description: "Please enter the receiver's name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Delivery Completed!",
        description: "Trip has been successfully completed",
      });
      navigate("/driver/trips");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Complete Delivery</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Photo Upload */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Delivery Photos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Take photos of the delivered cargo as proof of delivery
          </p>

          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={photo} alt={`Delivery ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </button>
              </div>
            ))}
            
            {/* Add Photo Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary transition-colors"
            >
              <Camera className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add Photo</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </Card>

        {/* Signature */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-4">Receiver's Signature</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Obtain signature from the person receiving the delivery
          </p>

          {!showSignaturePad && !signature && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSignaturePad(true)}
            >
              <PenTool className="w-4 h-4 mr-2" />
              Capture Signature
            </Button>
          )}

          {showSignaturePad && (
            <div className="space-y-3">
              <div className="border border-border rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={clearSignature}>
                  Clear
                </Button>
                <Button className="flex-1" onClick={saveSignature}>
                  Save Signature
                </Button>
              </div>
            </div>
          )}

          {signature && !showSignaturePad && (
            <div className="space-y-3">
              <div className="border border-border rounded-lg overflow-hidden bg-white p-2">
                <img src={signature} alt="Signature" className="w-full h-24 object-contain" />
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">Signature captured</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSignature(null);
                  setShowSignaturePad(true);
                }}
              >
                Recapture
              </Button>
            </div>
          )}
        </Card>

        {/* Receiver Name */}
        <Card className="p-4 bg-card border-border">
          <div className="space-y-2">
            <Label htmlFor="receiverName">Receiver's Name</Label>
            <Input
              id="receiverName"
              placeholder="Enter full name"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>
        </Card>

        {/* Complete Button */}
        <Button
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Completing..." : "Complete Trip"}
        </Button>
      </div>
    </div>
  );
};

export default DriverCompleteDelivery;
