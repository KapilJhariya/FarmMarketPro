import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import RentalCard from "@/components/rentals/rental-card";
import WorkerCard from "@/components/rentals/worker-card";
import RentalRequestForm from "@/components/rentals/rental-request-form";

const Rentals = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<number | undefined>(undefined);
  const [selectedLabor, setSelectedLabor] = useState<number | undefined>(undefined);

  const { data: equipment, isLoading: isLoadingEquipment } = useQuery({
    queryKey: ["/api/equipment"],
  });

  const { data: labor, isLoading: isLoadingLabor } = useQuery({
    queryKey: ["/api/labor"],
  });

  const handleEquipmentReserve = (equipmentId: number) => {
    setSelectedEquipment(equipmentId);
    // Scroll to form
    const formElement = document.getElementById('request-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaborRequest = (laborId: number) => {
    setSelectedLabor(laborId);
    // Scroll to form
    const formElement = document.getElementById('request-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-roboto mb-2">Equipment & Labor Rentals</h1>
          <p className="text-gray-600">Rent machinery and hire skilled labor for your farm operations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Equipment Rentals */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Machinery Rentals</h3>
            <div className="space-y-4">
              {isLoadingEquipment ? (
                Array(2).fill(0).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <Skeleton className="w-full md:w-40 h-40" />
                      <CardContent className="p-4 flex-grow">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-60 mb-2" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-48 mb-3" />
                        <Skeleton className="h-9 w-28 rounded-lg" />
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : equipment?.length > 0 ? (
                equipment.map((item) => (
                  <RentalCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    model={item.model}
                    imageUrl={item.imageUrl}
                    availableUnits={item.availableUnits}
                    dailyRate={item.dailyRate}
                    weeklyRate={item.weeklyRate}
                    onReserve={handleEquipmentReserve}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">No equipment currently available</p>
              )}
            </div>
          </div>
          
          {/* Labor Hire */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Skilled Labor</h3>
            <div className="space-y-4">
              {isLoadingLabor ? (
                Array(2).fill(0).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <Skeleton className="w-full md:w-40 h-40" />
                      <CardContent className="p-4 flex-grow">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-60 mb-2" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-48 mb-3" />
                        <Skeleton className="h-9 w-28 rounded-lg" />
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : labor?.length > 0 ? (
                labor.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    id={worker.id}
                    title={worker.title}
                    description={worker.description}
                    imageUrl={worker.imageUrl}
                    hourlyRate={worker.hourlyRate}
                    availability={worker.availability}
                    skills={worker.skills}
                    onRequest={handleLaborRequest}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-6">No workers currently available</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Rental Request Form */}
        <div id="request-form" className="mt-12 bg-white rounded-xl shadow-md p-6">
          <Tabs defaultValue="form">
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="form">Request Form</TabsTrigger>
              <TabsTrigger value="info">How It Works</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              <div>
                <h3 className="text-xl font-bold mb-4">Request Custom Equipment or Labor</h3>
                {(selectedEquipment || selectedLabor) && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                    <p className="font-medium text-green-800">
                      {selectedEquipment && selectedLabor 
                        ? 'Equipment and labor selected!' 
                        : selectedEquipment 
                          ? 'Equipment selected!' 
                          : 'Labor selected!'}
                    </p>
                    <p className="text-green-700">
                      {selectedEquipment && `Equipment ID: ${selectedEquipment}`}
                      {selectedEquipment && selectedLabor && ', '}
                      {selectedLabor && `Labor ID: ${selectedLabor}`}
                    </p>
                  </div>
                )}
                <RentalRequestForm
                  selectedEquipment={selectedEquipment}
                  selectedLabor={selectedLabor}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">How Our Rental System Works</h3>
                <ol className="list-decimal ml-5 mt-2 space-y-2 text-gray-700">
                  <li>Browse our available equipment and labor options above</li>
                  <li>Select the items you're interested in by clicking the "Reserve" button</li>
                  <li>Fill out the request form with your specific needs and timing</li>
                  <li>Submit your request to generate a ticket in our system</li>
                  <li>Our team will contact you within 24 hours to confirm availability and finalize details</li>
                  <li>Once confirmed, you'll receive a rental agreement and payment instructions</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-bold text-lg">Rental Policies</h3>
                <ul className="list-disc ml-5 mt-2 space-y-2 text-gray-700">
                  <li>All equipment requires a security deposit (refunded upon return)</li>
                  <li>Cancellations must be made at least 48 hours in advance</li>
                  <li>Equipment is inspected before and after rental</li>
                  <li>Renter is responsible for transportation unless delivery is arranged</li>
                  <li>All operators must have proper certification and training</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Rentals;
