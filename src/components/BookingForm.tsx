import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import api from "@/lib/api";
import { locations, states } from "@/lib/locations";

const BookingForm = () => {
  const navigate = useNavigate();
  const [cargoTypes, setCargoTypes] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    const fetchCargoTypes = async () => {
      try {
        const response = await api.get("/cargo-types");
        if (response.data.success) {
          setCargoTypes(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch cargo types:", error);
      }
    };
    fetchCargoTypes();
  }, []);

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

  const [pickupCities, setPickupCities] = useState<string[]>([]);
  const [deliveryCities, setDeliveryCities] = useState<string[]>([]);

  useEffect(() => {
    if (formData.pickupState) {
      setPickupCities(locations[formData.pickupState] || []);
    } else {
      setPickupCities([]);
    }
  }, [formData.pickupState]);

  useEffect(() => {
    if (formData.deliveryState) {
      setDeliveryCities(locations[formData.deliveryState] || []);
    } else {
      setDeliveryCities([]);
    }
  }, [formData.deliveryState]);

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
            <Select
              value={formData.pickupCity}
              onValueChange={(value) => setFormData({ ...formData, pickupCity: value })}
              disabled={!formData.pickupState}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.pickupState ? "Select city" : "Select state"} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {pickupCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pickupState">State</Label>
            <Select
              value={formData.pickupState}
              onValueChange={(value) => setFormData({ ...formData, pickupState: value, pickupCity: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
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
            <Select
              value={formData.deliveryCity}
              onValueChange={(value) => setFormData({ ...formData, deliveryCity: value })}
              disabled={!formData.deliveryState}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.deliveryState ? "Select city" : "Select state"} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {deliveryCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="deliveryState">State</Label>
            <Select
              value={formData.deliveryState}
              onValueChange={(value) => setFormData({ ...formData, deliveryState: value, deliveryCity: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
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
                {cargoTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
                {cargoTypes.length === 0 && (
                  <>
                    <SelectItem value="Construction Equipment">Construction Equipment</SelectItem>
                    <SelectItem value="Industrial Machinery">Industrial Machinery</SelectItem>
                    <SelectItem value="Agricultural Equipment">Agricultural Equipment</SelectItem>
                    <SelectItem value="Pre-Fab Buildings/Modules">Pre-Fab Buildings/Modules</SelectItem>
                    <SelectItem value="Wind Energy Components">Wind Energy Components</SelectItem>
                    <SelectItem value="Mining Equipment">Mining Equipment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
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
