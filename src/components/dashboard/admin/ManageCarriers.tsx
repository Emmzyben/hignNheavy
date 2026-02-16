import { useState, useEffect } from "react";
import { Search, Eye, Ban, MoreVertical, Loader2, Download, CheckCircle2, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/lib/api";
import ProviderProfileDialog from "./ProviderProfileDialog";
import Loader from "@/components/ui/Loader";

interface ManageCarriersProps {
  onMessage?: (participantId: string, bookingId?: string | null) => void;
}

const ManageCarriers = ({ onMessage }: ManageCarriersProps) => {
  const [carriers, setCarriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewProviderId, setViewProviderId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchCarriers();
  }, []);

  const fetchCarriers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/list/carrier");
      if (response.data.success) {
        setCarriers(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load carriers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCarriers = carriers.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mc_number?.includes(searchTerm)
  );

  const handleView = (carrier: any) => {
    setViewProviderId(carrier.id);
    setProfileDialogOpen(true);
  };

  const handleToggleStatus = async (carrier: any) => {
    const newStatus = carrier.status === "active" ? "disabled" : "active";
    try {
      const response = await api.patch(`/users/${carrier.id}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Carrier ${newStatus} successfully`);
        fetchCarriers();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Carriers</h1>
          <p className="text-muted-foreground">Approve and monitor carrier accounts</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Fetching carriers..." />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Carriers</p>
              <p className="text-2xl font-bold">{carriers.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{carriers.filter(c => c.status === "active").length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600">{carriers.filter(c => !c.profile_completed).length}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or MC#..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Carrier Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Compliance (MC/DOT)</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCarriers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No carriers found</TableCell>
                  </TableRow>
                ) : filteredCarriers.map((carrier) => (
                  <TableRow key={carrier.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                          {carrier.avatar_url ? (
                            <img src={carrier.avatar_url} alt={carrier.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} className="text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            {carrier.full_name}
                            {carrier.profile_completed && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">{carrier.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{carrier.company_name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="text-xs">MC: {carrier.mc_number || 'N/A'}</div>
                      <div className="text-xs font-mono">DOT: {carrier.dot_number || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{new Date(carrier.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={carrier.status === "active" ? "default" : "destructive"}>
                        {carrier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(carrier)}>
                            <Eye className="h-4 w-4 mr-2" /> Full Profile
                          </DropdownMenuItem>
                          {onMessage && (
                            <DropdownMenuItem onClick={() => onMessage(carrier.id)}>
                              <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleStatus(carrier)}>
                            <Ban className="h-4 w-4 mr-2" />
                            {carrier.status === "active" ? "Block Access" : "Restore Access"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <ProviderProfileDialog
        providerId={viewProviderId}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onMessage={onMessage}
      />
    </div>
  );
};

export default ManageCarriers;
