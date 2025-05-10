import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/context/CartContext";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CartSummary from "@/components/cart/CartSummary";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { generateOrderNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const checkoutFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter your full address" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zip: z.string().min(5, { message: "Zip code is required" }),
  cardNumber: z.string().min(16, { message: "Please enter a valid card number" }),
  cardExpiry: z.string().min(5, { message: "Please enter a valid expiration date (MM/YY)" }),
  cardCvc: z.string().min(3, { message: "Please enter a valid CVC" })
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart();
  const { toast } = useToast();
  const [processingOrder, setProcessingOrder] = useState(false);
  const { user } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your checkout",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "John Farmer",
      email: "john@farmer.com",
      phone: "(555) 987-6543",
      address: "123 Farm Road",
      city: "Farmington",
      state: "IL",
      zip: "61234",
      cardNumber: "4111111111111111",
      cardExpiry: "12/25",
      cardCvc: "123"
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (order: any) => {
      return await apiRequest("POST", "/api/orders", order);
    }
  });

  const createOrderItemMutation = useMutation({
    mutationFn: async (orderItem: any) => {
      const { orderId, ...rest } = orderItem;
      return await apiRequest("POST", `/api/orders/${orderId}/items`, rest);
    }
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    setProcessingOrder(true);

    try {
      // Format shipping address
      const shippingAddress = `${data.address}, ${data.city}, ${data.state} ${data.zip}`;
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to complete your checkout",
          variant: "destructive",
        });
        setProcessingOrder(false);
        navigate("/auth");
        return;
      }
      
      // Create order
      const orderData = {
        userId: user.id,
        orderDate: new Date(),
        status: "Processing",
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        paymentMethod: `Card ending in ${data.cardNumber.slice(-4)}`
      };

      const orderResponse = await createOrderMutation.mutateAsync(orderData);
      const orderJson = await orderResponse.json();
      const orderId = orderJson.id;

      // Create order items
      for (const item of cartItems) {
        const orderItemData = {
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        };

        await createOrderItemMutation.mutateAsync(orderItemData);
      }

      // Clear cart and redirect to order confirmation
      clearCart();
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
        variant: "default"
      });
      
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        title: "Failed to place order",
        description: "An error occurred while processing your order. Please try again.",
        variant: "destructive"
      });
      setProcessingOrder(false);
    }
  };

  if (cartItems.length === 0 && !processingOrder) {
    return (
      <>
        <Helmet>
          <title>Checkout | AgriConnect</title>
          <meta 
            name="description" 
            content="Complete your purchase of farming supplies at AgriConnect. Secure checkout process with various payment options." 
          />
        </Helmet>
        
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">
                You don't have any items in your cart. Browse our products to add items to your cart.
              </p>
              <Button 
                asChild
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              >
                <a href="/marketplace">Browse Products</a>
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | AgriConnect</title>
        <meta 
          name="description" 
          content="Complete your purchase of farming supplies at AgriConnect. Secure checkout process with various payment options." 
        />
        <meta property="og:title" content="Checkout | AgriConnect" />
        <meta 
          property="og:description" 
          content="Complete your purchase of farming supplies at AgriConnect." 
        />
      </Helmet>
    
      <section className="py-8 md:py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Checkout</h1>
            <p className="text-gray-600">
              Complete your order by filling out the information below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
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
                                <Input type="email" placeholder="john@example.com" {...field} />
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
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="1111 2222 3333 4444" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiration (MM/YY)</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardCvc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-lg py-6"
                      disabled={processingOrder}
                    >
                      {processingOrder ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        `Complete Order • ${new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(total)}`
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            <div>
              <CartSummary />
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your order, please contact our support team.
                </p>
                <div className="text-sm">
                  <div className="flex items-center mb-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2 text-[#2E7D32]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                      />
                    </svg>
                    <span>(800) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2 text-[#2E7D32]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                    <span>support@agriconnect.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
