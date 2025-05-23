import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Recycle, LogOut, User } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MobileNav from "@/components/layout/mobile-nav";
import CartSidebar from "@/components/layout/cart-sidebar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Function to get user's initials for the avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    return user.fullName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="bg-primary text-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-2 sm:px-4 py-2 md:py-3">
          <div className="flex justify-between items-center">
            {/* Logo - Touch-friendly with larger tap target */}
            <Link href="/" className="flex items-center py-2 pr-1 sm:pr-2 md:pr-4 flex-shrink-0 min-w-0">
              <Recycle className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 flex-shrink-0" />
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">AgriManage</h1>
            </Link>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-5 flex-grow justify-center mx-2 lg:mx-4">
              <Link href="/" className={`py-2 px-2 lg:px-3 font-medium hover:bg-primary-dark rounded-md transition-colors ${location === '/' ? 'bg-primary-dark' : ''}`}>
                Home
              </Link>
              <Link href="/prices" className={`py-2 px-2 lg:px-3 font-medium hover:bg-primary-dark rounded-md transition-colors ${location === '/prices' ? 'bg-primary-dark' : ''}`}>
                Crop Prices
              </Link>
              <Link href="/marketplace" className={`py-2 px-2 lg:px-3 font-medium hover:bg-primary-dark rounded-md transition-colors ${location === '/marketplace' ? 'bg-primary-dark' : ''}`}>
                Marketplace
              </Link>
              <Link href="/rentals" className={`py-2 px-2 lg:px-3 font-medium hover:bg-primary-dark rounded-md transition-colors ${location === '/rentals' ? 'bg-primary-dark' : ''}`}>
                Equipment
              </Link>
              {user && (
                <Link href="/order-history" className={`py-2 px-2 lg:px-3 font-medium hover:bg-primary-dark rounded-md transition-colors ${location === '/order-history' ? 'bg-primary-dark' : ''}`}>
                  Account
                </Link>
              )}
            </nav>
            
            {/* Right-side Action Icons - Always visible on all screen sizes */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Cart Button - Visible on all screen sizes */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" 
                onClick={openCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Button>
              
              {/* User Menu - Always Visible */}
              {user ? (
                <div className="relative flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-white">
                          <AvatarFallback className="bg-secondary text-white text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 sm:w-56" align="end">
                      <div className="flex flex-col p-2">
                        <p className="text-sm font-medium">{user.fullName || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => {
                          navigate("/order-history");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>
                          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-primary hover:bg-gray-100 h-8 sm:h-9 px-1.5 sm:px-2 md:px-3 flex-shrink-0 text-xs md:text-sm whitespace-nowrap"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )}
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden h-8 w-8 sm:h-10 sm:w-9 flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </Button>
            </div>
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
