import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CropTable from "@/components/prices/crop-table";
import PriceAlertForm from "@/components/prices/price-alert-form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const CropPrices = () => {
  const [timeframe, setTimeframe] = useState("month");

  // Market insights data
  const marketInsights = [
    {
      type: "info",
      title: "Weather Impact",
      description: "Recent rainfall in the Midwest is expected to boost corn yields, potentially lowering prices in the coming weeks."
    },
    {
      type: "warning",
      title: "Supply Chain Alert",
      description: "Transportation disruptions may affect wheat deliveries to eastern markets. Plan accordingly."
    },
    {
      type: "success",
      title: "Rice Export Opportunity",
      description: "International demand for long grain rice increasing due to shortages in Asian markets."
    }
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-roboto mb-2">Crop Price Tracker</h1>
          <p className="text-gray-600">Monitor real-time market prices for your crops</p>
        </div>
        
        <Tabs defaultValue="prices" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4">
            <TabsTrigger value="prices">Current Prices</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prices">
            <CropTable />
          </TabsContent>
          
          <TabsContent value="historical">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium mb-2">Historical Price Trends</h3>
                  <p className="text-gray-500">
                    View how crop prices have changed over time to make informed decisions
                  </p>
                </div>
                
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                  <p className="text-gray-500">Historical price charts will be available soon</p>
                </div>
                
                <div className="flex justify-center space-x-2">
                  <button 
                    className={`px-3 py-1 rounded text-sm ${timeframe === "week" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    onClick={() => setTimeframe("week")}
                  >
                    Week
                  </button>
                  <button 
                    className={`px-3 py-1 rounded text-sm ${timeframe === "month" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    onClick={() => setTimeframe("month")}
                  >
                    Month
                  </button>
                  <button 
                    className={`px-3 py-1 rounded text-sm ${timeframe === "year" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    onClick={() => setTimeframe("year")}
                  >
                    Year
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-4">Market Insights</h3>
            <div className="space-y-4">
              {marketInsights.map((insight, index) => (
                <Alert key={index} variant={insight.type === "warning" ? "destructive" : "default"}>
                  <Info className={
                    insight.type === "info" ? "h-4 w-4 text-primary" : 
                    insight.type === "warning" ? "h-4 w-4 text-warning" : 
                    "h-4 w-4 text-success"
                  } />
                  <AlertTitle>{insight.title}</AlertTitle>
                  <AlertDescription>
                    {insight.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Price Alerts</h3>
                <PriceAlertForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPrices;
