import React, { useState, useRef } from 'react';
import { Camera, Loader2, X, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface EquipmentImageUploaderProps {
    images: string[];
    onImagesChange: (newImages: string[]) => void;
    maxImages?: number;
}

const EquipmentImageUploader = ({ images = [], onImagesChange, maxImages = 5 }: EquipmentImageUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            toast.error(`You can only upload up to ${maxImages} images`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setIsUploading(true);

        try {
            const uploadedUrls: string[] = [];

            for (const file of filesToUpload) {
                if (!file.type.startsWith('image/')) {
                    toast.error(`File ${file.name} is not an image`);
                    continue;
                }

                const formData = new FormData();
                formData.append('image', file);

                const response = await api.post('/uploads/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    uploadedUrls.push(response.data.url);
                }
            }

            if (uploadedUrls.length > 0) {
                onImagesChange([...images, ...uploadedUrls]);
                toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to upload some images');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                        <img src={url} alt={`Equipment ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Plus size={24} />
                                <span className="text-[10px] mt-1 font-medium">Add Photo</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <p className="text-[11px] text-muted-foreground">
                Upload up to {maxImages} images of your equipment (JPGE, PNG). Max 5MB each.
            </p>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default EquipmentImageUploader;
