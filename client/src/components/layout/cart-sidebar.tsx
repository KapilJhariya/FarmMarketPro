import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { X, ShoppingCart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import CartItem from "@/components/cart/cart-item";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { downloadOrderReceipt } from "@/lib/pdf-generator";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CartSidebar = () => {
  const { cart, isLoading, isCartOpen, closeCart } = useCart();
  const [, navigate] = useLocation();
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);

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

  // Function to generate a mock receipt from the cart
  const generateReceiptFromCart = () => {
    // Create a mock order from the cart data
    const mockOrder = {
      id: 1,
      orderNumber: `AG${Date.now().toString().slice(-5)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      orderDate: new Date().toISOString(),
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      total: cart.total,
      status: "Processing",
      shippingAddress: "123 Farm Road, Farmington, IL 61234",
      paymentMethod: "Credit Card ending in 4242",
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        name: item.name // Add name to ensure it's available in the receipt
      }))
    };
    
    // Create a products array with the cart items
    const products = cart.items.map(item => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      unit: item.unit || 'Each',
      imageUrl: item.imageUrl || ''
    }));
    
    console.log("Order data:", mockOrder);
    console.log("Products data:", products);
    
    return { mockOrder, products };
  };
  
  // Function to download the receipt
  const downloadReceipt = () => {
    setProcessingOrder(true);
    
    try {
      const { mockOrder, products } = generateReceiptFromCart();
      downloadOrderReceipt(mockOrder, products);
      setProcessingOrder(false);
      setShowReceiptDialog(false);
    } catch (error) {
      console.error("Receipt generation error:", error);
      setProcessingOrder(false);
    }
  };

  // Original checkout function - now shows the receipt dialog instead
  const handleCheckout = async () => {
    try {
      setShowReceiptDialog(true);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">Complete Your Order</DialogTitle>
            <DialogDescription>
              Your order is ready to be processed. You can generate a receipt for your records or complete the order and view it in your order history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium">Order Summary</p>
              <p className="text-sm text-gray-500">Total Items: {cart.items.length}</p>
              <p className="text-sm text-gray-500">Total Amount: {formatCurrency(cart.total)}</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={downloadReceipt}
                disabled={processingOrder}
              >
                {processingOrder ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Generate Receipt
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  downloadReceipt();
                  setShowReceiptDialog(false);
                  closeCart();
                  navigate("/order-history");
                }}
                disabled={processingOrder}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Place Order & View History
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
