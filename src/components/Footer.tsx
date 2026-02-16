import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import bgImage from "@/assets/footerlogo.svg";
const Footer = () => {
  return (
    <footer className="dark-gradient text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <img src={bgImage} alt="" className="w-24 h-12 mb-4" />
            <p className="text-gray-300 mb-4">
              Your trusted partner for oversize cargo transport across Texas.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/carrier" className="text-gray-300 hover:text-primary transition-colors">
                  Carrier Registration
                </Link>
              </li>
              <li>
                <Link to="/escort" className="text-gray-300 hover:text-primary transition-colors">
                  Escort Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">

              <li>
                <Link to="/signIn" className="text-gray-300 hover:text-primary transition-colors">
                  Shipper Login
                </Link>
              </li>

              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  Download Driver App
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>Texas, USA</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone size={20} className="flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail size={20} className="flex-shrink-0" />
                <span>info@highnheavy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 HighnHeavy LLC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
