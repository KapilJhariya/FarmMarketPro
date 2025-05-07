import { Crop } from "@shared/schema";
import { formatCurrency, calculatePriceChange } from "@/lib/utils";
import { TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CropPriceCardProps {
  crop: Crop;
}

export default function CropPriceCard({ crop }: CropPriceCardProps) {
  const priceChange = calculatePriceChange(crop.currentPrice, crop.previousPrice);
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img 
              src={crop.imageUrl} 
              alt={`${crop.name} crop`} 
              className="w-12 h-12 object-cover rounded-md mr-3"
            />
            <div>
              <h3 className="font-medium text-lg">{crop.name}</h3>
              <p className="text-gray-500 text-sm">{crop.variety}</p>
            </div>
          </div>
          <div 
            className={`flex items-center rounded-full px-3 py-1 ${
              priceChange.isIncrease 
                ? 'bg-[#F5F5F5] text-[#4CAF50]' 
                : priceChange.isDecrease 
                  ? 'bg-[#F5F5F5] text-[#D32F2F]' 
                  : 'bg-[#F5F5F5] text-gray-500'
            }`}
          >
            {priceChange.isIncrease ? (
              <TrendingUp className="text-sm mr-1 h-4 w-4" />
            ) : priceChange.isDecrease ? (
              <TrendingDown className="text-sm mr-1 h-4 w-4" />
            ) : (
              <MoveRight className="text-sm mr-1 h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {priceChange.isUnchanged ? '0.0%' : `${priceChange.isIncrease ? '+' : '-'}${priceChange.percentage}%`}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-gray-700 mb-2 text-sm">
          <span>Current Price</span>
          <span>Previous</span>
        </div>
        
        <div className="flex justify-between items-end mb-4">
          <div className="text-2xl font-bold">{formatCurrency(crop.currentPrice)}</div>
          <div className="text-gray-500 line-through">{formatCurrency(crop.previousPrice)}</div>
        </div>
        
        <div className="text-xs text-gray-500 text-right">
          Updated: {new Date(crop.lastUpdated).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </CardContent>
    </Card>
  );
}
