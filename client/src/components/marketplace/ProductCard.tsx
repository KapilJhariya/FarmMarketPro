import { Product } from "@shared/schema";
import { formatCurrency, truncateText } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      unit: product.unit,
      imageUrl: product.imageUrl
    });
  };

  const getBadgeColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'best seller':
        return 'bg-[#FFA000] text-white';
      case 'eco-friendly':
        return 'bg-[#4CAF50] text-white';
      case 'high yield':
        return 'bg-[#FF9800] text-white';
      case 'durable':
        return 'bg-[#2E7D32] text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Card className="bg-[#F5F5F5] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg mb-2">{product.name}</h3>
          {product.isBestSeller && (
            <span className="bg-[#FFA000] text-white text-xs font-bold px-2 py-1 rounded">
              BEST SELLER
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3">
          {truncateText(product.description, 80)}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-[#2E7D32]">
            {formatCurrency(product.price)}
          </div>
          <div className="text-sm text-gray-500">{product.unit}</div>
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white flex items-center justify-center"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
