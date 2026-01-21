import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, PlusCircle, Package, FileText, Wallet, MessageSquare,
    Truck, ClipboardList, Users, Settings, DollarSign, Car,
    ChevronLeft, Menu, LogOut, X, User, MapPin, Star
} from "lucide-react";
import logo from "@/assets/logo.svg";
import { toast } from "sonner";
import NotificationBell from "./NotificationBell";

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeSection?: string;
    onSectionChange?: (section: string) => void;
    onMessage?: (participantId: string, bookingId?: string | null) => void;
    menuItemsOverride?: { id: string, label: string, icon: any }[];
}

const MENU_ITEMS: Record<string, any[]> = {
    shipper: [
        { id: 'bookings', label: 'My Bookings', icon: Package },
        { id: 'new-booking', label: 'New Booking', icon: PlusCircle },
        { id: 'tracking', label: 'Track Shipment', icon: MapPin },
        { id: 'payments', label: 'Payments', icon: DollarSign },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ],
    carrier: [
        { id: 'bookings', label: 'Available Bookings', icon: ClipboardList },
        { id: 'drivers', label: 'Manage Drivers', icon: Users },
        { id: 'equipment', label: 'Equipment', icon: Truck },
        { id: 'payouts', label: 'Payouts', icon: DollarSign },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ],
    escort: [
        { id: 'available', label: 'Available Jobs', icon: FileText },
        { id: 'vehicles', label: 'My Vehicles', icon: Car },

        { id: 'payouts', label: 'Payouts', icon: DollarSign },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ],
    admin: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'quotes', label: 'Manage Quotes', icon: FileText },
        { id: 'shippers', label: 'Manage Shippers', icon: Users },
        { id: 'carriers', label: 'Manage Carriers', icon: Truck },
        { id: 'escorts', label: 'Manage Escorts', icon: Car },
        { id: 'bookings', label: 'All Bookings', icon: Package },
        { id: 'payouts', label: 'Payouts', icon: Wallet },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
    ]
};

const DashboardLayout = ({ children, activeSection, onSectionChange, onMessage, menuItemsOverride }: DashboardLayoutProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleChatAdmin = () => {
        if (onMessage) {
            onMessage("admin");
        }
    };

    const role = user?.role || 'shipper';
    const menuItems = menuItemsOverride || MENU_ITEMS[role] || [];
    const isProfilePage = location.pathname === '/dashboard/profile';

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleNavClick = (id: string) => {
        if (isProfilePage) {
            const dashboardPath = `/dashboard/${role}`;
            // In a real app we might pass state, but simplicity for now:
            navigate(dashboardPath);
        } else if (onSectionChange) {
            onSectionChange(id);
        }
        setMobileMenuOpen(false);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="p-6 border-b border-border flex items-center justify-between">
                {(sidebarOpen || mobileMenuOpen) && (
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="logo" className="w-20" />
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex"
                >
                    {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                            activeSection === item.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {(sidebarOpen || mobileMenuOpen) && <span className="font-medium text-sm">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border mt-auto space-y-2">
                {role !== 'admin' && onMessage && (
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 text-primary hover:text-primary hover:bg-primary/10 h-10 px-3",
                            !(sidebarOpen || mobileMenuOpen) && "justify-center px-0"
                        )}
                        onClick={handleChatAdmin}
                    >
                        <MessageSquare size={20} />
                        {(sidebarOpen || mobileMenuOpen) && <span className="text-sm font-medium">Chat with Admin</span>}
                    </Button>
                )}
                <Link
                    to="/dashboard/profile"
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-xl transition-colors",
                        isProfilePage ? "bg-accent shadow-inner" : "hover:bg-accent"
                    )}
                >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-sm text-primary font-bold">
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    {(sidebarOpen || mobileMenuOpen) && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">{user?.full_name}</p>
                            <p className="text-[10px] text-muted-foreground capitalize font-medium">{user?.role} Account</p>
                        </div>
                    )}
                </Link>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-10 px-3",
                        !(sidebarOpen || mobileMenuOpen) && "justify-center px-0"
                    )}
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    {(sidebarOpen || mobileMenuOpen) && <span className="text-sm font-medium">Log Out</span>}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar - Desktop */}
            <aside className={cn(
                "hidden lg:block bg-card border-r border-border transition-all duration-300 h-screen sticky top-0 z-40",
                sidebarOpen ? "w-64" : "w-20"
            )}>
                <SidebarContent />
            </aside>

            {/* Sidebar - Mobile */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 lg:hidden shadow-2xl">
                        <SidebarContent />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={20} />
                        </Button>
                    </aside>
                </>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-4 lg:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={20} />
                    </Button>
                    <div className="ml-4 flex items-center gap-2">
                        <img src={logo} alt="logo" className="w-8" />
                        <h2 className="font-display font-black text-primary text-lg">HighnHeavy</h2>
                    </div>
                    <div className="ml-auto">
                        <NotificationBell />
                    </div>
                </header>

                {/* Top Header - Desktop */}
                <header className="h-20 border-b border-border bg-card/40 backdrop-blur-md hidden lg:flex items-center px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-display font-black capitalize tracking-tight">
                            {isProfilePage ? "Profile Settings" : (menuItems.find(i => i.id === activeSection)?.label || "Dashboard")}
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium">
                            Manage your logistics operations and account
                        </p>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <Button variant="outline" className="hidden xl:flex font-bold" onClick={() => navigate('/')}>
                            Visit Site
                        </Button>
                        <div className="h-10 w-px bg-border mx-2" />
                        <NotificationBell />
                        <div className="text-right">
                            <p className="text-sm font-bold">{user?.full_name}</p>
                            <p className="text-[10px] text-muted-foreground capitalize font-bold tracking-widest">{user?.role}</p>
                        </div>
                        <Link to="/dashboard/profile" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:scale-105 transition-transform">
                            <User size={18} className="text-primary" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
