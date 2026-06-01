import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { Save, RefreshCw } from "lucide-react";

interface Setting {
    id: string;
    value: string;
    description: string;
    updated_at: string;
}

const ManageSettings = () => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/settings");
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            toast.error("Failed to load platform settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdateSetting = async (id: string, value: string) => {
        try {
            setUpdating(id);
            const response = await api.post("/admin/settings", { id, value });
            if (response.data.success) {
                toast.success("Setting updated successfully");
                fetchSettings();
            }
        } catch (error) {
            console.error("Update setting error:", error);
            toast.error("Failed to update setting");
        } finally {
            setUpdating(null);
        }
    };

    const handlePercentageChange = (id: string, val: string) => {
        setSettings(prev => prev.map(s => s.id === id ? { ...s, value: val } : s));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        {settings.find(s => s.id === 'platform_fee_percentage') && (
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20">
                                Current Platform Fee: {settings.find(s => s.id === 'platform_fee_percentage')?.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-muted-foreground font-medium">Configure global platform fee and commissions</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchSettings} className="gap-2">
                    <RefreshCw size={16} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-6">
                {settings.map((setting) => (
                    <Card key={setting.id} className="border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary transform origin-left transition-transform duration-300 group-hover:scale-x-150" />
                        <CardHeader>
                            <CardTitle className="capitalize">{setting.id.replace(/_/g, " ")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-end gap-4">
                                <div className="w-full md:w-64 space-y-2">
                                    <Label>Value</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="1"
                                            min="0"
                                            max="100"
                                            value={setting.value}
                                            onChange={(e) => handlePercentageChange(setting.id, e.target.value)}
                                            className="bg-muted/30 font-bold pr-10"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                            %
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleUpdateSetting(setting.id, setting.value)}
                                    disabled={updating === setting.id}
                                    className="gap-2 px-6"
                                >
                                    {updating === setting.id ? (
                                        <RefreshCw className="animate-spin" size={16} />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-4 font-mono">
                                Last updated: {new Date(setting.updated_at).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}

                {settings.length === 0 && (
                    <Card className="border-dashed border-2">
                        <CardContent className="py-12 text-center">
                            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="text-muted-foreground" size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">No settings found in the database</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                The platform configuration table is currently empty. Click the button below to initialize the default platform fee setting.
                            </p>
                            <Button 
                                onClick={() => handleUpdateSetting('platform_fee_percentage', '15')}
                                disabled={updating === 'platform_fee_percentage'}
                                className="gap-2"
                            >
                                {updating === 'platform_fee_percentage' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                                Initialize Default Platform Fee (15%)
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ManageSettings;
