import { motion } from "framer-motion";
import {
    Users, Truck, Car, Package,
    DollarSign, TrendingUp, AlertCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewSectionProps {
    setActiveSection: (section: string) => void;
}

const OverviewSection = ({ setActiveSection }: OverviewSectionProps) => {
    const stats = [
        { label: "Total Shippers", value: "1,284", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", section: "shippers" },
        { label: "Active Carriers", value: "856", icon: Truck, color: "text-green-500", bg: "bg-green-500/10", section: "carriers" },
        { label: "Escort Drivers", value: "432", icon: Car, color: "text-purple-500", bg: "bg-purple-500/10", section: "escorts" },
        { label: "Total Bookings", value: "15.4k", icon: Package, color: "text-orange-500", bg: "bg-orange-500/10", section: "bookings" },
    ];

    const recentActivities = [
        { title: "New Shipper Registration", time: "2 mins ago", type: "user" },
        { title: "Payout Request: $4,500", time: "15 mins ago", type: "payment" },
        { title: "New Booking Created #HH-9402", time: "1 hour ago", type: "booking" },
        { title: "Carrier License Verified", time: "3 hours ago", type: "verification" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setActiveSection(stat.section)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={stat.bg + " p-3 rounded-xl"}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-lg">Platform Activity</h3>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="divide-y divide-border">
                        {recentActivities.map((activity, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{activity.title}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <Button variant="ghost" size="sm">Details</Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg mb-4">System Status</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>API Gateway</span>
                            </div>
                            <span className="text-muted-foreground">Operational</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Database Cluster</span>
                            </div>
                            <span className="text-muted-foreground">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                <span>Email Service</span>
                            </div>
                            <span className="text-muted-foreground">Delayed</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border mt-4">
                        <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 p-4 rounded-xl">
                            <AlertCircle size={20} />
                            <p className="text-xs font-medium">3 Pending verification requests require immediate attention.</p>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-4 hero-gradient border-0 font-bold"
                        onClick={() => setActiveSection("shippers")}
                    >
                        Go to Verifications
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
