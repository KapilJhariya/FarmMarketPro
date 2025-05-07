import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface RentalCardProps {
  id: number;
  name: string;
  model: string;
  imageUrl: string;
  availableUnits: number;
  dailyRate: number;
  weeklyRate: number;
  onReserve: (equipmentId: number) => void;
}

const RentalCard = ({
  id,
  name,
  model,
  imageUrl,
  availableUnits,
  dailyRate,
  weeklyRate,
  onReserve
}: RentalCardProps) => {
  const { toast } = useToast();
  const [isReserving, setIsReserving] = useState(false);

  const handleReserve = async () => {
    setIsReserving(true);
    try {
      // Pass the equipment ID to the parent component
      onReserve(id);
      toast({
        title: "Equipment Selected",
        description: "This equipment has been added to your request form.",
      });
    } catch (error) {
      toast({
        title: "Reservation Failed",
        description: "There was an error selecting this equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-40 h-40">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h4 className="font-medium text-lg">{name}</h4>
          <p className="text-sm text-gray-500 mb-2">Model: {model}</p>
          <div className="flex items-center mb-2">
            <Calendar className="text-secondary h-4 w-4 mr-1" />
            <span className="text-sm">
              Available: {availableUnits} {availableUnits === 1 ? "unit" : "units"}
            </span>
          </div>
          <div className="flex items-center mb-3">
            <DollarSign className="text-primary h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              {formatCurrency(dailyRate)}/day or {formatCurrency(weeklyRate)}/week
            </span>
          </div>
          <Button 
            className="bg-secondary hover:bg-yellow-600 text-white"
            size="sm"
            onClick={handleReserve}
            disabled={isReserving}
          >
            {isReserving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reserving...
              </>
            ) : (
              "Reserve Now"
            )}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default RentalCard;
