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
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Recycle className="h-6 w-6" />
            <h1 className="text-2xl font-bold font-roboto">AgriManage</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={`py-2 px-1 font-medium hover:underline ${location === '/' ? 'underline' : ''}`}>
              Home
            </Link>
            <Link href="/prices" className={`py-2 px-1 font-medium hover:underline ${location === '/prices' ? 'underline' : ''}`}>
              Crop Prices
            </Link>
            <Link href="/marketplace" className={`py-2 px-1 font-medium hover:underline ${location === '/marketplace' ? 'underline' : ''}`}>
              Marketplace
            </Link>
            <Link href="/rentals" className={`py-2 px-1 font-medium hover:underline ${location === '/rentals' ? 'underline' : ''}`}>
              Equipment Rentals
            </Link>
            {user && (
              <Link href="/order-history" className={`py-2 px-1 font-medium hover:underline ${location === '/order-history' ? 'underline' : ''}`}>
                My Account
              </Link>
            )}
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
            
            {user ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="bg-secondary text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user.fullName || user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate("/order-history")}
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
              <div className="hidden md:block">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              </div>
            )}
            
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
