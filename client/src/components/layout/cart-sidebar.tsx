import { useEffect } from "react";
import { useLocation } from "wouter";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import CartItem from "@/components/cart/cart-item";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CartSidebar = () => {
  const { cart, isLoading, isCartOpen, closeCart } = useCart();
  const [, navigate] = useLocation();

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // Default user for demo
          subtotal: cart.subtotal,
          shippingCost: cart.shippingCost,
          total: cart.total,
          status: "Pending",
          shippingAddress: "123 Farm Road, Agriville, AG 54321",
          paymentMethod: "Credit Card",
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const order = await response.json();

      // Add each cart item to the order
      await Promise.all(
        cart.items.map(async (item) => {
          await fetch(`/api/orders/${order.id}/items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal,
            }),
          });
        })
      );

      // Clear the cart
      await fetch(`/api/cart/user/1`, {
        method: "DELETE",
      });

      // Navigate to confirmation page
      closeCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50 flex flex-col transition-transform duration-300">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Your Cart ({cart.items.length})
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add items from the marketplace to get started.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  closeCart();
                  navigate("/marketplace");
                }}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Estimated Shipping</span>
              <span className="font-medium">{formatCurrency(cart.shippingCost)}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
            <Button 
              className="w-full mb-2 bg-primary hover:bg-primary/90" 
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Proceed to Checkout
            </Button>
            <Button 
              variant="link" 
              className="w-full text-primary"
              onClick={() => {
                closeCart();
                navigate("/marketplace");
              }}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
