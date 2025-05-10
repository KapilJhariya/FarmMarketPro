import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Order, RentalRequest } from "@shared/schema";
import OrderHistoryComponent from "@/components/orders/OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("purchases");
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your order history",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  const { 
    data: orders, 
    isLoading: isOrdersLoading, 
    isError: isOrdersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey: user ? [`/api/orders/user/${user.id}`] : [],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/orders/user/${user.id}`);
      return res.json() as Promise<Order[]>;
    },
    enabled: !!user
  });

  const { 
    data: rentals, 
    isLoading: isRentalsLoading, 
    isError: isRentalsError,
    refetch: refetchRentals
  } = useQuery({
    queryKey: user ? [`/api/rental-requests/user/${user.id}`] : [],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/rental-requests/user/${user.id}`);
      return res.json() as Promise<RentalRequest[]>;
    },
    enabled: !!user
  });
  
  // Refresh data when user changes
  useEffect(() => {
    if (user) {
      refetchOrders();
      refetchRentals();
    }
  }, [user, refetchOrders, refetchRentals]);

  return (
    <>
      <Helmet>
        <title>Order History | AgriConnect</title>
        <meta 
          name="description" 
          content="View your purchase history and equipment rental bookings. Track deliveries and manage your farming operations efficiently." 
        />
        <meta property="og:title" content="Order History | AgriConnect" />
        <meta 
          property="og:description" 
          content="View your purchase history and equipment rental bookings." 
        />
      </Helmet>

      <section className="py-8 md:py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Order History</h1>
            <p className="text-gray-600 max-w-3xl">
              Track your purchase and rental history. View order details, download receipts, and check the status of your transactions.
            </p>
          </div>

          <Tabs defaultValue="purchases" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="purchases">Product Purchases</TabsTrigger>
              <TabsTrigger value="rentals">Equipment Rentals</TabsTrigger>
            </TabsList>
            <TabsContent value="purchases">
              <OrderHistoryComponent 
                type="orders"
                data={orders}
                isLoading={isOrdersLoading}
                isError={isOrdersError}
              />
            </TabsContent>
            <TabsContent value="rentals">
              <OrderHistoryComponent 
                type="rentals"
                data={rentals}
                isLoading={isRentalsLoading}
                isError={isRentalsError}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
