import { useNavigate } from "react-router-dom";
import {
  Truck,
  ClipboardList,
  Navigation,
  User,
  LogOut,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface DriverBottomNavProps {
  activeTab: "requests" | "active" | "trips" | "profile" | "messages";
}

const DriverBottomNav = ({ activeTab }: DriverBottomNavProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { id: "requests" as const, icon: ClipboardList, label: "Requests", path: "/dashboard/driver?section=requests" },
    { id: "active" as const, icon: Navigation, label: "Active", path: "/dashboard/driver?section=active" },
    { id: "trips" as const, icon: Truck, label: "Trips", path: "/dashboard/driver?section=trips" },
    { id: "messages" as const, icon: MessageSquare, label: "Messages", path: "/dashboard/driver?section=messages" },
    { id: "profile" as const, icon: User, label: "Profile", path: "/dashboard/driver?section=profile" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-2 px-3 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DriverBottomNav;
