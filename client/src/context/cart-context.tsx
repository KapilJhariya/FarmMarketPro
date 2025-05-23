import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  unit: string;
  subtotal: number;
}

interface CartSummary {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

interface CartContextType {
  cart: CartSummary;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    shippingCost: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!user) {
      // If no user, set an empty cart
      setCart({
        items: [],
        subtotal: 0,
        shippingCost: 0,
        total: 0
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]); // Refetch when the user changes

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/cart", {
        userId: user.id,
        productId,
        quantity
      });
      await fetchCart();
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await apiRequest("PUT", `/api/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await apiRequest("DELETE", `/api/cart/${cartItemId}`);
      await fetchCart();
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await apiRequest("DELETE", `/api/cart/user/${user.id}`);
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
