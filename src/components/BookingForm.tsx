import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupAddress: "",
    pickupCity: "",
    pickupState: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryState: "",
    cargoType: "",
    cargoDescription: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    shipmentDate: "",
    flexibleDates: false,
    requiresEscort: false,
    specialInstructions: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Please create an account to complete your quote request");
    // Redirect to signup page with role parameter
    navigate("/signup?role=shipper");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pickup Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pickup Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="pickupAddress">Street Address</Label>
            <Input
              id="pickupAddress"
              placeholder="123 Main St"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="pickupCity">City</Label>
            <Input
              id="pickupCity"
              placeholder="Houston"
              value={formData.pickupCity}
              onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="pickupState">State</Label>
            <Select
              value={formData.pickupState}
              onValueChange={(value) => setFormData({ ...formData, pickupState: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="OK">Oklahoma</SelectItem>
                <SelectItem value="NM">New Mexico</SelectItem>
                <SelectItem value="LA">Louisiana</SelectItem>
                <SelectItem value="AR">Arkansas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Delivery Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="deliveryAddress">Street Address</Label>
            <Input
              id="deliveryAddress"
              placeholder="456 Industrial Blvd"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="deliveryCity">City</Label>
            <Input
              id="deliveryCity"
              placeholder="Dallas"
              value={formData.deliveryCity}
              onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="deliveryState">State</Label>
            <Select
              value={formData.deliveryState}
              onValueChange={(value) => setFormData({ ...formData, deliveryState: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="OK">Oklahoma</SelectItem>
                <SelectItem value="NM">New Mexico</SelectItem>
                <SelectItem value="LA">Louisiana</SelectItem>
                <SelectItem value="AR">Arkansas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cargo Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cargo Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cargoType">Cargo Type</Label>
            <Select
              value={formData.cargoType}
              onValueChange={(value) => setFormData({ ...formData, cargoType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cargo type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="construction">Construction Equipment</SelectItem>
                <SelectItem value="industrial">Industrial Machinery</SelectItem>
                <SelectItem value="agricultural">Agricultural Equipment</SelectItem>
                <SelectItem value="prefab">Pre-Fab Buildings/Modules</SelectItem>
                <SelectItem value="wind">Wind Energy Components</SelectItem>
                <SelectItem value="mining">Mining Equipment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="cargoDescription">Cargo Description</Label>
            <Textarea
              id="cargoDescription"
              placeholder="Describe your cargo in detail..."
              value={formData.cargoDescription}
              onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
              rows={3}
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
      </div>

      {/* Dimensions & Weight */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dimensions & Weight</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="length">Length (ft)</Label>
            <Input
              id="length"
              type="number"
              placeholder="45"
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
              placeholder="12"
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
              placeholder="14"
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
              placeholder="85000"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Schedule & Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schedule & Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shipmentDate">Preferred Shipment Date</Label>
            <Input
              id="shipmentDate"
              type="date"
              value={formData.shipmentDate}
              onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="flexibleDates"
                checked={formData.flexibleDates}
                onCheckedChange={(checked) => setFormData({ ...formData, flexibleDates: checked as boolean })}
              />
              <label htmlFor="flexibleDates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Flexible on dates
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="requiresEscort"
            checked={formData.requiresEscort}
            onCheckedChange={(checked) => setFormData({ ...formData, requiresEscort: checked as boolean })}
          />
          <label htmlFor="requiresEscort" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I need escort/pilot car services
          </label>
        </div>

        <div>
          <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
          <Textarea
            id="specialInstructions"
            placeholder="Any special handling requirements, access restrictions, etc..."
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            rows={3}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto hover:scale-105 transition-transform duration-200">
        Get Quote
      </Button>
    </form>
  );
};

export default BookingForm;
