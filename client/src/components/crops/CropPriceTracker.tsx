import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Crop, Market } from "@shared/schema";
import CropPriceCard from "./CropPriceCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function CropPriceTracker() {
  const [selectedMarket, setSelectedMarket] = useState<string>("1"); // Default to the first market
  
  const { data: markets, isLoading: isLoadingMarkets } = useQuery({
    queryKey: ["/api/markets"],
    queryFn: async () => {
      const res = await fetch("/api/markets");
      return res.json() as Promise<Market[]>;
    }
  });
  
  const { 
    data: crops, 
    isLoading: isLoadingCrops, 
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["/api/crops/market", selectedMarket],
    queryFn: async () => {
      const res = await fetch(`/api/crops/market/${selectedMarket}`);
      return res.json() as Promise<Crop[]>;
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleMarketChange = (value: string) => {
    setSelectedMarket(value);
  };

  const isLoading = isLoadingMarkets || isLoadingCrops || isFetching;

  return (
    <section id="prices" className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#333333]">Crop Price Tracker</h2>
            <p className="text-gray-600">Current market prices with trend indicators</p>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Select 
              value={selectedMarket} 
              onValueChange={handleMarketChange}
              disabled={isLoading || !markets}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                {markets?.map((market) => (
                  <SelectItem key={market.id} value={market.id.toString()}>
                    {market.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleRefresh} 
              disabled={isLoading}
              variant="default"
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {isError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
            Failed to load crop prices. Please try again.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm h-[160px] animate-pulse">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops?.map((crop) => (
              <CropPriceCard key={crop.id} crop={crop} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/crops" className="text-[#2E7D32] font-medium inline-flex items-center hover:underline">
            View all crop prices 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
