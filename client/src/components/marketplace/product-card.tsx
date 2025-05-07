import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Tag {
  label: string;
  color: "green" | "blue";
}

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  unit: string;
  tags: string[];
}

const getTagColor = (tag: string): "green" | "blue" => {
  const greenTags = ["Organic", "Eco-Friendly", "Non-GMO"];
  return greenTags.includes(tag) ? "green" : "blue";
};

const ProductCard = ({ id, name, description, price, imageUrl, unit, tags }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(id, 1);
    setIsAdding(false);
    setIsAdded(true);
    
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{unit}</p>
          </div>
          {tags && tags.length > 0 && (
            <Badge 
              className={`
                ${getTagColor(tags[0]) === "green" ? "bg-green-100 text-success" : "bg-blue-100 text-blue-800"}
                text-xs py-1 px-2 rounded-full
              `}
            >
              {tags[0]}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-lg">{formatCurrency(price)}</span>
          <Button
            variant="default"
            size="sm"
            className={`${isAdded ? "bg-success" : "bg-primary"} hover:bg-primary/90 text-white`}
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : isAdded ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Added
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
