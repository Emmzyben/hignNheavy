import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageLightboxProps {
    src: string | null
    isOpen: boolean
    onClose: () => void
    alt?: string
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, isOpen, onClose, alt }) => {
    const [scale, setScale] = React.useState(1)
    const [rotation, setRotation] = React.useState(0)

    React.useEffect(() => {
        if (!isOpen) {
            setScale(1)
            setRotation(0)
        }
    }, [isOpen])

    if (!src) return null

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
    const handleRotate = () => setRotation(prev => (prev + 90) % 360)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/90 border-none flex flex-col items-center justify-center">
                <DialogTitle className="sr-only">Full Screen Image View</DialogTitle>
                
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-none" onClick={handleZoomOut}>
                        <ZoomOut size={18} />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-none" onClick={handleZoomIn}>
                        <ZoomIn size={18} />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-none" onClick={handleRotate}>
                        <RotateCw size={18} />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-none" onClick={onClose}>
                        <X size={18} />
                    </Button>
                </div>

                <div className="w-full h-full flex items-center justify-center overflow-auto p-10">
                    <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
                        <img
                            src={src}
                            alt={alt || "Full screen view"}
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                            style={{ 
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                                cursor: scale > 1 ? 'move' : 'default'
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
