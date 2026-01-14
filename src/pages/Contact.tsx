import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Address",
      info: "Texas, USA",
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone",
      info: "(555) 123-4567",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      info: "info@highnheavy.com",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Business Hours",
      info: "Monday - Friday: 7:00 AM - 7:00 PM CST",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
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
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-100"
          >
            Have questions? We're here to help with your oversize cargo transportation needs.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-8 rounded-xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg text-center hover:-translate-y-1"
              >
                <div className="text-primary mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.info}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 43, 62, 0.95), rgba(30, 43, 62, 0.95)), url(${heroImage2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl"
              >
                <h2 className="text-3xl font-display font-black mb-6 text-white">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-200">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-200">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote">Request a Quote</SelectItem>
                        <SelectItem value="carrier">Carrier Registration</SelectItem>
                        <SelectItem value="escort">Escort Registration</SelectItem>
                        <SelectItem value="support">Customer Support</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-200">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white border-0 hover:scale-105 transition-transform duration-200">
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Info Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8 text-white"
              >
                <div>
                  <h2 className="text-3xl font-display font-black mb-4">
                    Get in Touch
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Whether you need a quote for an oversize shipment, want to join our carrier or escort network, or have questions about our services, we're here to help.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-display font-bold mb-4 text-primary">
                    Quick Response Times
                  </h3>
                  <p className="text-gray-300 mb-4">
                    We understand that time is critical in logistics. Our team typically responds to all inquiries within 2-4 business hours during business days.
                  </p>
                  <p className="text-gray-300">
                    For urgent matters or active shipment issues, please call our 24/7 support line.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-display font-bold mb-4 text-primary">
                    Join Our Network
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Interested in becoming a carrier or escort partner? Visit our dedicated registration pages to learn about requirements and benefits.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white hover:text-secondary bg-transparent hover:scale-105 transition-transform duration-200">
                      Carrier Registration
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white hover:text-secondary bg-transparent hover:scale-105 transition-transform duration-200">
                      Escort Registration
                    </Button>
                  </div>
                </div>

                <div className="bg-primary rounded-xl p-6 shadow-lg hover:bg-primary/90 transition-colors duration-300">
                  <h3 className="text-xl font-display font-bold mb-2 text-white">
                    24/7 Emergency Support
                  </h3>
                  <p className="mb-4 text-white/90">
                    For active shipment emergencies or urgent road assistance, call our emergency hotline:
                  </p>
                  <p className="text-2xl font-display font-black text-white">
                    (555) 911-HAUL
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-muted rounded-2xl overflow-hidden h-[400px] flex items-center justify-center shadow-lg"
          >
            <div className="text-center w-full h-full">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6998877.423570396!2d-105.36501756732181!3d31.070225029312656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864070360b823249%3A0x16eb1c8f1808de3c!2sTexas%2C%20USA!5e0!3m2!1sen!2sng!4v1764162811208!5m2!1sen!2sng" width="100%" height="100%" style={{ border: 0 }} loading="lazy" ></iframe>
            </div>
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

export default Contact;
