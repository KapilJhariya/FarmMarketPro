import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface WorkerCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  hourlyRate: number;
  availability: string;
  skills: string[];
  onRequest: (laborId: number) => void;
}

const WorkerCard = ({
  id,
  title,
  description,
  imageUrl,
  hourlyRate,
  availability,
  skills,
  onRequest
}: WorkerCardProps) => {
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const isAvailableNow = availability.toLowerCase().includes("immediate");

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      // Pass the labor ID to the parent component
      onRequest(id);
      toast({
        title: "Labor Request Added",
        description: "This labor option has been added to your request form.",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-40 h-40">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h4 className="font-medium text-lg">{title}</h4>
          <p className="text-sm text-gray-500 mb-2">{description}</p>
          <div className="flex items-center mb-2">
            {isAvailableNow ? (
              <Check className="text-success h-4 w-4 mr-1" />
            ) : (
              <Clock className="text-warning h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              {availability}
            </span>
          </div>
          <div className="flex items-center mb-3">
            <DollarSign className="text-primary h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              {formatCurrency(hourlyRate)}/hour
            </span>
          </div>
          <Button 
            className="bg-secondary hover:bg-yellow-600 text-white"
            size="sm"
            onClick={handleRequest}
            disabled={isRequesting}
          >
            {isRequesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              isAvailableNow ? "Request Team" : "Book in Advance"
            )}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default WorkerCard;
