import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const [location] = useLocation();

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
            <li>
              <Link href="/rentals/history">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Rental History</a>
              </Link>
            </li>
            <li className="border-t pt-3 mt-4">
              <Link href="/order-history">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">My Account</a>
              </Link>
            </li>
            <li>
              <Link href="/order-history">
                <a className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Order History</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
