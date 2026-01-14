import { useState } from 'react';
import { Truck, Plus, Edit, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Equipment {
  id: string;
  type: string;
  name: string;
  capacity: string;
  dimensions: string;
  plateNumber: string;
  year: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastInspection: string;
}

const initialEquipment: Equipment[] = [
  {
    id: 'E1',
    type: 'Lowboy Trailer',
    name: 'Lowboy 53ft',
    capacity: '80,000 lbs',
    dimensions: '53ft x 8.5ft',
    plateNumber: 'TX-LB-4521',
    year: '2022',
    status: 'available',
    lastInspection: '2024-01-05',
  },
  {
    id: 'E2',
    type: 'Step Deck',
    name: 'Step Deck 48ft',
    capacity: '48,000 lbs',
    dimensions: '48ft x 8.5ft',
    plateNumber: 'TX-SD-3892',
    year: '2021',
    status: 'in-use',
    lastInspection: '2024-01-10',
  },
  {
    id: 'E3',
    type: 'RGN Trailer',
    name: 'RGN 55ft',
    capacity: '100,000 lbs',
    dimensions: '55ft x 8.5ft',
    plateNumber: 'TX-RG-7734',
    year: '2023',
    status: 'available',
    lastInspection: '2024-01-12',
  },
];

const equipmentTypes = [
  'Lowboy Trailer',
  'Step Deck',
  'RGN Trailer',
  'Flatbed',
  'Double Drop',
  'Extendable Trailer',
  'Multi-Axle',
];

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    capacity: '',
    dimensions: '',
    plateNumber: '',
    year: '',
    lastInspection: '',
  });

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      capacity: '',
      dimensions: '',
      plateNumber: '',
      year: '',
      lastInspection: '',
    });
    setEditingEquipment(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setFormData({
      type: item.type,
      name: item.name,
      capacity: item.capacity,
      dimensions: item.dimensions,
      plateNumber: item.plateNumber,
      year: item.year,
      lastInspection: item.lastInspection,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.type || !formData.name || !formData.plateNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingEquipment) {
      setEquipment(equipment.map(e => 
        e.id === editingEquipment.id 
          ? { ...e, ...formData, status: e.status }
          : e
      ));
      toast.success('Equipment updated successfully');
    } else {
      const newEquipment: Equipment = {
        id: `E${Date.now()}`,
        ...formData,
        status: 'available',
      };
      setEquipment([...equipment, newEquipment]);
      toast.success('Equipment added successfully');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
    toast.success('Equipment removed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500';
      case 'in-use':
        return 'bg-blue-500/20 text-blue-500';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Equipment</h1>
          <p className="text-muted-foreground">Manage your fleet and trailers</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{equipment.length}</p>
                <p className="text-sm text-muted-foreground">Total Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{equipment.filter(e => e.status === 'available').length}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{equipment.filter(e => e.status === 'in-use').length}</p>
                <p className="text-sm text-muted-foreground">In Use</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item) => (
          <Card key={item.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.type}</p>
              <Badge className={getStatusColor(item.status)}>
                {item.status.replace('-', ' ')}
              </Badge>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{item.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">{item.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plate</span>
                  <span className="font-medium">{item.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-medium">{item.year}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last inspection:</span>
                <span>{new Date(item.lastInspection).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Equipment Type *</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Name/Description *</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Lowboy 53ft"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input 
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g., 80,000 lbs"
                />
              </div>
              <div className="space-y-2">
                <Label>Dimensions</Label>
                <Input 
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g., 53ft x 8.5ft"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plate Number *</Label>
                <Input 
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="TX-XX-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input 
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2023"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last Inspection Date</Label>
              <Input 
                type="date"
                value={formData.lastInspection}
                onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingEquipment ? 'Save Changes' : 'Add Equipment'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentManagement;
