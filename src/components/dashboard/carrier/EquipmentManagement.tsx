import { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, Calendar, CheckCircle, Loader2, Eye, MapPin, Package, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';
import EquipmentImageUploader from '../EquipmentImageUploader';

interface Equipment {
  id: string;
  type: string;
  name: string;
  plate_number: string;
  vin: string;
  year: string;
  capacity: string;
  dimensions: string;
  status: 'available' | 'in-use' | 'maintenance';
  last_inspection: string;
  photos: string[];
}

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
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<Equipment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    capacity: '',
    dimensions: '',
    plate_number: '',
    vin: '',
    year: '',
    last_inspection: '',
    status: 'available' as any,
    photos: [] as string[],
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        const parsedData = response.data.data.map((item: any) => ({
          ...item,
          photos: typeof item.photos === 'string' ? JSON.parse(item.photos) : (item.photos || [])
        }));
        setEquipment(parsedData);
      }
    } catch (error) {
      console.error('Fetch equipment error:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      capacity: '',
      dimensions: '',
      plate_number: '',
      vin: '',
      year: '',
      last_inspection: '',
      status: 'available',
      photos: [],
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
      capacity: item.capacity || '',
      dimensions: item.dimensions || '',
      plate_number: item.plate_number || '',
      vin: item.vin || '',
      year: item.year || '',
      last_inspection: item.last_inspection ? new Date(item.last_inspection).toISOString().split('T')[0] : '',
      status: item.status,
      photos: item.photos || [],
    });
    setDialogOpen(true);
  };

  const handleOpenDetails = (item: Equipment) => {
    setSelectedDetails(item);
    setActivePhoto(0);
    setDetailsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.type || !formData.name || !formData.plate_number) {
      toast.error('Please fill in required fields (Type, Name, Plate Number)');
      return;
    }

    setIsSaving(true);
    try {
      if (editingEquipment) {
        const response = await api.put(`/vehicles/${editingEquipment.id}`, formData);
        if (response.data.success) {
          toast.success('Equipment updated successfully');
          fetchEquipment();
        }
      } else {
        const response = await api.post('/vehicles', formData);
        if (response.data.success) {
          toast.success('Equipment added successfully');
          fetchEquipment();
        }
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save equipment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this equipment?')) return;

    setIsDeleting(id);
    try {
      const response = await api.delete(`/vehicles/${id}`);
      if (response.data.success) {
        toast.success('Equipment removed');
        setEquipment(equipment.filter(e => e.id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete equipment');
    } finally {
      setIsDeleting(null);
    }
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
        return 'bg-muted text-muted-foreground';
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
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Loading your fleet...</p>
        </div>
      ) : equipment.length === 0 ? (
        <div className="text-center p-20 bg-card border border-dashed rounded-xl">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold">No equipment added yet</h3>
          <p className="text-muted-foreground mb-6">Start by adding your trucks or trailers to your fleet.</p>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Equipment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <Card key={item.id} className="hover:border-primary/50 transition-colors border shadow-sm overflow-hidden flex flex-col">
              {item.photos && item.photos.length > 0 && (
                <div className="h-40 w-full overflow-hidden border-b">
                  <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 bg-primary/20 rounded-lg cursor-pointer hover:bg-primary/30 transition-colors"
                    onClick={() => handleOpenDetails(item)}
                  >
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 px-3 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleOpenDetails(item)} title="View Details">
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(item)} disabled={isDeleting === item.id}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                    >
                      {isDeleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.type}</p>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace('-', ' ')}
                </Badge>

                <div className="mt-5 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{item.capacity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="font-medium">{item.dimensions || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plate</span>
                    <span className="font-medium">{item.plate_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{item.year || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last inspection:</span>
                  <span className="font-medium">
                    {item.last_inspection ? new Date(item.last_inspection).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                  value={formData.plate_number}
                  onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
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
              <Label>VIN</Label>
              <Input
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="Vehicle Identification Number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
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
              <div className="space-y-2">
                <Label>Last Inspection Date</Label>
                <Input
                  type="date"
                  value={formData.last_inspection}
                  onChange={(e) => setFormData({ ...formData, last_inspection: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Equipment Photos ({formData.photos.length}/5)</Label>
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
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingEquipment ? 'Save Changes' : 'Add Equipment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <Truck className="text-primary" />
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
                      alt="Equipment"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-20">
                      <Truck size={64} />
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
                  <Badge className={getStatusColor(selectedDetails.status)}>
                    {selectedDetails.status.replace('-', ' ')}
                  </Badge>
                  <p className="text-xs text-muted-foreground uppercase font-black">ID: {selectedDetails.id.split('-')[0]}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Equipment Type</p>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Capacity</p>
                      <p className="font-bold">{selectedDetails.capacity || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Dimensions</p>
                      <p className="font-bold">{selectedDetails.dimensions || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">VIN / Chassis Number</p>
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
            <Button onClick={() => { setDetailsOpen(false); handleOpenEdit(selectedDetails!); }} className="w-full md:w-auto">
              <Edit className="h-4 w-4 mr-2" />
              Edit Specification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentManagement;
