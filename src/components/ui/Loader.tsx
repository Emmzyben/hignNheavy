import React from 'react';
import logo from '../../assets/logo.svg';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullPage?: boolean;
    className?: string;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    fullPage = false,
    className = '',
    text = 'Loading...'
}) => {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-20 h-20',
        lg: 'w-32 h-32',
        xl: 'w-48 h-48'
    };

    const loaderContent = (
        <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
            <div className="relative">
                {/* Outer glowing ring */}
                <div className={`absolute inset-0 rounded-full border-2 border-primary/20 animate-ping ${sizeClasses[size]}`} />

                {/* Spinning border */}
                <div className={`absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin ${sizeClasses[size]}`} />

                {/* Logo container with pulse */}
                <div className={`flex items-center justify-center bg-white rounded-full shadow-xl overflow-hidden p-2 animate-logo-pulse ${sizeClasses[size]}`}>
                    <img
                        src={logo}
                        alt="HighnHeavy Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {text && (
                <p className="text-muted-foreground font-display font-medium animate-pulse tracking-widest uppercase text-xs">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
                <div className="relative">
                    {/* Background decorative elements */}
                    <div className="absolute -inset-24 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                    <div className="relative z-10">
                        {loaderContent}
                    </div>
                </div>
            </div>
        );
    }

    return loaderContent;
};

export default Loader;
