import { useState, useEffect } from 'react';
import { User, Plus, Edit, Trash2, Mail, Phone, Shield, Truck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  status: 'available' | 'on-job' | 'off-duty';
  completedJobs: number;
}

const DriversManagement = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license: 'CDL-A',
    licenseExpiry: '',
    password: '',
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/drivers');
      if (response.data.success) {
        const mappedDrivers = response.data.data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          license: d.license_number,
          licenseExpiry: d.license_expiry ? new Date(d.license_expiry).toISOString().split('T')[0] : '',
          status: d.status,
          completedJobs: d.completed_jobs
        }));
        setDrivers(mappedDrivers);
      }
    } catch (error: any) {
      toast.error('Failed to load drivers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      license: 'CDL-A',
      licenseExpiry: '',
      password: '',
    });
    setEditingDriver(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      license: driver.license,
      licenseExpiry: driver.licenseExpiry,
      password: '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone || (!editingDriver && !formData.password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingDriver) {
        const response = await api.put(`/drivers/${editingDriver.id}`, {
          ...formData,
          status: editingDriver.status // Keep current status
        });
        if (response.data.success) {
          toast.success('Driver updated successfully');
          fetchDrivers();
          setDialogOpen(false);
          resetForm();
        }
      } else {
        const response = await api.post('/drivers', formData);
        if (response.data.success) {
          toast.success('Driver added successfully');
          fetchDrivers();
          setDialogOpen(false);
          resetForm();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving driver');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this driver?')) return;

    try {
      const response = await api.delete(`/drivers/${id}`);
      if (response.data.success) {
        setDrivers(drivers.filter(d => d.id !== id));
        toast.success('Driver removed');
      }
    } catch (error: any) {
      toast.error('Failed to delete driver');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500';
      case 'on-job':
        return 'bg-blue-500/20 text-blue-500';
      case 'off-duty':
        return 'bg-muted text-muted-foreground';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading drivers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Driver Management</h1>
          <p className="text-muted-foreground">Add and manage your drivers</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{drivers.length}</p>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <User className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{drivers.filter(d => d.status === 'available').length}</p>
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
                <p className="text-2xl font-bold">{drivers.filter(d => d.status === 'on-job').length}</p>
                <p className="text-sm text-muted-foreground">On Job</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No drivers added yet</p>
            <Button variant="link" onClick={handleOpenAdd}>Add your first driver</Button>
          </div>
        ) : (
          drivers.map((driver) => (
            <Card key={driver.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(driver)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(driver.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>{driver.license} • Expires {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{driver.completedJobs}</span> completed jobs
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@email.com"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                disabled={submitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>License Type</Label>
                <Select
                  value={formData.license}
                  onValueChange={(val) => setFormData({ ...formData, license: val })}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDL-A">CDL-A</SelectItem>
                    <SelectItem value="CDL-B">CDL-B</SelectItem>
                    <SelectItem value="CDL-C">CDL-C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>License Expiry</Label>
                <Input
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>
            {!editingDriver && (
              <div className="space-y-2">
                <Label>Initial Password *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create login password"
                  disabled={submitting}
                />
                <p className="text-xs text-muted-foreground">Driver will use this to log into the app</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingDriver ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                editingDriver ? 'Save Changes' : 'Add Driver'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriversManagement;
