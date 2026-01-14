import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.svg";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Carrier", path: "/carrier" },
    { name: "Escort", path: "/escort" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return "/signin";
    return {
      shipper: '/dashboard/shipper',
      carrier: '/dashboard/carrier',
      escort: '/dashboard/escort',
      admin: '/dashboard/admin',
      driver: '/dashboard/driver'
    }[user.role] || '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-24 h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to={getDashboardLink()}>
                  <Button size="lg" className="hero-gradient border-0 hover:scale-105 transition-transform duration-200">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="outline" size="lg" className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg" className="hero-gradient border-0 hover:scale-105 transition-transform duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-foreground"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="space-y-3 mt-4">
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button size="lg" className="w-full hero-gradient border-0">
                  Sign Up
                </Button>
              </Link>
              <Link to="/signin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="lg" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
