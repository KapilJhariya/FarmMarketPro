import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Recycle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Close menu when navigating to a new page
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location, isOpen, onClose]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  const handleLogin = () => {
    navigate("/auth");
    onClose();
  };

  // Animation is now handled with CSS transforms

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="sticky top-0 bg-white p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg text-primary">AgriManage</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* User Account Section */}
        {user ? (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback className="bg-secondary text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{user.fullName || user.username}</h3>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b">
            <Button 
              variant="default" 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleLogin}
            >
              Sign In / Register
            </Button>
          </div>
        )}
        
        <nav className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
          <ul className="space-y-4">
            <li>
              <Link 
                href="/" 
                className={`flex items-center py-3 px-4 rounded-lg text-base ${location === '/' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                onClick={onClose}
              >
                <span className="w-full">Home</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/prices" 
                className={`flex items-center py-3 px-4 rounded-lg text-base ${location === '/prices' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                onClick={onClose}
              >
                <span className="w-full">Crop Prices</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/marketplace" 
                className={`flex items-center py-3 px-4 rounded-lg text-base ${location === '/marketplace' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                onClick={onClose}
              >
                <span className="w-full">Marketplace</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/rentals" 
                className={`flex items-center py-3 px-4 rounded-lg text-base ${location === '/rentals' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                onClick={onClose}
              >
                <span className="w-full">Equipment Rentals</span>
              </Link>
            </li>
            
            {user && (
              <>
                <Separator className="my-3" />
                <li>
                  <Link 
                    href="/order-history" 
                    className={`flex items-center py-3 px-4 rounded-lg text-base font-medium ${location === '/order-history' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    onClick={onClose}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>My Account</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/order-history" 
                    className={`flex items-center py-3 px-4 rounded-lg pl-12 text-base ${location === '/order-history' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                    onClick={onClose}
                  >
                    <span>Order History</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/rentals/history" 
                    className={`flex items-center py-3 px-4 rounded-lg pl-12 text-base ${location === '/rentals/history' ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}`}
                    onClick={onClose}
                  >
                    <span>Rental History</span>
                  </Link>
                </li>
                <Separator className="my-3" />
                <li>
                  <button 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex items-center py-3 px-4 w-full text-left text-red-600 hover:bg-red-50 rounded-lg text-base font-medium"
                    aria-label="Log out"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
