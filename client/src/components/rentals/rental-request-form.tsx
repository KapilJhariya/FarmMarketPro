import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

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

const RentalRequestForm = ({ selectedEquipment, selectedLabor }: RentalRequestFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // For demonstration, using a static user ID
      const userId = 1;
      
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
        }),
      });
      
      if (!response.ok) throw new Error("Failed to submit request");
      
      const result = await response.json();
      
      toast({
        title: "Request Submitted",
        description: `Your rental request ticket #${result.ticketNumber} has been created.`,
      });
      
      // Navigate to home page or confirmation page
      navigate("/");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default RentalRequestForm;
