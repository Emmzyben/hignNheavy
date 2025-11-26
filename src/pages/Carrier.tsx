import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp, Zap, FileCheck, Smartphone, Headphones, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import truckImage from "@/assets/image4.svg";
import heroImage from "@/assets/hero.svg";
import heroImage2 from "@/assets/frame.svg";

const Carrier = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    usdot: "",
    mc: "",
    equipmentTypes: [] as string[],
    serviceArea: "",
    fleetSize: "",
    agreedToTerms: false,
  });

  const benefits = [
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: "Competitive Rates",
      description: "Earn premium rates for oversize loads with our fair pricing model that rewards quality service.",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Consistent Loads",
      description: "Access a steady stream of oversize shipments across Texas with minimal empty miles.",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Quick Payments",
      description: "Get paid within 24-48 hours after delivery with our streamlined payment process.",
    },
    {
      icon: <FileCheck className="w-10 h-10" />,
      title: "Permit Handling",
      description: "We handle all Texas oversize permits and route planning so you can focus on driving.",
    },
    {
      icon: <Smartphone className="w-10 h-10" />,
      title: "Easy Platform",
      description: "Manage your loads, documents, and payments through our intuitive carrier portal.",
    },
    {
      icon: <Headphones className="w-10 h-10" />,
      title: "Dedicated Support",
      description: "24/7 access to our logistics team for assistance with any issues on the road.",
    },
  ];

  const requirements = [
    "Valid Texas Motor Carrier Authority",
    "Active USDOT Number with satisfactory safety rating",
    "Minimum $1,000,000 liability insurance",
    "Minimum $100,000 cargo insurance",
    "Valid Texas Oversize/Overweight Permits (or ability to obtain)",
    "Proper equipment for oversize loads (flatbeds, RGNs, etc.)",
    "GPS tracking capability on all trucks",
    "Clean safety record with no major violations",
    "Professional driver qualifications and CDL",
    "Ability to pass our carrier vetting process",
  ];

  const steps = [
    {
      title: "Submit Application",
      description: "Complete our online carrier application with your company and equipment details.",
    },
    {
      title: "Document Verification",
      description: "Upload required documents including insurance certificates and authority paperwork.",
    },
    {
      title: "Safety Review",
      description: "Our team reviews your safety records and verifies all credentials.",
    },
    {
      title: "Onboarding",
      description: "Complete orientation and gain access to our carrier portal to start booking loads.",
    },
  ];

  const equipmentOptions = [
    "Flatbed Trailer",
    "Step-Deck Trailer",
    "Lowboy Trailer",
    "RGN (Removable Gooseneck)",
    "Extendable Flatbed",
    "Other Specialized Equipment",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    toast.success("Application submitted! We'll review and contact you soon.");
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipmentTypes: prev.equipmentTypes.includes(equipment)
        ? prev.equipmentTypes.filter(e => e !== equipment)
        : [...prev.equipmentTypes, equipment]
    }));
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6">
            Become a HighnHeavy <br /> <span className="text-primary">Carrier</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100">
            Join our network of trusted carriers and grow your business with consistent <br /> oversize cargo opportunities across Texas.
          </p>
        </div>
      </section>



      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">Why we Matter</p>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Why Partner With <span className="text-primary">HighnHeavy</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide the tools and resources you need to focus on what you do best: moving oversize freight safely and efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={truckImage}
                alt="Carrier requirements"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                Requirements
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                To ensure the highest level of service and safety for our clients, we maintain strict standards for all carriers in our network.
              </p>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Registration Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Registration Process
            </h2>
            <p className="text-xl text-muted-foreground">
              Four simple steps to join our network
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center text-2xl font-display font-black text-white mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                Start Your Application
              </h2>
              <p className="text-xl text-muted-foreground">
                Fill out the form below to begin the carrier registration process
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="usdot">USDOT Number *</Label>
                    <Input
                      id="usdot"
                      value={formData.usdot}
                      onChange={(e) => setFormData({ ...formData, usdot: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mc">MC/MX Number *</Label>
                    <Input
                      id="mc"
                      value={formData.mc}
                      onChange={(e) => setFormData({ ...formData, mc: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Equipment Types *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {equipmentOptions.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={formData.equipmentTypes.includes(equipment)}
                          onCheckedChange={() => toggleEquipment(equipment)}
                        />
                        <label htmlFor={equipment} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {equipment}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="serviceArea">Service Area in Texas *</Label>
                    <Input
                      id="serviceArea"
                      placeholder="e.g., Statewide, Dallas-Fort Worth, etc."
                      value={formData.serviceArea}
                      onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fleetSize">Number of Trucks in Fleet *</Label>
                    <Input
                      id="fleetSize"
                      type="number"
                      value={formData.fleetSize}
                      onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                  />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Start Application
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 43, 62, 0.85), rgba(30, 43, 62, 0.85)), url(${heroImage2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container relative mx-auto px-4 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-display font-black mb-6 text-white" style={{ lineHeight: '1.4' }}>
            Ready to Transform Your <span className="text-primary">Oversized <br /> Cargo </span>
            Operations?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Experience the easiest way to book and manage oversize cargo transportation in Texas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white border-0">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-[#1E2B3E] bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Carrier;
