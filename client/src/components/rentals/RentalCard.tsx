import { Equipment } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Phone, Star, StarHalf } from "lucide-react";
import { Link } from "wouter";

interface RentalCardProps {
  equipment: Equipment;
}

export default function RentalCard({ equipment }: RentalCardProps) {
  const isAvailableNow = equipment.availabilityStatus.toLowerCase().includes('available now');
  const isBooked = equipment.availabilityStatus.toLowerCase().includes('booked');
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-[#FFA000] text-sm h-4 w-4" fill="#FFA000" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-[#FFA000] text-sm h-4 w-4" fill="#FFA000" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300 text-sm h-4 w-4" />);
    }
    
    return stars;
  };

  return (
    <Card className="bg-white overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">
          <img 
            src={equipment.imageUrl} 
            alt={equipment.name} 
            className="w-full h-full object-cover max-h-64 md:max-h-full" 
          />
        </div>
        <CardContent className="p-4 md:p-6 flex-1">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <h3 className="font-medium text-lg">{equipment.name}</h3>
            <div className="flex items-center">
              {renderStars(equipment.rating)}
              <span className="text-gray-600 text-sm ml-1">({equipment.reviewCount})</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            {equipment.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {equipment.features.map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-[#2E7D32]">
              {formatCurrency(equipment.price)}/day
            </div>
            <div className={`text-sm ${
              isAvailableNow 
                ? 'text-[#4CAF50]' 
                : isBooked 
                  ? 'text-[#D32F2F]' 
                  : 'text-[#FF9800]'
            }`}>
              {equipment.availabilityStatus}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isBooked ? (
              <Button 
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white cursor-pointer"
              >
                Join Waitlist
              </Button>
            ) : (
              <Button 
                asChild
                className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              >
                <Link to={`/rentals/${equipment.id}`}>
                  Reserve Now
                </Link>
              </Button>
            )}
            <Button variant="outline" size="icon" aria-label="Information">
              <Info className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Call"
              onClick={() => window.location.href = `tel:${equipment.contactPhone}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
