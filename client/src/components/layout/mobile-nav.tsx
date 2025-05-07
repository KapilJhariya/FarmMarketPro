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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg text-primary">AgriManage</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
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
        
        <nav className="p-4">
          <ul className="space-y-3">
            <li>
              <Link href="/">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/prices">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Crop Prices</a>
              </Link>
            </li>
            <li>
              <Link href="/marketplace">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Marketplace</a>
              </Link>
            </li>
            <li>
              <Link href="/rentals">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Equipment Rentals</a>
              </Link>
            </li>
            
            {user && (
              <>
                <Separator className="my-2" />
                <li>
                  <Link href="/order-history">
                    <a className="flex items-center py-2 px-4 hover:bg-gray-100 rounded-lg">
                      <User className="h-4 w-4 mr-2" />
                      <span>My Account</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/order-history">
                    <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg pl-10">Order History</a>
                  </Link>
                </li>
                <li>
                  <Link href="/rentals/history">
                    <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg pl-10">Rental History</a>
                  </Link>
                </li>
                <Separator className="my-2" />
                <li>
                  <button 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex items-center py-2 px-4 w-full text-left text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
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
