import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
                        Privacy <span className="text-primary">Policy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 max-w-2xl mx-auto text-lg"
                    >
                        At HighnHeavy, we take your privacy seriously. This policy explains how we collect, use, and protect your information.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">1. Information Collection</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We collect information you provide directly to us when you create an account, register as a carrier or escort, or contact us. This includes:
                            </p>
                            <ul className="list-disc ml-6 mt-4 text-gray-600 space-y-2">
                                <li>Personal identifiers (name, email, phone number)</li>
                                <li>Professional details (DOT/MC numbers, insurance coverage)</li>
                                <li>Location information for shipment tracking</li>
                                <li>Payment and billing information</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">2. Use of Information</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc ml-6 mt-4 text-gray-600 space-y-2">
                                <li>Provide, maintain, and improve our logistics platform</li>
                                <li>Facilitate bookings between shippers, carriers, and escorts</li>
                                <li>Process payments and provide invoices</li>
                                <li>Send technical notices, updates, and support messages</li>
                                <li>Monitor and analyze trends, usage, and activities</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">3. Data Sharing</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may share your information:
                            </p>
                            <ul className="list-disc ml-6 mt-4 text-gray-600 space-y-2">
                                <li>Between users (e.g., sharing carrier details with the shipper of a booked load)</li>
                                <li>With vendors providing services on our behalf (e.g., payment processors)</li>
                                <li>If required by law, regulation, or legal process</li>
                                <li>To protect the rights, property, and safety of HighnHeavy or others</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">4. Data Security</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We implement industry-standard security measures to protect your data. However, no electronic transmission or storage is 100% secure. We encourage you to use strong passwords and notify us immediately of any unauthorized account access.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-display font-bold mb-4 text-secondary">5. Your Privacy Rights</h2>
                            <p className="text-gray-600 leading-relaxed">
                                You have the right to access, update, or delete your personal information. You can manage most of this through your dashboard profile settings. For specific data requests, please contact our support team.
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

export default PrivacyPolicy;
