import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CartItem from "./CartItem";
import { Link } from "wouter";

export default function ShoppingCart() {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    subtotal,
    tax,
    shipping,
    total
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={closeCart}
    >
      <div 
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lg transform h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-[#2E7D32] text-white">
            <h3 className="font-medium text-lg">
              Your Shopping Cart ({cartItems.length})
            </h3>
            <button 
              onClick={closeCart}
              className="text-white hover:text-gray-200"
              aria-label="Close cart"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-grow overflow-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-16 w-16 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-lg font-medium mb-4">Your cart is empty</p>
                <Button 
                  onClick={closeCart}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button 
                asChild
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-3 rounded-lg font-medium mb-2"
              >
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              <Button 
                variant="outline"
                onClick={closeCart}
                className="w-full text-[#2E7D32] border-[#2E7D32] hover:bg-gray-50"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
