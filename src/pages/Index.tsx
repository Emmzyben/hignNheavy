import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Shield, Truck, MapPin, FileCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero.svg";
import heroImage2 from "@/assets/frame.svg";
import heroImage3 from "@/assets/image4.svg";
import driverAppImage from "@/assets/hignnheavy_app.jpeg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  const driverFeatures = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Provide live location updates to shippers and manage your routes efficiently.",
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Easy Status Updates",
      description: "Update shipment progress with a single tap, from pickup to delivery.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Communication",
      description: "Direct line of communication with the logistics team for any on-road issues.",
    },
  ];

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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-black mb-6"
          >
            Move Oversize Cargo <br />
            <span className="text-primary">Seamlessly Across the South</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-1xl mb-8 max-w-3xl mx-auto text-gray-200"
          >
            Book oversized cargo transport with automated permit handling, carrier assignments, and escort dispatching.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Button
              size="lg"
              className="text-sm px-8 py-6 hero-gradient border-0 hover:scale-105 transition-transform duration-200"
              onClick={() => {
                const element = document.getElementById('get-quote');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Get Quote Now
              <ArrowRight className="ml-2" />
            </Button>
            <Link to="/services" > <Button size="lg" variant="outline" className="text-sm px-8 py-6 bg-white/10 border-white text-white hover:bg-white hover:text-secondary hover:scale-105 transition-transform duration-200">
              Learn More
            </Button>
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Get Quote CTA Section */}
      <section className="py-20 bg-muted" id="get-quote">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">Get a Quote</p>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                Ready to Ship Your <span className="text-primary">Oversized Cargo?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Create an account to get started with instant quotes, automated permits, and reliable carriers.
              </p>
              <Link to="/signup?role=shipper">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 hover:scale-105 transition-transform duration-200"
                >
                  Sign Up to Get Quote
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">Why we Matter</p>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Why Choose <span className="text-primary">HighnHeavy?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We simplify the complexities of transporting heavy and oversized loads
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 dark-gradient text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm md:text-1xl mb-8 max-w-3xl mx-auto text-primary border border-primary p-2 rounded-full w-fit px-6">How it Works</p>

            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, streamlined process from quote to delivery
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col md:flex-row gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center text-2xl font-display font-black hover:scale-110 transition-transform duration-300">
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
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link to="/signup?role=shipper">
              <Button size="lg" variant="outline" className="bg-primary border-primary text-white hover:bg-white hover:text-secondary hover:scale-105 transition-transform duration-200">
                Start Your Shipment
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                Seamless Oversize Cargo Movement Across the South
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative animate-float"
            >
              <img
                src={heroImage3}
                alt="Oversize cargo transport"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Driver App Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <p className="text-sm font-bold text-primary tracking-wider uppercase mb-4">Driver Dedicated</p>
              <h2 className="text-3xl md:text-4xl font-display font-black mb-6">
                Take HighnHeavy <br /> <span className="text-primary">On the Road</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our mobile app is designed specifically for drivers. Manage your loads, update statuses in real-time, and streamline your workflow directly from your smartphone.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {driverFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#1E2B3E] hover:bg-[#2c3e56] text-white px-8 py-5 rounded-xl flex items-center gap-3 group transition-all duration-300 hover:scale-105"
                  onClick={() => window.open('https://expo.dev/artifacts/eas/ivnt3Gjn3nTVFdCj5wGXpT.apk', '_blank')}
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold opacity-80 leading-none">Download for Android</div>
                    <div className="text-base font-bold leading-tight">Direct APK Link</div>
                  </div>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 p-4 lg:p-0">
                 <img 
                  src={driverAppImage} 
                  alt="HighnHeavy Driver App" 
                  className="w-full max-w-[280px] mx-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-gray-900"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-0" />
            </motion.div>
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
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display font-black mb-6 text-white"
            style={{ lineHeight: '1.4' }}
          >
            Ready to Transform Your <span className="text-primary">Oversized <br /> Cargo </span>
            Operations?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-gray-200"
          >
            Experience the easiest way to book and manage oversize cargo transportation across Texas, Oklahoma, and Louisiana.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup?role=shipper">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white border-0 hover:scale-105 transition-transform duration-200">
                Get Started
              </Button>
            </Link>
            <Link to="/services" ><Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-[#1E2B3E] bg-transparent hover:scale-105 transition-transform duration-200">
              Learn More
            </Button></Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
