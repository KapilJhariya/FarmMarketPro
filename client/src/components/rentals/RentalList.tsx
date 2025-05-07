import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import RentalCard from "./RentalCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function RentalList() {
  const [selectedDistance, setSelectedDistance] = useState("25"); // Default to 25 miles
  
  const { 
    data: equipment, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['/api/equipment', selectedDistance],
    queryFn: async () => {
      const res = await fetch(`/api/equipment?distance=${selectedDistance}`);
      return res.json() as Promise<Equipment[]>;
    }
  });

  const handleDistanceChange = (value: string) => {
    setSelectedDistance(value);
  };

  const distanceOptions = [
    { value: "25", label: "Within 25 miles" },
    { value: "50", label: "Within 50 miles" },
    { value: "100", label: "Within 100 miles" },
    { value: "1000", label: "Any distance" }
  ];

  return (
    <section id="rentals" className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#333333]">Equipment & Labor Rentals</h2>
            <p className="text-gray-600">Rent machinery and hire seasonal workers</p>
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Select 
              value={selectedDistance} 
              onValueChange={handleDistanceChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Distance" />
              </SelectTrigger>
              <SelectContent>
                {distanceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
            Failed to load equipment data. Please try again.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm h-[250px] animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 bg-gray-200 h-64 md:h-auto"></div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment?.map((item) => (
              <RentalCard key={item.id} equipment={item} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/rentals" className="text-[#2E7D32] font-medium inline-flex items-center hover:underline">
            View all equipment and labor options 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
