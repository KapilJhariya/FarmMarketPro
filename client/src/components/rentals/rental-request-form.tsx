import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, ClipboardCheck, Phone, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
  requestType: z.enum(["Equipment Rental", "Labor Hire", "Both"], {
    required_error: "Please select a request type",
  }),
  startDate: z.string().min(1, { message: "Please select a start date" }),
  duration: z.string().min(1, { message: "Please select a duration" }),
  farmSize: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Please enter a valid farm size" }
  ),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

interface RentalRequestFormProps {
  selectedEquipment?: number;
  selectedLabor?: number;
}

interface TicketData {
  ticketNumber: string;
  contractorNumber: string;
  waitingTime: string;
  requestType: string;
  startDate: string;
  duration: string;
  description: string;
}

const RentalRequestForm = ({ selectedEquipment, selectedLabor }: RentalRequestFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Set default request type based on selections
  let defaultRequestType = "Both";
  if (selectedEquipment && !selectedLabor) defaultRequestType = "Equipment Rental";
  if (!selectedEquipment && selectedLabor) defaultRequestType = "Labor Hire";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: defaultRequestType as "Equipment Rental" | "Labor Hire" | "Both",
      startDate: "",
      duration: "",
      farmSize: "",
      description: selectedEquipment || selectedLabor 
        ? `Request for ${selectedEquipment ? 'equipment #' + selectedEquipment : ''}${selectedEquipment && selectedLabor ? ' and ' : ''}${selectedLabor ? 'labor #' + selectedLabor : ''}`
        : "",
    },
  });

  // Function to generate the contractor number based on request type
  const generateContractorNumber = (requestType: string) => {
    let prefix = "";
    switch(requestType) {
      case "Equipment Rental":
        prefix = "EQ";
        break;
      case "Labor Hire":
        prefix = "LB";
        break;
      case "Both":
        prefix = "EL";
        break;
      default:
        prefix = "AG";
    }
    // Generate a random contractor number
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomPart}`;
  };

  // Function to calculate estimated waiting time based on request type and duration
  const calculateWaitingTime = (requestType: string, duration: string) => {
    // Simplified calculation for demonstration purposes
    const baseWait = {
      "Equipment Rental": "2-3 days",
      "Labor Hire": "3-5 days",
      "Both": "5-7 days"
    }[requestType] || "3-5 days";
    
    // Adjust based on duration if needed
    if (duration === "1 month" || duration === "2 weeks") {
      return "7-10 days"; // Longer durations need more lead time
    }
    
    return baseWait;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Use the authenticated user's ID
      const userId = user.id;
      
      // Generate a ticket number
      const ticketNumber = `AGR-${Date.now().toString().slice(-6)}`;
      // Generate contractor number
      const contractorNumber = generateContractorNumber(values.requestType);
      // Calculate waiting time
      const waitingTime = calculateWaitingTime(values.requestType, values.duration);
      
      // Format start date for display
      const formattedStartDate = new Date(values.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Prepare ticket data
      const newTicketData: TicketData = {
        ticketNumber,
        contractorNumber,
        waitingTime,
        requestType: values.requestType,
        startDate: formattedStartDate,
        duration: values.duration,
        description: values.description
      };
      
      // Set ticket data to state
      setTicketData(newTicketData);
      
      // Show the ticket dialog
      setShowTicketDialog(true);
      
      // Create actual request in the database
      const response = await fetch("/api/rental-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          requestType: values.requestType,
          startDate: new Date(values.startDate).toISOString(),
          duration: values.duration,
          farmSize: parseInt(values.farmSize),
          description: values.description,
          ticketNumber,
          contractorNumber,
          estimatedWaitTime: waitingTime
        }),
      });
      
      if (!response.ok) throw new Error("Failed to submit request");
      
      toast({
        title: "Request Submitted Successfully",
        description: `Your rental request has been processed. Ticket #${ticketNumber} created.`,
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
      setShowTicketDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view history navigation
  const viewRentalHistory = () => {
    setShowTicketDialog(false);
    navigate("/rentals/history");
  };

  return (
    <>
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Sign In Required</DialogTitle>
            <DialogDescription className="text-center">
              You need to be signed in to submit a rental request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          
          <p className="text-center mb-6">
            Please sign in to continue with your request. Your form data will be preserved.
          </p>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAuthDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary text-center text-xl">Rental Request Submitted</DialogTitle>
            <DialogDescription className="text-center">
              Your request has been successfully submitted. Here is your ticket information.
            </DialogDescription>
          </DialogHeader>
          
          {ticketData && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                  Ticket #{ticketData.ticketNumber}
                </CardTitle>
                <CardDescription className="text-center font-medium">
                  {ticketData.requestType}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Contractor Number:</span>
                    <span className="text-primary font-mono font-bold">{ticketData.contractorNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Estimated Wait Time:</span>
                    <span>{ticketData.waitingTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Start Date:</span>
                    <span>{ticketData.startDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Duration:</span>
                    <span>{ticketData.duration}</span>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="font-semibold">Request Details:</span>
                  <p className="mt-1 text-gray-600">{ticketData.description}</p>
                </div>
              </CardContent>
              
              <CardFooter className="bg-primary/10 flex flex-col space-y-3 px-4 py-4">
                <div className="flex items-center justify-center w-full text-sm">
                  <Phone className="h-4 w-4 mr-1 text-primary" />
                  <span>For assistance, call (555) 123-4567</span>
                </div>
                <p className="text-sm text-center text-gray-600">
                  A contractor will contact you within 24 hours to confirm your request.
                </p>
              </CardFooter>
            </Card>
          )}
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowTicketDialog(false);
                navigate("/"); // Go back to home
              }}
            >
              Done
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={viewRentalHistory}
            >
              View Rental History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="requestType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Equipment Rental">Equipment Rental</SelectItem>
                    <SelectItem value="Labor Hire">Labor Hire</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1 day">1 day</SelectItem>
                    <SelectItem value="2-3 days">2-3 days</SelectItem>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="farmSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farm Size (acres)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="Enter farm size" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description of Needs</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Describe what equipment or labor you need..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please provide details about your specific requirements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RentalRequestForm;
