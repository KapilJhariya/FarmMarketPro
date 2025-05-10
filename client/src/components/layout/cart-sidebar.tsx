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
import { useAuth } from "@/hooks/use-auth";

const CartSidebar = () => {
  const { cart, isLoading, isCartOpen, closeCart, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("123 Farm Road, Farmington, IL 61234");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card ending in 4242");
  const { toast } = useToast();
  const { user } = useAuth();

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
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
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

  // Validate form input
  const validateOrder = () => {
    if (!shippingAddress.trim()) {
      toast({
        title: "Shipping Address Required",
        description: "Please enter your shipping address to continue.",
        variant: "destructive",
      });
      return false;
    }
    return true;
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
            <div className="border rounded-md p-4 bg-gray-50 mb-4">
              <p className="text-sm font-medium">Order Summary</p>
              <p className="text-sm text-gray-500">Total Items: {cart.items.length}</p>
              <p className="text-sm text-gray-500">Total Amount: {formatCurrency(cart.total)}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="shippingAddress" className="text-sm font-medium block mb-1">
                  Shipping Address
                </label>
                <textarea 
                  id="shippingAddress"
                  className="w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your shipping address"
                />
              </div>
              
              <div>
                <label htmlFor="paymentMethod" className="text-sm font-medium block mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Credit Card ending in 4242">Credit Card ending in 4242</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
              Cancel
            </Button>
            <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={async () => {
                  // Validate inputs first
                  if (!validateOrder()) {
                    return;
                  }
                  
                  setProcessingOrder(true);
                  try {
                    // Create the order in the database
                    const { mockOrder, products } = generateReceiptFromCart();
                    
                    // Check if user is authenticated
                    if (!user) {
                      toast({
                        title: "Authentication Required",
                        description: "Please log in to complete your order",
                        variant: "destructive",
                      });
                      setProcessingOrder(false);
                      setShowReceiptDialog(false);
                      closeCart();
                      navigate("/auth");
                      return;
                    }
                    
                    // Create order with the API
                    const response = await fetch("/api/orders", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userId: user.id,
                        orderNumber: mockOrder.orderNumber,
                        subtotal: mockOrder.subtotal,
                        shippingCost: mockOrder.shippingCost,
                        total: mockOrder.total,
                        status: "Processing",
                        shippingAddress: mockOrder.shippingAddress,
                        paymentMethod: mockOrder.paymentMethod
                      })
                    });
                    
                    if (!response.ok) {
                      throw new Error("Failed to create order");
                    }
                    
                    // Parse the response to get the order data
                    const order = await response.json();
                    console.log("Created order:", order);
                    
                    // Add each item to the order
                    for (const item of mockOrder.items) {
                      const itemResponse = await fetch(`/api/orders/${order.id}/items`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          productId: item.productId,
                          quantity: item.quantity,
                          price: item.price,
                          subtotal: item.subtotal
                        })
                      });
                      
                      if (!itemResponse.ok) {
                        console.warn("Failed to add item to order:", item);
                      }
                    }
                    
                    // Download receipt
                    downloadOrderReceipt(mockOrder, products);
                    
                    // Clear the cart
                    await clearCart();
                    
                    // Show success toast - wrapped in setTimeout to avoid React rendering issues
                    setTimeout(() => {
                      toast({
                        title: "Order Placed Successfully",
                        description: "Your order has been placed and will be processed shortly.",
                        variant: "default",
                      });
                    }, 100);
                    
                    // Close dialog and navigate to order history
                    setShowReceiptDialog(false);
                    closeCart();
                    navigate("/order-history");
                  } catch (error) {
                    console.error("Error placing order:", error);
                    // Delay toast to avoid React rendering issues
                    setTimeout(() => {
                      toast({
                        title: "Error",
                        description: "There was a problem creating your order. Please try again.",
                        variant: "destructive",
                      });
                    }, 100);
                  } finally {
                    setProcessingOrder(false);
                  }
                }}
                disabled={processingOrder}
              >
                {processingOrder ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                Complete Order & View History
              </Button>
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
