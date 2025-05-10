import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  cropId: z.string().min(1, { message: "Please select a crop" }),
  alertType: z.enum(["above", "below"], {
    required_error: "Please select alert type",
  }),
  priceThreshold: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Please enter a valid price" }
  ),
});

const PriceAlertForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: crops, isLoading: isLoadingCrops } = useQuery({
    queryKey: ["/api/crops"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropId: "",
      alertType: "above",
      priceThreshold: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to set price alerts",
          variant: "destructive",
        });
        setIsSubmitting(false);
        navigate("/auth");
        return;
      }
      
      await fetch("/api/price-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cropId: parseInt(values.cropId),
          alertType: values.alertType,
          priceThreshold: parseFloat(values.priceThreshold),
        }),
      });
      
      toast({
        title: "Price Alert Set",
        description: "You will be notified when the price condition is met.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set price alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cropId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCrops ? (
                    <SelectItem value="loading" disabled>
                      Loading crops...
                    </SelectItem>
                  ) : (
                    crops?.map((crop) => (
                      <SelectItem key={crop.id} value={crop.id.toString()}>
                        {crop.name} ({crop.variety})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alertType"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Alert Type</FormLabel>
              <div className="flex space-x-4">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="above" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Price Above</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="below" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Price Below</FormLabel>
                  </FormItem>
                </RadioGroup>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Threshold (USD)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Alert
            </>
          ) : (
            "Set Alert"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PriceAlertForm;
