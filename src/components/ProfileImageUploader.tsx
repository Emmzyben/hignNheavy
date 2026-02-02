import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, Loader2, User, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ProfileImageUploaderProps {
    currentImageUrl?: string;
    onUploadSuccess: (newUrl: string) => void;
}

const ProfileImageUploader = ({ currentImageUrl, onUploadSuccess }: ProfileImageUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setIsUploading(true);

        try {
            // 1. Compress the image
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.5, // Even smaller for profile pics
                maxWidthOrHeight: 400,
                useWebWorker: true,
            });

            // 2. Prepare FormData
            const uploadFormData = new FormData();
            uploadFormData.append('avatar', compressedFile);

            // 3. Upload to our backend
            const response = await api.post('/users/upload-avatar', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const imageUrl = response.data.url;
                onUploadSuccess(imageUrl);
                toast.success('Profile picture updated successfully');
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload profile picture');
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative group w-32 h-32 mx-auto">
            {/* Avatar Display */}
            <div
                className={`w-full h-full rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center relative ${currentImageUrl ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}
                onClick={() => currentImageUrl && setIsOpen(true)}
            >
                {currentImageUrl ? (
                    <img
                        src={currentImageUrl}
                        alt="ProfileAvatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User size={48} className="text-primary/40" />
                )}

                {/* Loading Overlay */}
                {isUploading ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                ) : (
                    currentImageUrl && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            {/* Overlay content if needed */}
                        </div>
                    )
                )}
            </div>

            {/* Edit Trigger Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                }}
                disabled={isUploading}
                className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 z-20"
                title="Change profile picture"
            >
                <Camera className="w-4 h-4" />
            </button>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Full Image Preview Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl border-none bg-transparent shadow-none p-0 flex flex-col items-center justify-center sm:max-w-md lg:max-w-2xl">
                    <DialogHeader className="hidden">
                        <DialogTitle>Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="relative group w-full aspect-square rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <img
                            src={currentImageUrl}
                            alt="Profile"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfileImageUploader;
