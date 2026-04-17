import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const TermsOfService = () => {
    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="bg-[#1E2B3E] py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-black text-white mb-6"
                    >
                        Terms of <span className="text-primary">Service</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 max-w-2xl mx-auto text-lg"
                    >
                        These terms govern your use of the HighnHeavy platform and services.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                By accessing or using the HighnHeavy platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">2. Platform Role</h2>
                            <p className="text-gray-600 leading-relaxed">
                                HighnHeavy provides a platform to connect shippers with carriers and escorts for oversize cargo transportation. We are not a carrier, broker, or freight forwarder. Our role is limited to facilitating these connections and managing the platform.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">3. User Responsibilities</h2>
                            <div className="space-y-4 text-gray-600 mt-4 leading-relaxed">
                                <p><strong>Shippers:</strong> Responsible for providing accurate cargo dimensions, weight, and scheduling details.</p>
                                <p><strong>Carriers:</strong> Must maintain valid DOT/MC numbers, active insurance, and comply with all state and federal regulations.</p>
                                <p><strong>Escorts:</strong> Must maintain required certifications and provide pilot car services in accordance with permit requirements.</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">4. Payments and Fees</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Users agree to the pricing and fee structure presented at the time of booking. HighnHeavy handles payment processing through third-party providers. Cancellations and refunds are subject to our specific Booking Policy.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 font-display text-secondary">5. Limitation of Liability</h2>
                            <p className="text-gray-600 leading-relaxed">
                                HighnHeavy is not liable for cargo damage, delays, or accidents occurring during transport. These are the responsibility of the carrier and their respective insurance providers. Our liability is limited to the fees paid for using the platform.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">6. Governing Law</h2>
                            <p className="text-gray-600 leading-relaxed">
                                These terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts located in Texas, USA.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <p className="text-gray-500 italic">
                                Last Updated: February 23, 2026
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
