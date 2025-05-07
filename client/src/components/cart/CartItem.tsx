import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { type CartItem as CartItemType } from "@shared/schema";
import { Minus, Plus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      removeFromCart(item.productId);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <img 
        src={item.imageUrl} 
        alt={item.name} 
        className="w-16 h-16 object-cover rounded mr-4" 
      />
      <div className="flex-grow">
        <h4 className="font-medium mb-1">{item.name}</h4>
        <p className="text-sm text-gray-500 mb-2">{item.unit}</p>
        <div className="flex items-center">
          <button 
            className="text-gray-500 hover:text-[#2E7D32] p-1"
            onClick={handleDecrease}
            aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
          <button 
            className="text-gray-500 hover:text-[#2E7D32] p-1"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
          <span className="ml-auto font-medium">{formatCurrency(itemTotal)}</span>
        </div>
      </div>
    </div>
  );
}
