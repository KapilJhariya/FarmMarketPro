import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Crop, Market } from "@shared/schema";
import CropPriceCard from "@/components/crops/CropPriceCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

export default function CropPrices() {
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
    <>
      <Helmet>
        <title>Crop Price Tracker | AgriConnect</title>
        <meta 
          name="description" 
          content="Track real-time crop prices across different markets with price trend indicators to make informed selling decisions." 
        />
        <meta property="og:title" content="Crop Price Tracker | AgriConnect" />
        <meta 
          property="og:description" 
          content="Track real-time crop prices across different markets with price trend indicators." 
        />
      </Helmet>
    
      <section className="py-8 md:py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Crop Price Tracker</h1>
            <p className="text-gray-600 max-w-3xl">
              Stay informed about the latest crop prices in different markets. Our price tracker provides 
              up-to-date information with trend indicators to help you make informed decisions about when to sell your crops.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {crops?.map((crop) => (
                <CropPriceCard key={crop.id} crop={crop} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
