import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import truckImage1 from "@/assets/10.jpg";
import truckImage2 from "@/assets/Top-7-Digital-Building-Permit-Tools.jpg";
import truckImage3 from "@/assets/lead-pilot-car-front-escort.jpg";
import truckImage4 from "@/assets/route.jpg";
import truckImage5 from "@/assets/logistics.jpg";
import heroImage2 from "@/assets/frame.svg";
import { Shield, Truck, MapPin, FileCheck, ArrowRight, CheckCircle2, Users } from "lucide-react";
import heroImage from "@/assets/hero.svg";
import { motion } from "framer-motion";

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

const Services = () => {
  const services = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Heavy Haul Transport",
      description: "We connect shippers with a vetted network of specialized carriers capable of moving the most challenging loads. Whether it's construction machinery, energy components, or industrial equipment, we find the right trailer for the job.",
      features: [
        "Instant matching with RGNs, Lowboys, and Extendables",
        "Verified carrier insurance and USDOT authority",
        "Real-time GPS tracking from pickup to delivery",
      ],
      image: truckImage1,
    },
    {
      icon: <FileCheck className="w-12 h-12" />,
      title: "Automated Permit Acquisition",
      description: "Navigating Texas OS/OW regulations is complex. HighnHeavy simplifies compliance by automating the permit application process. We determine the exact permit you need based on your dimensions and weight.",
      features: [
        "Automated General, Over-Axle, and Super Heavy permits",
        "Direct integration with regulatory requirements",
        "Route verification against active curfews and restrictions",
        "Zero-Headache Guarantee: We handle the filing",
      ],
      image: truckImage2,
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Pilot Car Coordination",
      description: "Safety is paramount. For loads exceeding specific dimensions, certified escorts are mandatory. Our platform automatically assigns the required number of lead and chase vehicles based on Texas law.",
      features: [
        "Certified Height Pole cars for over-height loads",
        "Lead and Chase vehicles for over-width safety",
        "Seamless communication between driver, escort, and shipper",
      ],
      image: truckImage3,
    },
    {
      icon: <MapPin className="w-12 h-12" />,
      title: "Route Surveys & Planning",
      description: "Don't get stuck at a low bridge. We provide comprehensive route planning and physical route surveys for Super Loads, ensuring your path is clear of obstacles before the truck ever moves.",
      features: [
        "Vertical clearance checks for bridges and power lines",
        "Turning radius analysis for long loads",
        "Construction zone and road closure avoidance",
      ],
      image: truckImage4,
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Logistics Coordination",
      description: "End-to-end logistics management to ensure your oversize shipment moves smoothly from origin to destination.",
      features: [
        "Carrier vetting and assignment",
        "Scheduling and timeline management",
        "Communication with all stakeholders",
        "Problem resolution",
      ],
      image: truckImage5,
    },
  ];

  const permits = [
    {
      title: "Single Trip Permits",
      description: "For one-time oversize shipments with specific origin and destination.",
    },
    {
      title: "Annual Permits",
      description: "Cost-effective solution for frequent oversize movers with recurring routes.",
    },
    {
      title: "Superload Permits",
      description: "Specialized permits for extreme dimensions or weights requiring additional review.",
    },
    {
      title: "Emergency Permits",
      description: "Expedited processing for time-sensitive shipments with valid justification.",
    },
  ];

  const process = [
    {
      title: "Submit Shipment Details",
      description: "Provide cargo specifications, origin, destination, and timeline through our portal.",
    },
    {
      title: "Receive Comprehensive Quote",
      description: "Get a detailed breakdown of costs including transport, permits, and escorts.",
    },
    {
      title: "We Handle the Logistics",
      description: "Our team secures permits, assigns carriers, plans routes, and coordinates escorts.",
    },
    {
      title: "Track & Manage",
      description: "Monitor your shipment in real-time through our portal with 24/7 visibility.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
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
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-1xl mb-8  mx-auto text-gray-200"
          >
            Comprehensive oversize cargo solutions tailored for Texas regulations and routes
          </motion.p>

        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-40">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                <div className={`pb-12 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>

                  <h2 className="text-3xl md:text-4xl font-display font-black mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={index % 2 === 1 ? "lg:order-1" : ""}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-2xl shadow-lg w-full object-cover h-[500px] hover:shadow-2xl transition-shadow duration-300"
                  />
                </motion.div>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Permit Services Section */}
      <section className="py-20 dark-gradient text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Texas Permit Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined permit acquisition. Navigating Texas oversize/overweight permits can be complex. Our automated system and expert team handle the entire process for you.
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {permits.map((permit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-display font-bold mb-3">
                  {permit.title}
                </h3>
                <p className="text-gray-300">
                  {permit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Our Service Process
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps from quote to delivery
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {process.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center text-2xl font-display font-black text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
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
            Experience the easiest way to book and manage oversize cargo transportation in Texas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white border-0 hover:scale-105 transition-transform duration-200">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-[#1E2B3E] bg-transparent hover:scale-105 transition-transform duration-200">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
