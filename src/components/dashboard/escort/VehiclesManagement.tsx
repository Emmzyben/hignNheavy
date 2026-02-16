import { useState, useEffect } from "react";
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  Package,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import EquipmentImageUploader from "../EquipmentImageUploader";
import Loader from "@/components/ui/Loader";

const vehicleTypes = ["Pickup Truck", "SUV", "Van", "Pilot Car"];

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    year: "",
    plate_number: "",
    vin: "",
    capacity: "",
    dimensions: "",
    status: "available",
    last_inspection: "",
    photos: [] as string[],
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        const parsedData = response.data.data.map((item: any) => ({
          ...item,
          photos: typeof item.photos === 'string' ? JSON.parse(item.photos) : (item.photos || [])
        }));
        setVehicles(parsedData);
      }
    } catch (error) {
      console.error('Fetch vehicles error:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type || !formData.plate_number) {
      toast.error("Please fill in all required fields (Name, Type, Plate)");
      return;
    }

    setIsSaving(true);
    try {
      if (editingVehicle) {
        const response = await api.put(`/vehicles/${editingVehicle.id}`, formData);
        if (response.data.success) {
          toast.success("Vehicle updated successfully");
          fetchVehicles();
        }
      } else {
        const response = await api.post('/vehicles', formData);
        if (response.data.success) {
          toast.success("Vehicle added successfully");
          fetchVehicles();
        }
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save vehicle");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle?")) return;

    setIsDeleting(id);
    try {
      const response = await api.delete(`/vehicles/${id}`);
      if (response.data.success) {
        toast.success("Vehicle removed");
        setVehicles(vehicles.filter(v => v.id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete vehicle");
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      year: "",
      plate_number: "",
      vin: "",
      capacity: "",
      dimensions: "",
      status: "available",
      last_inspection: new Date().toISOString().split('T')[0],
      photos: [],
    });
    setEditingVehicle(null);
  };

  const openEditDialog = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      year: vehicle.year || "",
      plate_number: vehicle.plate_number || "",
      vin: vehicle.vin || "",
      capacity: vehicle.capacity || "",
      dimensions: vehicle.dimensions || "",
      status: vehicle.status || "available",
      last_inspection: vehicle.last_inspection ? new Date(vehicle.last_inspection).toISOString().split('T')[0] : "",
      photos: vehicle.photos || [],
    });
    setDialogOpen(true);
  };

  const handleOpenDetails = (vehicle: any) => {
    setSelectedDetails(vehicle);
    setActivePhoto(0);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500/20 text-green-600 border-0"><CheckCircle className="h-3 w-3 mr-1" />Available</Badge>;
      case "in-use":
      case "on-job":
        return <Badge className="bg-blue-500/20 text-blue-600 border-0"><AlertCircle className="h-3 w-3 mr-1" />On Job</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-0">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">My Vehicles</h1>
          <p className="text-muted-foreground">Manage your escort vehicles and equipment</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2 shadow-md">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader size="lg" text="Loading your fleet..." />
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-lg font-medium">No vehicles found</h3>
            <p className="text-muted-foreground">Add your first escort vehicle to start quoting on jobs.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:border-primary/50 transition-all border shadow-sm group overflow-hidden flex flex-col">
              {vehicle.photos && vehicle.photos.length > 0 && (
                <div className="h-40 w-full overflow-hidden border-b">
                  <img src={vehicle.photos[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-3 border-b bg-muted/30">
                <div className="flex items-start justify-between">
                  <div
                    className="p-2 bg-primary/10 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => handleOpenDetails(vehicle)}
                  >
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 px-3 min-w-0">
                    <CardTitle className="text-lg font-bold truncate">{vehicle.name}</CardTitle>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest truncate">{vehicle.type}</p>
                  </div>
                  <div className="flex gap-1 items-center shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleOpenDetails(vehicle)} title="View Details">
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    {getStatusBadge(vehicle.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Plate Number</p>
                    <p className="font-mono font-bold text-primary">{vehicle.plate_number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">VIN</p>
                    <p className="font-mono text-xs truncate" title={vehicle.vin}>{vehicle.vin || 'N/A'}</p>
                  </div>
                </div>

                <div className="text-xs p-2 bg-muted/50 rounded border flex justify-between items-center">
                  <span className="text-muted-foreground">Last Inspection</span>
                  <span className="font-medium">{vehicle.last_inspection ? new Date(vehicle.last_inspection).toLocaleDateString() : 'Never'}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => openEditDialog(vehicle)}
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(vehicle.id)}
                    disabled={isDeleting === vehicle.id}
                  >
                    {isDeleting === vehicle.id ? <Loader size="sm" text="" /> : <Trash2 className="h-3 w-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
      }

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Update Escort Vehicle" : "Add Escort Vehicle"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Name *</Label>
                <Input
                  placeholder="Ford F-150 #1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plate Number *</Label>
                <Input
                  placeholder="TX-ESC-001"
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>VIN</Label>
                <Input
                  placeholder="VIN Number"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  placeholder="2023"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Inspection Date</Label>
              <Input
                type="date"
                value={formData.last_inspection}
                onChange={(e) => setFormData({ ...formData, last_inspection: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Vehicle Photos ({formData.photos.length}/5)</Label>
              <EquipmentImageUploader
                images={formData.photos}
                onImagesChange={(photos) => setFormData({ ...formData, photos })}
                maxImages={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader size="sm" text="" className="mr-2" /> : null}
              {editingVehicle ? "Save Changes" : "Register Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <Car className="text-primary" />
              {selectedDetails?.name} Details
            </DialogTitle>
          </DialogHeader>

          {selectedDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* Photo Gallery */}
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted border">
                  {(selectedDetails.photos && (typeof selectedDetails.photos === 'string' ? JSON.parse(selectedDetails.photos) : selectedDetails.photos)).length > 0 ? (
                    <img
                      src={(typeof selectedDetails.photos === 'string' ? JSON.parse(selectedDetails.photos) : selectedDetails.photos)[activePhoto]}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-20">
                      <Car size={64} />
                      <p className="mt-2 font-bold">No Photos</p>
                    </div>
                  )}
                </div>

                {(selectedDetails.photos && (typeof selectedDetails.photos === 'string' ? JSON.parse(selectedDetails.photos) : selectedDetails.photos)).length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {(typeof selectedDetails.photos === 'string' ? JSON.parse(selectedDetails.photos) : selectedDetails.photos).map((url: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${activePhoto === i ? 'border-primary' : 'border-transparent opacity-60'}`}
                      >
                        <img src={url} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedDetails.status)}
                  <p className="text-xs text-muted-foreground uppercase font-black">ID: {selectedDetails.id.split('-')[0]}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Vehicle Type</p>
                    <p className="font-bold flex items-center gap-2">
                      <Package size={16} className="text-primary" />
                      {selectedDetails.type}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Plate Number</p>
                      <p className="font-mono font-bold text-primary">{selectedDetails.plate_number}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Year</p>
                      <p className="font-bold">{selectedDetails.year || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">VIN Number</p>
                    <p className="font-mono text-xs">{selectedDetails.vin || 'Not Registered'}</p>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Last Inspection</p>
                        <p className="font-bold text-sm">
                          {selectedDetails.last_inspection ? new Date(selectedDetails.last_inspection).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDetailsOpen(false)} className="w-full md:w-auto">Close</Button>
            <Button onClick={() => { setDetailsOpen(false); openEditDialog(selectedDetails!); }} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Edit Specification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehiclesManagement;
