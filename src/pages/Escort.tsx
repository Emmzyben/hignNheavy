import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp, Shield, Smartphone, Headphones, Clock, CheckCircle2, Truck, Ruler, Radio, Siren, Map, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import escortImage from "@/assets/lead-pilot-car-front-escort.jpg";
import heroImage from "@/assets/hero.svg";
import heroImage2 from "@/assets/frame.svg";

const Escort = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    driversLicense: "",
    certification: "",
    yearsExperience: "",
    vehicleInfo: "",
    serviceArea: "",
    agreedToTerms: false,
  });

  const benefits = [
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: "Premium Pay Rates",
      description: "Earn competitive hourly and mileage rates with minimum pay guarantees for short hauls.",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Consistent Work",
      description: "Access a steady flow of escort assignments with our growing network of oversize shipments.",
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Fast Payments",
      description: "Get paid within 24-48 hours after job completion with direct deposit options.",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Insurance Coverage",
      description: "Additional liability coverage provided for all HighnHeavy assigned escort jobs.",
    },
    {
      icon: <Smartphone className="w-10 h-10" />,
      title: "Easy Job Management",
      description: "Accept assignments, update status, and submit paperwork through our mobile-friendly portal.",
    },
    {
      icon: <Headphones className="w-10 h-10" />,
      title: "Emergency Support",
      description: "24/7 dispatch support for any issues encountered during escort operations.",
    },
  ];

  const requirements = [
    "Valid Texas Driver's License with clean record",
    "TxDOT Certified Pilot Car Escort certification",
    "Minimum 2 years of escort experience",
    "Commercial auto insurance ($300,000 minimum)",
    "Properly equipped escort vehicle",
    "Height pole (minimum 16 feet)",
    "AM/FM radio and CB radio",
    "LED warning lights and signs",
    "GPS navigation system",
    "Smartphone with data plan",
  ];

  const equipment = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Escort Vehicle",
      description: "Reliable truck or SUV with proper lighting and signage",
    },
    {
      icon: <Ruler className="w-10 h-10" />,
      title: "Height Pole",
      description: "Minimum 16-foot height pole for clearance checks",
    },
    {
      icon: <Radio className="w-10 h-10" />,
      title: "Communication",
      description: "CB radio and smartphone for constant communication",
    },
    {
      icon: <Siren className="w-10 h-10" />,
      title: "Lighting",
      description: "Amber LED warning lights and proper signage",
    },
    {
      icon: <Map className="w-10 h-10" />,
      title: "Navigation",
      description: "GPS system with route planning capabilities",
    },
    {
      icon: <TriangleAlert className="w-10 h-10" />,
      title: "Safety Gear",
      description: "Emergency kit, cones, and safety vest",
    },
  ];

  const steps = [
    {
      title: "Submit Application",
      description: "Complete the escort registration form with your credentials and experience.",
    },
    {
      title: "Document Review",
      description: "Upload required certifications, licenses, and insurance documentation.",
    },
    {
      title: "Background Check",
      description: "Pass a driving record check and verify all required certifications.",
    },
    {
      title: "Orientation",
      description: "Complete platform training and start accepting escort assignments.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    toast.success("Application submitted! We'll review and contact you soon.");
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
            Become a HighnHeavy <br /> <span className="text-primary">Escort</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100">
            Join our elite network of certified pilot car escorts and ensure the safe transport <br /> of oversize loads across Texas.</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">Why we Matter</p>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Why Escort With <span className="text-primary">HighnHeavy</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We handle the coordination and payment so you can focus on protecting the load and the public.
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
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={escortImage}
                alt="Escort requirements"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                Escort Requirements
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                To maintain the highest safety standards, we require all escorts in our network to meet these qualifications:
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

      {/* Equipment Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Required Equipment
            </h2>
            <p className="text-xl text-muted-foreground">
              Essential equipment for professional escort operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.map((item, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Process */}
      <section className="py-20 dark-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Registration Process
            </h2>
            <p className="text-xl text-gray-300">
              Four simple steps to join our escort network
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
                <p className="text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                Start Your Application
              </h2>
              <p className="text-xl text-muted-foreground">
                Fill out the form below to begin the escort registration process
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    <Label htmlFor="driversLicense">Texas Driver's License # *</Label>
                    <Input
                      id="driversLicense"
                      value={formData.driversLicense}
                      onChange={(e) => setFormData({ ...formData, driversLicense: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="certification">TxDOT Certification # *</Label>
                    <Input
                      id="certification"
                      value={formData.certification}
                      onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleInfo">Escort Vehicle Information *</Label>
                    <Input
                      id="vehicleInfo"
                      placeholder="Make, Model, Year"
                      value={formData.vehicleInfo}
                      onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
                      required
                    />
                  </div>
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

export default Escort;
