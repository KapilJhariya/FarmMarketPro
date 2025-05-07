import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { User, ShoppingCart as CartIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; path: string }>;
}

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const { cartItems, toggleCart } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white h-full overflow-auto">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-medium text-lg">Menu</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-4">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-full pr-10" 
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 h-4 w-4" />
          </div>
          
          <div className="flex items-center justify-between">
            <button className="flex items-center text-sm font-medium">
              <User className="h-5 w-5 mr-2" />
              <span>John Farmer</span>
            </button>
            
            <button 
              className="relative p-2" 
              onClick={() => {
                toggleCart();
                onClose();
              }}
              aria-label="Shopping cart"
            >
              <CartIcon className="h-6 w-6 text-[#333333]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFA000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        <nav className="p-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className="block px-4 py-3 text-[#333333] hover:bg-gray-100 rounded-md font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
