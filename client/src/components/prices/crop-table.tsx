import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface PriceHistoryGraphProps {
  history: number[];
  trend: string;
}

const PriceHistoryGraph = ({ history, trend }: PriceHistoryGraphProps) => {
  const barColor = trend === "up" ? "bg-success" : "bg-error";
  
  return (
    <div className="flex items-center">
      <span className={trend === "up" ? "text-success" : "text-error"}>
        {trend === "up" ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      </span>
      <div className="h-10 w-24 bg-gray-100 ml-2 relative">
        <div className="absolute inset-0 flex items-end">
          {history.map((value, index) => {
            // Calculate the height percentage based on min/max values in history
            const min = Math.min(...history);
            const max = Math.max(...history);
            const range = max - min;
            const heightPercent = range === 0 ? 50 : ((value - min) / range) * 100;
            
            // Only color the recent bars with the trend color
            const isRecent = index >= history.length - 4;
            
            return (
              <div 
                key={index} 
                style={{ height: `${Math.max(20, heightPercent)}%` }} 
                className={`${isRecent ? barColor : "bg-gray-300"} w-1 ${index > 0 ? "mx-px" : ""}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CropTable = () => {
  const { data: crops, isLoading, error } = useQuery({
    queryKey: ["/api/crops"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-14" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price (USD/ton)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-10 w-32" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <p className="text-red-500">Error loading crop data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">Current Market Prices</h3>
          <p className="text-sm text-gray-500">Last updated: Today, {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">Day</button>
          <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">Week</button>
          <button className="bg-primary text-white px-3 py-1 rounded text-sm">Month</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price (USD/ton)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={crop.imageUrl} alt={crop.name} className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <div className="font-medium">{crop.name}</div>
                      <div className="text-sm text-gray-500">{crop.variety}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{formatCurrency(crop.currentPrice)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${crop.trend === 'up' ? 'text-success' : 'text-error'}`}>
                    {crop.change > 0 ? "+" : ""}{formatCurrency(crop.change)} ({crop.percentChange > 0 ? "+" : ""}{crop.percentChange.toFixed(1)}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriceHistoryGraph 
                    history={crop.priceHistory} 
                    trend={crop.trend} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CropTable;
