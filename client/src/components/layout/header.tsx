import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Recycle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import MobileNav from "@/components/layout/mobile-nav";
import CartSidebar from "@/components/layout/cart-sidebar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const [location] = useLocation();

  return (
    <>
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Recycle className="h-6 w-6" />
            <h1 className="text-2xl font-bold font-roboto">AgriManage</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <a className={`py-2 px-1 font-medium hover:underline ${location === '/' ? 'underline' : ''}`}>
                Home
              </a>
            </Link>
            <Link href="/prices">
              <a className={`py-2 px-1 font-medium hover:underline ${location === '/prices' ? 'underline' : ''}`}>
                Crop Prices
              </a>
            </Link>
            <Link href="/marketplace">
              <a className={`py-2 px-1 font-medium hover:underline ${location === '/marketplace' ? 'underline' : ''}`}>
                Marketplace
              </a>
            </Link>
            <Link href="/rentals">
              <a className={`py-2 px-1 font-medium hover:underline ${location === '/rentals' ? 'underline' : ''}`}>
                Equipment Rentals
              </a>
            </Link>
            <Link href="/order-history">
              <a className={`py-2 px-1 font-medium hover:underline ${location === '/order-history' ? 'underline' : ''}`}>
                My Account
              </a>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={openCart}
            >
              <ShoppingCart className="h-6 w-6 text-white" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Button>
            <div className="hidden md:block">
              <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-gray-100">
                Sign In
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default Header;
