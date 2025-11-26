import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Shield, Truck, MapPin, FileCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero.svg";
import heroImage2 from "@/assets/frame.svg";
import heroImage3 from "@/assets/image4.svg";

const Index = () => {
  const features = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Permit Management",
      description: "We handle all Texas oversize/overweight permits, saving you time and ensuring compliance.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Vetted Carriers",
      description: "Our network of carriers is pre-screened for safety records and equipment capabilities.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Escort Services",
      description: "We provide certified pilot car escorts based on your shipment's requirements.",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Route Planning",
      description: "Our system calculates the safest and most efficient routes for oversized loads.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Details",
      description: "Provide information about your cargo, pickup, and delivery locations.",
    },
    {
      number: "02",
      title: "Get Quote",
      description: "Receive a comprehensive quote including transport, permits, and escorts.",
    },
    {
      number: "03",
      title: "Make Payment",
      description: "Pay for the quote via debit card, bank transfer, Zelle or Cash App.",
    },
    {
      number: "04",
      title: "We Handle Logistics",
      description: "We secure permits, assign carriers and escorts, and plan the route.",
    },
    {
      number: "05",
      title: "Track Your Shipment",
      description: "Monitor your shipment's progress through our online portal.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200 border border-white p-2 rounded-full w-fit px-6">Now Live in Texas</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black mb-6 animate-fade-in">
            Move Oversize Cargo <br />
            <span className="text-primary">Seamlessly Across Texas</span>
          </h1>
          <p className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200">
            Book oversized cargo transport with automated permit handling, carrier assignments, and escort dispatching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="text-sm px-8 py-6 hero-gradient border-0">
              Get Quote Now
              <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-secondary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1E2B3E]">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-display font-black mb-4 animate-fade-in"><span className="text-primary">5K+</span></h1>
            <p className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200">Shipments</p>
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-display font-black mb-4 animate-fade-in"><span className="text-primary">500+</span></h1>
            <p className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200">Verified Providers</p>
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-display font-black mb-4 animate-fade-in"><span className="text-primary">1</span></h1>
            <p className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200">State Operating</p>
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-display font-black mb-4 animate-fade-in"><span className="text-primary">99+</span></h1>
            <p className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200">Client Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">Get a Quote</p>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                Get a Quote for Your <span className="text-primary">Shipment</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Fill out the form below and we'll provide a comprehensive quote
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">Why we Matter</p>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Why Choose <span className="text-primary">HighnHeavy?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We simplify the complexities of transporting heavy and oversized loads
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-primary hover:border-border transition-all duration-300 hover:shadow-lg group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 dark-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">How it Works</p>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, streamlined process from quote to delivery
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center text-2xl font-display font-black">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-display font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <ArrowRight className="text-primary" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button size="lg" variant="outline" className="bg-primary border-primary text-white hover:bg-white hover:text-secondary ">
              Start Your Shipment
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                Seamless Oversize Cargo Movement Across Texas
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                HighnHeavy simplifies the complexities of transporting your heavy and oversized loads. Get instant quotes, automated permits, and reliable carriers and escorts, all in one platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Optimized Routing</h4>
                    <p className="text-muted-foreground">
                      Leverage our system for the safest, most efficient routes, avoiding low bridges and restricted zones.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Automated Permitting</h4>
                    <p className="text-muted-foreground">
                      No more paperwork headaches. We handle the complex permit acquisition process.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Vetted Network</h4>
                    <p className="text-muted-foreground">
                      Access a trusted network of experienced carriers and certified escorts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Transparent Pricing</h4>
                    <p className="text-muted-foreground">
                      Get clear, upfront quotes with no hidden fees from start to finish.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-float">
              <img
                src={heroImage3}
                alt="Oversize cargo transport"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

export default Index;
