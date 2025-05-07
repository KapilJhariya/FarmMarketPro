import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Phone, ClipboardCheck, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RentalRequest {
  id: number;
  ticketNumber: string;
  contractorNumber: string;
  estimatedWaitTime: string;
  requestType: string;
  startDate: string;
  duration: string;
  description: string;
  status: string;
}

export default function RentalHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);

  useEffect(() => {
    const fetchRentalRequests = async () => {
      setIsLoading(true);
      try {
        // In a real application, we would get the user ID from authentication context
        const userId = 1; // Using the test user ID
        const response = await fetch(`/api/rental-requests/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rental requests');
        }
        
        const data = await response.json();
        setRentalRequests(data);
      } catch (error) {
        console.error('Error fetching rental requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRentalRequests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          asChild
          variant="outline"
          className="mb-4"
        >
          <Link to="/rentals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rentals
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Rental History</h1>
        <p className="text-gray-600 mt-2">View all your rental requests and their current status</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : rentalRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ClipboardCheck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Rental Requests</h2>
          <p className="text-gray-600 mb-6">You haven't made any rental requests yet.</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/rentals">Browse Equipment</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalRequests.map((request) => (
            <Card key={request.id} className="border-2 border-primary/20 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                    Ticket #{request.ticketNumber}
                  </CardTitle>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    request.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : request.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">{request.requestType}</p>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      Start Date:
                    </span>
                    <span>{formatDate(request.startDate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Duration:</span>
                    <span>{request.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Contractor ID:</span>
                    <span className="text-primary font-mono font-bold">{request.contractorNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Wait Time:</span>
                    <span>{request.estimatedWaitTime}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="font-semibold mb-1">Request Details:</p>
                  <p className="text-gray-600 line-clamp-2">{request.description}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t flex items-center justify-center text-sm text-primary">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>For assistance: (555) 123-4567</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}