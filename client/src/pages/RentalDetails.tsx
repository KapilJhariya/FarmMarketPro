import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Equipment } from "@shared/schema";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Phone, Star, StarHalf, Info, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { generateTicketNumber, formatCurrency, calculateDuration } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const rentalFormSchema = z.object({
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" })
});

type RentalFormValues = z.infer<typeof rentalFormSchema>;

export default function RentalDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make rental requests",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);
  
  const { 
    data: equipment, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: [`/api/equipment/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/equipment/${id}`);
      return res.json() as Promise<Equipment>;
    }
  });

  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalFormSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0], // Today
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      fullName: "John Farmer",
      email: "john@farmer.com",
      phone: "(555) 987-6543"
    }
  });

  const createRentalBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await apiRequest("POST", "/api/rental-bookings", bookingData);
    }
  });

  const onSubmit = async (data: RentalFormValues) => {
    if (!equipment) {
      toast({
        title: "Equipment not found",
        description: "Unable to complete booking. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (equipment.availabilityStatus.toLowerCase().includes('booked')) {
      toast({
        title: "Equipment unavailable",
        description: "This equipment is currently booked. Please select another date or equipment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      if (startDate > endDate) {
        form.setError("endDate", {
          type: "manual",
          message: "End date must be after start date"
        });
        return;
      }

      const duration = calculateDuration(startDate, endDate);
      const totalPrice = equipment.price * duration;
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make rental requests",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      // Create booking
      const bookingData = {
        userId: user.id,
        equipmentId: parseInt(id),
        startDate,
        endDate,
        totalPrice,
        status: "Confirmed",
        bookingDate: new Date(),
        ticketNumber: generateTicketNumber()
      };

      const response = await createRentalBookingMutation.mutateAsync(bookingData);
      const booking = await response.json();

      toast({
        title: "Booking confirmed",
        description: `Your booking for ${equipment.name} has been confirmed.`,
        variant: "default"
      });
      
      // Navigate to order history
      navigate("/order-history");
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast({
        title: "Failed to create booking",
        description: "An error occurred while processing your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  const isBooked = equipment?.availabilityStatus.toLowerCase().includes('booked');
  const isPending = createRentalBookingMutation.isPending;

  return (
    <>
      <Helmet>
        <title>{equipment ? `${equipment.name} Rental` : 'Equipment Rental'} | AgriConnect</title>
        <meta 
          name="description" 
          content="Reserve agricultural equipment for your farm operations. Book tractors, harvesters, sprayers and more with our easy rental system." 
        />
        <meta property="og:title" content={`${equipment ? equipment.name : 'Equipment'} Rental | AgriConnect`} />
        <meta 
          property="og:description" 
          content="Reserve agricultural equipment for your farm operations with our easy rental system." 
        />
      </Helmet>
    
      <section className="py-8 md:py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Button 
              asChild
              variant="outline"
              className="mr-4"
            >
              <Link to="/rentals">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Equipment
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">Equipment Rental</h1>
          </div>

          {isError ? (
            <div className="bg-red-50 p-6 rounded-lg text-red-500">
              <h2 className="text-xl font-medium mb-2">Error</h2>
              <p>Failed to load equipment details. Please try again.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
            </div>
          ) : !equipment ? (
            <div className="bg-yellow-50 p-6 rounded-lg text-yellow-800">
              <h2 className="text-xl font-medium mb-2">Equipment Not Found</h2>
              <p>The equipment you're looking for doesn't exist or has been removed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                  <div className="relative h-64 md:h-96">
                    <img 
                      src={equipment.imageUrl} 
                      alt={equipment.name} 
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                        isBooked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {equipment.availabilityStatus}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{equipment.name}</h2>
                        <div className="flex items-center mt-2">
                          {renderStars(equipment.rating || 0)}
                          <span className="text-gray-600 text-sm ml-1">({equipment.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-[#2E7D32]">
                        {formatCurrency(equipment.price)}/day
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-2">Description</h3>
                      <p className="text-gray-700">{equipment.description}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {(equipment.features || []).map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-2">Location Information</h3>
                      <p className="text-gray-700 mb-3">{equipment.location}</p>
                      <p className="text-gray-700">
                        <span className="font-medium">Distance:</span> {equipment.distanceInMiles} miles from your location
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Info className="text-[#2E7D32] mr-2 h-5 w-5" />
                    <h3 className="font-bold text-lg">Provider Information</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    This equipment is provided by a verified supplier in the AgriConnect network. 
                    For specific questions about this equipment, please contact the provider directly.
                  </p>
                  <div className="flex items-center text-[#2E7D32]">
                    <Phone className="mr-2 h-4 w-4" />
                    <a href={`tel:${equipment.contactPhone}`} className="hover:underline">
                      {equipment.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4">
                  <h3 className="font-bold text-lg mb-4">Reserve Equipment</h3>
                  
                  {isBooked ? (
                    <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 mb-4">
                      <p className="font-medium">Currently unavailable</p>
                      <p className="text-sm">This equipment is booked until {equipment.availabilityDate ? new Date(equipment.availabilityDate).toLocaleDateString() : 'future date'}.</p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type="date"
                                      {...field} 
                                      min={new Date().toISOString().split('T')[0]}
                                    />
                                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type="date"
                                      {...field} 
                                      min={form.watch('startDate')}
                                    />
                                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                          ) : (
                            "Reserve Now"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {isBooked && (
                    <Button 
                      className="w-full mt-4 bg-gray-400 hover:bg-gray-500 text-white"
                    >
                      Join Waitlist
                    </Button>
                  )}

                  <div className="mt-6 text-sm text-gray-500">
                    <p className="mb-2">No payment required upfront. You will pay directly to the provider on the day of rental.</p>
                    <p>Cancelation policy: Free cancelation up to 24 hours before start date.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
