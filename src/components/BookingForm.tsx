import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    pickup: "",
    delivery: "",
    cargoType: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    shipmentDate: "",
    permitRequired: false,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quote request submitted! We'll contact you soon.");
    // Reset form
    setFormData({
      pickup: "",
      delivery: "",
      cargoType: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      shipmentDate: "",
      permitRequired: false,
      description: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Location */}
        <div>
          <Label htmlFor="pickup">Pickup Location</Label>
          <Input
            id="pickup"
            placeholder="Enter pickup address"
            value={formData.pickup}
            onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
            required
          />
        </div>

        {/* Delivery Location */}
        <div>
          <Label htmlFor="delivery">Delivery Location</Label>
          <Input
            id="delivery"
            placeholder="Enter delivery address"
            value={formData.delivery}
            onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
            required
          />
        </div>

        {/* Cargo Type */}
        <div>
          <Label htmlFor="cargoType">Cargo Type</Label>
          <Select value={formData.cargoType} onValueChange={(value) => setFormData({ ...formData, cargoType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select cargo type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="construction">Construction Equipment</SelectItem>
              <SelectItem value="industrial">Industrial Machinery</SelectItem>
              <SelectItem value="superload">Superload</SelectItem>
              <SelectItem value="turbine">Turbine</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shipment Date */}
        <div>
          <Label htmlFor="shipmentDate">Shipment Date</Label>
          <Input
            id="shipmentDate"
            type="date"
            value={formData.shipmentDate}
            onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
            required
          />
        </div>

        {/* Dimensions */}
        <div>
          <Label htmlFor="length">Length (ft)</Label>
          <Input
            id="length"
            type="number"
            placeholder="0"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="width">Width (ft)</Label>
          <Input
            id="width"
            type="number"
            placeholder="0"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="height">Height (ft)</Label>
          <Input
            id="height"
            type="number"
            placeholder="0"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="0"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Cargo Description */}
      <div>
        <Label htmlFor="description">Cargo Description</Label>
        <Textarea
          id="description"
          placeholder="Provide additional details about your cargo"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      {/* Permit Requirement */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="permitRequired"
          checked={formData.permitRequired}
          onCheckedChange={(checked) => setFormData({ ...formData, permitRequired: checked as boolean })}
        />
        <label htmlFor="permitRequired" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Permit handling required
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto">
        Get Quote
      </Button>
    </form>
  );
};

export default BookingForm;
