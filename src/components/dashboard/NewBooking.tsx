import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { texasCities } from "@/lib/texasCities";

const formSchema = z.object({
  // Step 1: Locations
  pickupAddress: z.string().min(5, "Please enter a valid pickup address"),
  pickupCity: z.string().min(2, "Please enter a city"),
  pickupState: z.string().default("Texas"),
  deliveryAddress: z.string().min(5, "Please enter a valid delivery address"),
  deliveryCity: z.string().min(2, "Please enter a city"),
  deliveryState: z.string().default("Texas"),
  // Step 2: Cargo Details
  cargoType: z.string().min(1, "Please select cargo type"),
  cargoDescription: z.string().min(10, "Please describe your cargo"),
  length: z.string().min(1, "Required"),
  width: z.string().min(1, "Required"),
  height: z.string().min(1, "Required"),
  weight: z.string().min(1, "Required"),
  // Step 3: Schedule & Requirements
  shipmentDate: z.string().min(1, "Please select a date"),
  flexibleDates: z.boolean().default(false),
  requiresEscort: z.boolean().default(false),
  specialInstructions: z.string().optional(),
});

const steps = [
  { title: "Locations", description: "Pickup & Delivery" },
  { title: "Cargo Details", description: "Dimensions & Type" },
  { title: "Schedule", description: "Date & Requirements" },
  { title: "Review", description: "Confirm Details" },
];

interface NewBookingProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NewBooking = ({ initialData, onSuccess, onCancel }: NewBookingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupAddress: initialData?.pickup_address || "",
      pickupCity: initialData?.pickup_city || "",
      pickupState: "Texas",
      deliveryAddress: initialData?.delivery_address || "",
      deliveryCity: initialData?.delivery_city || "",
      deliveryState: "Texas",
      cargoType: initialData?.cargo_type || "",
      cargoDescription: initialData?.cargo_description || "",
      length: initialData?.dimensions_length_ft?.toString() || "",
      width: initialData?.dimensions_width_ft?.toString() || "",
      height: initialData?.dimensions_height_ft?.toString() || "",
      weight: initialData?.weight_lbs?.toString() || "",
      shipmentDate: initialData?.shipment_date ? new Date(initialData.shipment_date).toISOString().split('T')[0] : "",
      flexibleDates: !!initialData?.flexible_dates,
      requiresEscort: !!initialData?.requires_escort,
      specialInstructions: initialData?.special_instructions || "",
    },
  });

  const values = form.watch();

  // Force Texas state
  useEffect(() => {
    form.setValue("pickupState", "Texas");
    form.setValue("deliveryState", "Texas");
  }, [form]);

  // Handle automatic escort requirement
  const length = parseFloat(values.length) || 0;
  const width = parseFloat(values.width) || 0;
  const height = parseFloat(values.height) || 0;
  const isEscortRequired = length > 110 || width > 14 || height > 17;

  useEffect(() => {
    if (isEscortRequired) {
      form.setValue("requiresEscort", true);
    }
  }, [isEscortRequired, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const isEditing = !!initialData?.id;
      const response = isEditing
        ? await api.put(`/bookings/${initialData.id}`, data)
        : await api.post("/bookings", data);

      if (response.data.success) {
        toast.success(isEditing ? "Booking updated successfully!" : "Booking request submitted successfully!", {
          description: isEditing ? "Your changes have been saved." : "We'll send you a quote within 24 hours.",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          form.reset();
          setCurrentStep(0);
        }
      }
    } catch (error: any) {
      console.error("Booking submission error:", error);
      toast.error(error.response?.data?.message || `Failed to ${initialData?.id ? 'update' : 'submit'} booking request. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields as any);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 0:
        return ["pickupAddress", "pickupCity", "pickupState", "deliveryAddress", "deliveryCity", "deliveryState"];
      case 1:
        return ["cargoType", "cargoDescription", "length", "width", "height", "weight"];
      case 2:
        return ["shipmentDate", "flexibleDates", "requiresEscort", "specialInstructions"];
      default:
        return [];
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {index < currentStep ? <Check size={20} /> : index + 1}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-20 md:w-32 h-1 mx-2 ${index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl border border-border p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Locations */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-bold">Pickup Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {texasCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h2 className="text-xl font-display font-bold pt-4">Delivery Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="456 Industrial Blvd" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {texasCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Cargo Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-bold">Cargo Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cargoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cargo type" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargoDescription"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Cargo Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your cargo in detail..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h2 className="text-xl font-display font-bold pt-4">Dimensions & Weight</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length (ft)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="45" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (ft)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (ft)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="14" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="85000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-bold">Schedule & Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Shipment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="flexibleDates"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Flexible on dates</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="requiresEscort"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={isEscortRequired || field.value}
                              onCheckedChange={field.onChange}
                              disabled={isEscortRequired}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer">
                            I need escort/pilot car services
                          </FormLabel>
                        </div>
                        {isEscortRequired && (
                          <p className="text-xs text-amber-600 mt-1 font-medium">
                            Escort is mandatory for loads exceeding 110' length, 14' width, or 17' height.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special handling requirements, access restrictions, etc..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-bold">Review Your Booking</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Pickup Location</h3>
                    <p>{values.pickupAddress}</p>
                    <p>{values.pickupCity}, {values.pickupState}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Delivery Location</h3>
                    <p>{values.deliveryAddress}</p>
                    <p>{values.deliveryCity}, {values.deliveryState}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Cargo Details</h3>
                    <p><span className="text-muted-foreground">Type:</span> {values.cargoType}</p>
                    <p><span className="text-muted-foreground">Dimensions:</span> {values.length}' x {values.width}' x {values.height}'</p>
                    <p><span className="text-muted-foreground">Weight:</span> {Number(values.weight).toLocaleString()} lbs</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Schedule</h3>
                    <p><span className="text-muted-foreground">Date:</span> {values.shipmentDate}</p>
                    <p><span className="text-muted-foreground">Flexible:</span> {values.flexibleDates ? "Yes" : "No"}</p>
                    <p><span className="text-muted-foreground">Escort Required:</span> {values.requiresEscort ? "Yes" : "No"}</p>
                  </div>
                </div>

                {values.specialInstructions && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Special Instructions</h3>
                    <p>{values.specialInstructions}</p>
                  </div>
                )}

                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                  <p className="text-sm">
                    By submitting this request, you'll receive a detailed quote within 24 hours.
                    The quote will include transport costs, permit fees, and escort services if required.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-border">
              <div className="flex gap-2">
                {onCancel && (
                  <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Previous
                </Button>
              </div>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader size="sm" text="Submitting..." />
                  ) : (
                    <>
                      Submit Booking Request
                      <Check size={18} className="ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewBooking;
