import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  showItems?: boolean;
}

export default function CartSummary({ showItems = true }: CartSummaryProps) {
  const { cartItems, subtotal, tax, shipping, total } = useCart();

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {showItems && cartItems.length > 0 && (
          <>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
          </>
        )}
        
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          {shipping === 0 ? (
            <p className="text-[#4CAF50]">Free shipping applied!</p>
          ) : (
            <p>Free shipping on orders over $100</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
