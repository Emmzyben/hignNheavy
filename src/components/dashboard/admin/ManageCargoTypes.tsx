import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import Loader from "@/components/ui/Loader";

interface CargoType {
  id: number;
  name: string;
  description: string;
}

const ManageCargoTypes = () => {
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchCargoTypes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/cargo-types");
      if (response.data.success) {
        setCargoTypes(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cargo types:", error);
      toast.error("Failed to load cargo types");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoTypes();
  }, []);

  const handleEdit = (type: CargoType) => {
    setEditingId(type.id);
    setFormData({ name: type.name, description: type.description });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/cargo-types/${editingId}`, formData);
        toast.success("Cargo type updated successfully");
      } else {
        await api.post("/cargo-types", formData);
        toast.success("Cargo type added successfully");
      }
      handleCancel();
      fetchCargoTypes();
    } catch (error: any) {
      console.error("Cargo type operation error:", error);
      toast.error(error.response?.data?.message || "Failed to save cargo type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this cargo type?")) return;

    try {
      await api.delete(`/cargo-types/${id}`);
      toast.success("Cargo type deleted successfully");
      fetchCargoTypes();
    } catch (error) {
      console.error("Delete cargo type error:", error);
      toast.error("Failed to delete cargo type");
    }
  };

  if (isLoading && cargoTypes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" text="Loading cargo types..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold">Cargo Types</h2>
          <p className="text-muted-foreground">Manage the cargo types available in the booking form.</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={18} className="mr-2" />
            Add New Type
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Cargo Type" : "Add New Cargo Type"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heavy Machinery"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this cargo type..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader size="sm" text="Saving..." />
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {editingId ? "Update Type" : "Save Type"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargoTypes.map((type) => (
          <div key={type.id} className="bg-card p-5 rounded-xl border border-border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg">{type.name}</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(type)}
                  className="p-2 hover:bg-muted rounded-full transition-colors text-primary"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="p-2 hover:bg-muted rounded-full transition-colors text-destructive"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {type.description || "No description provided."}
            </p>
          </div>
        ))}
        {cargoTypes.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No cargo types defined. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCargoTypes;
