import { useState } from "react";
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
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

const mockVehicles = [
  {
    id: "V001",
    name: "Ford F-150 #1",
    type: "Pickup Truck",
    year: "2022",
    plateNumber: "TX-ESC-001",
    color: "White",
    equipment: ["LED Light Bar", "Flags", "Two-Way Radio", "First Aid Kit"],
    lastInspection: "2024-01-10",
    status: "available",
  },
  {
    id: "V002",
    name: "Chevy Silverado #2",
    type: "Pickup Truck",
    year: "2021",
    plateNumber: "TX-ESC-002",
    color: "Yellow",
    equipment: ["LED Light Bar", "Flags", "Two-Way Radio", "CB Radio"],
    lastInspection: "2024-01-05",
    status: "available",
  },
  {
    id: "V003",
    name: "Dodge Ram #3",
    type: "Pickup Truck",
    year: "2023",
    plateNumber: "TX-ESC-003",
    color: "Orange",
    equipment: ["LED Light Bar", "Flags", "Two-Way Radio", "GPS Tracker"],
    lastInspection: "2023-12-20",
    status: "on-job",
  },
];

const vehicleTypes = ["Pickup Truck", "SUV", "Van"];
const equipmentOptions = [
  "LED Light Bar",
  "Flags",
  "Two-Way Radio",
  "CB Radio",
  "First Aid Kit",
  "GPS Tracker",
  "Arrow Board",
  "Height Pole",
];

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<typeof mockVehicles[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    year: "",
    plateNumber: "",
    color: "",
    equipment: [] as string[],
  });

  const handleAddEdit = () => {
    if (!formData.name || !formData.type || !formData.plateNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingVehicle) {
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...v, ...formData, lastInspection: v.lastInspection }
          : v
      ));
      toast.success("Vehicle updated successfully");
    } else {
      const newVehicle = {
        id: `V${String(vehicles.length + 1).padStart(3, "0")}`,
        ...formData,
        lastInspection: new Date().toISOString().split("T")[0],
        status: "available" as const,
      };
      setVehicles([...vehicles, newVehicle]);
      toast.success("Vehicle added successfully");
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    toast.success("Vehicle removed");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      year: "",
      plateNumber: "",
      color: "",
      equipment: [],
    });
    setEditingVehicle(null);
  };

  const openEditDialog = (vehicle: typeof mockVehicles[0]) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      year: vehicle.year,
      plateNumber: vehicle.plateNumber,
      color: vehicle.color,
      equipment: vehicle.equipment,
    });
    setDialogOpen(true);
  };

  const toggleEquipment = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Available</Badge>;
      case "on-job":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />On Job</Badge>;
      default:
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Unavailable</Badge>;
    }
  };

  const stats = [
    { label: "Total Vehicles", value: vehicles.length, icon: Car },
    { label: "Available", value: vehicles.filter(v => v.status === "available").length, icon: CheckCircle },
    { label: "On Job", value: vehicles.filter(v => v.status === "on-job").length, icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">My Vehicles</h1>
          <p className="text-muted-foreground">Manage your escort vehicles and equipment</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vehicle.type} • {vehicle.year}</p>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Plate</p>
                  <p className="font-medium">{vehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Color</p>
                  <p className="font-medium">{vehicle.color}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Equipment</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle.equipment.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last Inspection: {vehicle.lastInspection}
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
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(vehicle.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vehicle Name *</Label>
              <Input
                placeholder="e.g., Ford F-150 #1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  placeholder="2023"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plate Number *</Label>
                <Input
                  placeholder="TX-ESC-001"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  placeholder="White"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Equipment</Label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map((item) => (
                  <Badge
                    key={item}
                    variant={formData.equipment.includes(item) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleEquipment(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEdit}>
              {editingVehicle ? "Save Changes" : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehiclesManagement;
