import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, MapPin, Package, Ruler, Weight, CalendarDays, Shield, Info, FileText, ChevronRight, Truck, AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { locations, states } from "@/lib/locations";

const formSchema = z.object({
  // Step 1: Locations
  pickupAddress: z.string().min(5, "Please enter a valid pickup address"),
  pickupCity: z.string().min(2, "Please enter a city"),
  pickupState: z.string().min(1, "Please select a state"),
  deliveryAddress: z.string().min(5, "Please enter a valid delivery address"),
  deliveryCity: z.string().min(2, "Please enter a city"),
  deliveryState: z.string().min(1, "Please select a state"),
  // Step 2: Cargo Details
  cargoType: z.string().min(1, "Please select cargo type"),
  cargoDescription: z.string().min(10, "Please describe your cargo"),
  length: z.string().min(1, "Required"),
  width: z.string().min(1, "Required"),
  height: z.string().min(1, "Required"),
  weight: z.string().min(1, "Required"),
  weightUnit: z.string().default("lbs"),
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
  const [cargoTypes, setCargoTypes] = useState<{ id: number, name: string }[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      weightUnit: initialData?.weight_unit || "lbs",
      shipmentDate: initialData?.shipment_date ? new Date(initialData.shipment_date).toISOString().split('T')[0] : "",
      flexibleDates: !!initialData?.flexible_dates,
      requiresEscort: !!initialData?.requires_escort,
      specialInstructions: initialData?.special_instructions || "",
    },
  });

  const values = form.watch();



  // Handle automatic escort requirement based on state rules
  const [escortReason, setEscortReason] = useState<string | null>(null);

  useEffect(() => {
    const l = parseFloat(values.length) || 0;
    const w = parseFloat(values.width) || 0;
    const h = parseFloat(values.height) || 0;
    const wt = parseFloat(values.weight) || 0;
    const state = values.pickupState || values.deliveryState || "Texas";

    let required = false;
    let reason = "";

    if (state === "Texas") {
      if (w > 14) { required = true; reason = "Texas requires escort for width > 14ft"; }
      else if (h > 17) { required = true; reason = "Texas requires escort for height > 17ft"; }
      else if (l > 110) { required = true; reason = "Texas requires escort for length > 110ft"; }
    } else if (state === "Oklahoma") {
      if (w > 12) { required = true; reason = "Oklahoma requires escort for width > 12ft"; }
      else if (l > 80) { required = true; reason = "Oklahoma requires escort for length > 80ft"; } // Oklahoma is strict on length
    } else if (state === "Louisiana") {
      if (w > 12) { required = true; reason = "Louisiana requires escort for width > 12ft"; }
      else if (l > 90) { required = true; reason = "Louisiana requires escort for length > 90ft"; }
      else if (h > 16) { required = true; reason = "Louisiana requires escort for height > 16ft"; }
    }

    // General legal limits check (oversize)
    const isOversize = w > 8.5 || h > (state === "Oklahoma" ? 13.5 : 14) || l > 65 || wt > 80000;
    
    if (required) {
      form.setValue("requiresEscort", true);
      setEscortReason(reason);
    } else {
      setEscortReason(null);
    }
  }, [values.length, values.width, values.height, values.weight, values.pickupState, values.deliveryState, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const isEditing = !!initialData?.id;
      const response = isEditing
        ? await api.put(`/bookings/${initialData.id}`, data)
        : await api.post("/bookings", data);

      if (response.data.success) {
        toast.success(isEditing ? "Booking updated successfully!" : "Booking request submitted successfully!", {
          description: isEditing ? "Your changes have been saved." : "You will receive a response within 24 hours.",
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
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      {/* Progress Steps */}
      <div className="mb-10 px-2 md:px-0">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {index < currentStep ? <Check size={14} className="md:w-[18px] md:h-[18px]" /> : index + 1}
                </div>
                <div className="mt-3 text-center absolute top-full left-1/2 -translate-x-1/2 w-max max-w-[60px] md:max-w-none">
                  <p className={`text-[9px] md:text-sm font-bold uppercase tracking-tight transition-colors ${index === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="hidden md:block text-[10px] text-muted-foreground font-medium">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-1 md:mx-4">
                  <div
                    className={`h-0.5 md:h-1 rounded-full transition-all duration-500 ${index < currentStep ? "bg-primary shadow-sm shadow-primary/20" : "bg-muted"
                      }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Extra spacer for the absolute positioned labels below */}
        <div className="h-10 md:h-12" />
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl md:rounded-3xl border border-border/60 p-5 md:p-10 shadow-xl shadow-black/[0.03]">
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
                        <Select onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("pickupCity", ""); // Reset city when state changes
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                              <SelectValue placeholder={values.pickupState ? "Select city" : "Select state first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {values.pickupState && locations[values.pickupState]?.map((city) => (
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
                        <Select onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("deliveryCity", ""); // Reset city when state changes
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                              <SelectValue placeholder={values.deliveryState ? "Select city" : "Select state first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {values.deliveryState && locations[values.deliveryState]?.map((city) => (
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="85000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="weightUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lbs">lbs</SelectItem>
                                <SelectItem value="kg">kg (Metric)</SelectItem>
                                <SelectItem value="tonnes">Tonnes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
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
                              checked={!!escortReason || field.value}
                              onCheckedChange={field.onChange}
                              disabled={!!escortReason}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer">
                            I need escort/pilot car services
                          </FormLabel>
                        </div>
                        {escortReason && (
                          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                            <p className="text-xs text-amber-800 font-medium">
                              {escortReason}
                            </p>
                          </div>
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
              <div className="space-y-10 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl shadow-sm border border-primary/20">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-display font-black leading-tight tracking-tight">Booking Summary</h2>
                        {(() => {
                          const l = parseFloat(values.length) || 0;
                          const w = parseFloat(values.width) || 0;
                          const h = parseFloat(values.height) || 0;
                          const wt = parseFloat(values.weight) || 0;
                          const state = values.pickupState || values.deliveryState || "Texas";
                          const isOversize = w > 8.5 || h > (state === "Oklahoma" ? 13.5 : 14) || l > 65 || wt > 80000;
                          return isOversize ? <Badge className="bg-red-500 text-white border-transparent px-3 py-1 text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-200">OVERSIZE LOAD</Badge> : null;
                        })()}
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Verify your shipment details before proceeding to confirmation</p>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-muted/30 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Route Overview</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-[10px] font-bold border-border/50">STEP 1</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
                    <div className="p-6 md:p-8 space-y-2 group transition-colors hover:bg-primary/[0.02]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Origin</p>
                      <p className="text-lg md:text-xl font-bold text-foreground leading-tight">{values.pickupAddress}</p>
                      <p className="text-sm md:text-base text-muted-foreground font-medium">{values.pickupCity}, {values.pickupState}</p>
                    </div>
                    <div className="p-6 md:p-8 space-y-2 relative group transition-colors hover:bg-primary/[0.02]">
                      <div className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-border/60 rounded-full items-center justify-center z-10 shadow-md group-hover:border-primary/40 transition-colors">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Destination</p>
                      <p className="text-lg md:text-xl font-bold text-foreground leading-tight">{values.deliveryAddress}</p>
                      <p className="text-sm md:text-base text-muted-foreground font-medium">{values.deliveryCity}, {values.deliveryState}</p>
                    </div>
                  </div>
                </div>

                {/* Cargo */}
                <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-muted/30 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Cargo Details</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-[10px] font-bold border-border/50">STEP 2</Badge>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                      <div className="bg-muted/40 rounded-2xl p-4 md:p-5 text-center border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
                        <Ruler className="w-4 h-4 md:w-5 md:h-5 text-primary/60 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Length</p>
                        <p className="text-xl md:text-2xl font-black text-foreground">{values.length}<span className="text-xs md:text-sm font-bold text-muted-foreground ml-1">ft</span></p>
                      </div>
                      <div className="bg-muted/40 rounded-2xl p-4 md:p-5 text-center border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
                        <Ruler className="w-4 h-4 md:w-5 md:h-5 text-primary/60 mx-auto mb-2 rotate-90" />
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Width</p>
                        <p className="text-xl md:text-2xl font-black text-foreground">{values.width}<span className="text-xs md:text-sm font-bold text-muted-foreground ml-1">ft</span></p>
                      </div>
                      <div className="bg-muted/40 rounded-2xl p-4 md:p-5 text-center border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
                        <Ruler className="w-4 h-4 md:w-5 md:h-5 text-primary/60 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Height</p>
                        <p className="text-xl md:text-2xl font-black text-foreground">{values.height}<span className="text-xs md:text-sm font-bold text-muted-foreground ml-1">ft</span></p>
                      </div>
                      <div className="bg-muted/40 rounded-2xl p-4 md:p-5 text-center border border-transparent hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
                        <Weight className="w-4 h-4 md:w-5 md:h-5 text-primary/60 mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Weight</p>
                        <p className="text-xl md:text-2xl font-black text-foreground">{Number(values.weight).toLocaleString()}<span className="text-xs md:text-sm font-bold text-muted-foreground ml-1">{values.weightUnit}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 pt-6 md:pt-8 border-t border-border/40">
                      <div className="shrink-0 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Equipment Type</p>
                        <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-black text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-xl shadow-lg shadow-primary/20">
                          <Truck className="w-4 h-4" />
                          {values.cargoType}
                        </span>
                      </div>
                      {values.cargoDescription && (
                        <div className="flex-1 space-y-2 w-full">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Load Description</p>
                          <div className="p-4 bg-muted/20 rounded-2xl border border-border/40 text-sm md:text-base text-muted-foreground leading-relaxed italic">
                            "{values.cargoDescription}"
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-muted/30 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Logistics & Support</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-[10px] font-bold border-border/50">STEP 3</Badge>
                  </div>
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                      <div className="p-3 bg-primary/5 rounded-xl shrink-0">
                        <CalendarDays className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">Schedule</p>
                        <p className="font-bold text-sm md:text-base leading-tight">
                          {new Date(values.shipmentDate + 'T00:00:00').toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                      <div className={`p-3 rounded-xl shrink-0 ${values.flexibleDates ? 'bg-green-500/10' : 'bg-muted'}`}>
                        <Info className={`w-5 h-5 ${values.flexibleDates ? 'text-green-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">Timing Flexibility</p>
                        <p className={`font-bold text-sm md:text-base leading-tight ${values.flexibleDates ? 'text-green-600' : ''}`}>
                          {values.flexibleDates ? 'Flexible on dates' : 'Fixed schedule'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                      <div className={`p-3 rounded-xl shrink-0 ${(escortReason || values.requiresEscort) ? 'bg-amber-500/10' : 'bg-muted'}`}>
                        <AlertCircle className={`w-5 h-5 ${(escortReason || values.requiresEscort) ? 'text-amber-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">Pilot Car / Escort</p>
                        <p className={`font-bold text-sm md:text-base leading-tight ${(escortReason || values.requiresEscort) ? 'text-amber-600' : ''}`}>
                          {(escortReason || values.requiresEscort) ? 'Required' : 'Not Needed'}
                        </p>
                        {escortReason && <p className="text-[10px] text-amber-600/70 font-bold mt-1 uppercase tracking-tighter">{escortReason}</p>}
                      </div>
                    </div>
                  </div>
                  {values.specialInstructions && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                      <div className="bg-primary/[0.03] rounded-2xl p-5 md:p-6 border border-dashed border-primary/20">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-primary/60" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Special Handling Instructions</p>
                        </div>
                        <p className="text-sm md:text-base text-foreground leading-relaxed">{values.specialInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className={`border rounded-3xl p-6 md:p-8 transition-all duration-300 ${termsAccepted ? 'bg-green-50/50 border-green-200 shadow-sm' : 'bg-muted/20 border-border/60'}`}>
                  <label className="flex items-start gap-4 md:gap-5 cursor-pointer group">
                    <div className="mt-1">
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${termsAccepted ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50 bg-white'}`}>
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="absolute opacity-0 w-6 h-6 cursor-pointer"
                        />
                        {termsAccepted && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm md:text-base font-bold text-foreground leading-snug">
                        I verify that all shipment details are accurate and agree to the{" "}
                        <a href="/terms" target="_blank" className="text-primary hover:underline decoration-2 underline-offset-4">Terms of Service</a>
                        {" "}and{" "}
                        <a href="/privacy" target="_blank" className="text-primary hover:underline decoration-2 underline-offset-4">Privacy Policy</a>.
                      </p>
                      <p className="text-[10px] md:text-sm text-muted-foreground font-medium">
                        Standard review time is 24 hours. No payment is required at this stage.
                      </p>
                    </div>
                  </label>
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
                <Button type="submit" disabled={isLoading || !termsAccepted} className="gap-2">
                  {isLoading ? (
                    <Loader size="sm" text="Submitting..." />
                  ) : (
                    <>
                      <span className="hidden md:inline">{!termsAccepted ? 'Please accept terms to continue' : 'Submit Booking Request'}</span>
                      <span className="md:hidden">{!termsAccepted ? 'Accept Terms' : 'Submit'}</span>
                      <Check size={18} />
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
