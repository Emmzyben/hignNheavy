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

interface ManageEscortsProps {
  onMessage?: (participantId: string, bookingId?: string | null) => void;
}

const ManageEscorts = ({ onMessage }: ManageEscortsProps) => {
  const [escorts, setEscorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewProviderId, setViewProviderId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchEscorts();
  }, []);

  const fetchEscorts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/list/escort");
      if (response.data.success) {
        setEscorts(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load escorts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEscorts = escorts.filter(e =>
    e.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (escort: any) => {
    setViewProviderId(escort.id);
    setProfileDialogOpen(true);
  };

  const handleToggleStatus = async (escort: any) => {
    const newStatus = escort.status === "active" ? "disabled" : "active";
    try {
      const response = await api.patch(`/users/${escort.id}/status`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Escort ${newStatus} successfully`);
        fetchEscorts();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Escorts</h1>
          <p className="text-muted-foreground">Monitor and manage certified escort services</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Fetching escorts..." />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Escorts</p>
              <p className="text-2xl font-bold">{escorts.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{escorts.filter(e => e.status === "active").length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Verification Pending</p>
              <p className="text-2xl font-bold text-orange-600">{escorts.filter(e => !e.profile_completed).length}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or email..."
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
                  <TableHead>Escort Service</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Compliance Check</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEscorts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No escorts found</TableCell>
                  </TableRow>
                ) : filteredEscorts.map((escort) => (
                  <TableRow key={escort.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
                          {escort.avatar_url ? (
                            <img src={escort.avatar_url} alt={escort.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} className="text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            {escort.full_name}
                            {escort.profile_completed && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">{escort.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{escort.company_name || "Personal Service"}</TableCell>
                    <TableCell>
                      <div className="text-xs">Lic: {escort.drivers_license_number || 'N/A'}</div>
                      <div className="text-xs font-mono">Cert: {escort.certification_number || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{new Date(escort.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={escort.status === "active" ? "default" : "destructive"}>
                        {escort.status}
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
                          <DropdownMenuItem onClick={() => handleView(escort)}>
                            <Eye className="h-4 w-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          {onMessage && (
                            <DropdownMenuItem onClick={() => onMessage(escort.id)}>
                              <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleStatus(escort)}>
                            <Ban className="h-4 w-4 mr-2" />
                            {escort.status === "active" ? "Deactivate" : "Activate"}
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

export default ManageEscorts;
