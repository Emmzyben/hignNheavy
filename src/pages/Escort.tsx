import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp, Shield, Smartphone, Headphones, Clock, CheckCircle2, Truck, Ruler, Radio, Siren, Map, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import escortImage from "@/assets/lead-pilot-car-front-escort.jpg";
import heroImage from "@/assets/hero.svg";
import heroImage2 from "@/assets/frame.svg";
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

const Escort = () => {
  const navigate = useNavigate();

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
            className="text-5xl md:text-7xl font-display font-black mb-6"
          >
            Become a HighnHeavy <br /> <span className="text-primary">Escort</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-100"
          >
            Join our elite network of certified pilot car escorts and ensure the safe transport <br /> of oversize loads across Texas.
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Escort With <span className="text-primary">HighnHeavy</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We handle the coordination and payment so you can focus on protecting the load and the public.
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-8 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={escortImage}
                alt="Escort requirements"
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-black mb-6">
                Escort Requirements
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                To maintain the highest safety standards, we require all escorts in our network to meet these qualifications:
              </p>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={20} />
                    <span>{req}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
              Required Equipment
            </h2>
            <p className="text-xl text-muted-foreground">
              Essential equipment for professional escort operations
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {equipment.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-8 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration Process */}
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
              Registration Process
            </h2>
            <p className="text-xl text-gray-300">
              Four simple steps to join our escort network
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
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
                <p className="text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                Start Your Application
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join our elite team of escorts. Create your account to begin the registration process.
              </p>
              <Button
                size="lg"
                className="text-lg px-10 py-6 hover:scale-105 transition-transform duration-200"
                onClick={() => navigate("/signup?role=escort")}
              >
                Apply Now
              </Button>
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

export default Escort;
