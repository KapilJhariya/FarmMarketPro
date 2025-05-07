import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem as CartItemType } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    await updateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    await removeItem(item.id);
  };

  return (
    <div className="border-b py-3">
      <div className="flex">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded"
        />
        <div className="ml-3 flex-grow">
          <h4 className="font-medium text-sm">{item.name}</h4>
          <p className="text-xs text-gray-500">{item.unit}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0" 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-2 text-sm">{item.quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 p-0" 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
              onClick={handleRemove}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <span className="text-xs font-medium">
              Total: {formatCurrency(item.subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
