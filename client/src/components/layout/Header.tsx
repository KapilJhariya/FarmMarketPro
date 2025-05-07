import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./MobileMenu";
import ShoppingCart from "../cart/ShoppingCart";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart as CartIcon, User } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems, toggleCart } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Crop Prices", path: "/crops" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Equipment Rentals", path: "/rentals" },
    { label: "Order History", path: "/order-history" }
  ];

  return (
    <header className={`bg-white w-full z-50 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center w-full md:w-auto justify-between">
            <Link to="/">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-[#2E7D32] h-8 w-8 mr-2"
                >
                  <path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.95 7.92 7 8.8V22l4-2 .5 2 .5-2 4 2v-2.2c4.05-.88 7-4.63 7-8.8a9 9 0 0 0-9-9Z"/>
                  <path d="M8 12h8"/>
                  <path d="M10 9v6"/>
                  <path d="M14 9v6"/>
                </svg>
                <h1 className="font-bold text-2xl text-[#2E7D32]">AgriConnect</h1>
              </div>
            </Link>
            <button 
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
          
          <nav className="hidden md:flex w-full md:w-auto flex-col md:flex-row mt-4 md:mt-0">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`font-medium px-4 py-2 md:py-0 border-b md:border-b-0 border-gray-200 md:border-transparent ${
                  location === link.path ? 'text-[#2E7D32]' : 'text-[#333333] hover:text-[#2E7D32]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center">
            <div className="relative mr-4">
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pr-10 w-40 focus:w-56 transition-all rounded-full" 
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 h-4 w-4" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative p-2" 
              onClick={toggleCart}
              aria-label="Shopping cart"
            >
              <CartIcon className="h-6 w-6 text-[#333333]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFA000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="ml-4 text-sm font-medium">
              <User className="h-5 w-5 mr-1" />
              <span>John Farmer</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        navLinks={navLinks}
      />
      
      {/* Shopping Cart */}
      <ShoppingCart />
    </header>
  );
}
