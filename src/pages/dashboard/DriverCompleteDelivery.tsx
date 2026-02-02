import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
    PenTool,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import imageCompression from 'browser-image-compression';
import api from "@/lib/api";

const DriverCompleteDelivery = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    const [photos, setPhotos] = useState<string[]>([]);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [receiverName, setReceiverName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showSignaturePad, setShowSignaturePad] = useState(false);

    useEffect(() => {
        if (!bookingId) {
            toast.error("No booking selected for completion");
            navigate("/dashboard/driver");
        }
    }, [bookingId, navigate]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (photos.length + files.length > 5) {
            toast.error("You can only upload up to 5 photos");
            return;
        }

        setIsUploadingPhoto(true);

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                // 1. Compress
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                // 2. Upload
                const formData = new FormData();
                formData.append('photo', compressedFile);

                const response = await api.post('/drivers/upload-delivery-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    return response.data.url;
                }
                throw new Error("Upload failed");
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setPhotos((prev) => [...prev, ...uploadedUrls]);
            toast.success(`${uploadedUrls.length} photo(s) uploaded successfully`);
        } catch (error) {
            console.error("Photo upload error:", error);
            toast.error("Failed to upload photos");
        } finally {
            setIsUploadingPhoto(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
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
            toast.success("Signature captured successfully");
        }
    };

    const handleComplete = async () => {
        if (!bookingId) return;

        if (photos.length === 0) {
            toast.error("Please upload at least one delivery photo");
            return;
        }

        if (!signature) {
            toast.error("Please obtain receiver's signature");
            return;
        }

        if (!receiverName.trim()) {
            toast.error("Please enter the receiver's name");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post(`/drivers/complete-load/${bookingId}`, {
                delivery_photos: photos,
                delivery_signature: signature,
                receiver_name: receiverName
            });

            if (response.data.success) {
                toast.success("Delivery Completed! Trip has been successfully closed.");
                navigate("/dashboard/driver?section=trips");
            }
        } catch (error: any) {
            console.error("Complete delivery error:", error);
            toast.error(error.response?.data?.message || "Failed to complete delivery");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout activeSection="active">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-bold">Complete Delivery</h1>
                        <p className="text-muted-foreground font-medium">Finalize the trip and upload proof of delivery</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4">Delivery Photos</h3>
                            <p className="text-sm text-muted-foreground mb-6">Take photos of the delivered cargo as proof of delivery.</p>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img src={photo} alt={`Delivery ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingPhoto || photos.length >= 5}
                                    className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                                >
                                    {isUploadingPhoto ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <Camera className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-1" />
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary">
                                                {photos.length >= 5 ? 'Max 5' : 'Add Photo'}
                                            </span>
                                        </>
                                    )}
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
                                disabled={isUploadingPhoto || photos.length >= 5}
                            />

                            <Button
                                variant="outline"
                                className="w-full font-bold h-12"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingPhoto || photos.length >= 5}
                            >
                                {isUploadingPhoto ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                {isUploadingPhoto ? "Uploading..." : "Upload from Device"}
                            </Button>
                        </Card>

                        <Card className="p-6">
                            <div className="space-y-4">
                                <Label htmlFor="receiverName" className="font-bold text-base">Receiver's Full Name</Label>
                                <Input
                                    id="receiverName"
                                    placeholder="e.g. John Doe"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                    className="h-12 text-lg"
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4">Signature</h3>
                            <p className="text-sm text-muted-foreground mb-6">Receiver must sign below to acknowledge receipt.</p>

                            {!showSignaturePad && !signature && (
                                <Button variant="outline" className="w-full h-32 border-dashed bg-muted/20 flex flex-col gap-2" onClick={() => setShowSignaturePad(true)}>
                                    <PenTool className="w-6 h-6 text-muted-foreground" />
                                    <span className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Click to Sign</span>
                                </Button>
                            )}

                            {showSignaturePad && (
                                <div className="space-y-4">
                                    <div className="border-2 border-border rounded-xl overflow-hidden bg-white shadow-inner">
                                        <canvas
                                            ref={canvasRef}
                                            width={400}
                                            height={200}
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
                                        <Button variant="outline" className="flex-1 font-bold" onClick={clearSignature}>Clear</Button>
                                        <Button className="flex-1 font-bold" onClick={saveSignature}>Save Signature</Button>
                                    </div>
                                </div>
                            )}

                            {signature && !showSignaturePad && (
                                <div className="space-y-4">
                                    <div className="border border-border rounded-xl overflow-hidden bg-white p-4 shadow-sm">
                                        <img src={signature} alt="Signature" className="w-full h-24 object-contain" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                            <Check className="w-4 h-4" />
                                            <span>Signature captured</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="font-bold text-primary" onClick={() => { setSignature(null); setShowSignaturePad(true); }}>
                                            Change Signature
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Button
                            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-bold text-xl shadow-xl hover:scale-[1.02] transition-all"
                            onClick={handleComplete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Complete Delivery"}
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DriverCompleteDelivery;
