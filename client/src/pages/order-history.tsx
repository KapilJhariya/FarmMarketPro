import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Tractor, Clock, PackageCheck, PackageX, Truck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Default user ID for demo purposes
const DEFAULT_USER_ID = 1;

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("orders");

  // Fetch user's orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: [`/api/orders/user/${DEFAULT_USER_ID}`],
  });

  // Fetch user's rental requests
  const { data: rentalRequests, isLoading: isLoadingRentals } = useQuery({
    queryKey: [`/api/rental-requests/user/${DEFAULT_USER_ID}`],
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'processing':
        return <Package className="h-5 w-5 text-primary" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <PackageCheck className="h-5 w-5 text-success" />;
      case 'cancelled':
        return <PackageX className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    let color = '';
    switch (status.toLowerCase()) {
      case 'pending':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'processing':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'shipped':
        color = 'bg-purple-100 text-purple-800';
        break;
      case 'delivered':
        color = 'bg-green-100 text-green-800';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <Badge className={`${color} font-normal`}>
        {status}
      </Badge>
    );
  };

  const isLoading = isLoadingOrders || isLoadingRentals;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-roboto mb-2">Your Account</h1>
          <p className="text-gray-600">View your order history and rental requests</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Account Dashboard</CardTitle>
                  <CardDescription>Manage your orders and rental requests</CardDescription>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> Orders
                  </TabsTrigger>
                  <TabsTrigger value="rentals" className="flex items-center gap-2">
                    <Tractor className="h-4 w-4" /> Rental Requests
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
                  
                  {isLoadingOrders ? (
                    // Order loading skeletons
                    Array(3).fill(0).map((_, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                            <div>
                              <Skeleton className="h-5 w-40 mb-2" />
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="text-right">
                              <Skeleton className="h-5 w-24 ml-auto mb-2" />
                              <Skeleton className="h-4 w-16 ml-auto" />
                            </div>
                          </div>
                          <Skeleton className="h-px w-full my-4" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <Card key={order.id} className="mb-4">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-lg">Order #{order.orderNumber}</h4>
                              <p className="text-sm text-gray-500">Placed on {formatDate(order.orderDate)}</p>
                              <div className="mt-2 flex items-center">
                                {getStatusIcon(order.status)}
                                <span className="ml-2">{getStatusBadge(order.status)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(order.total)}</p>
                              <p className="text-sm text-gray-500">{order.items.length} items</p>
                            </div>
                          </div>
                          
                          <div className="border-t my-4 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-medium mb-1">Shipping Address</h5>
                                <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                              </div>
                              <div>
                                <h5 className="font-medium mb-1">Payment Method</h5>
                                <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Link href={`/order-confirmation/${order.id}`}>
                              <Button variant="link" className="text-primary">
                                View Details <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                      <Link href="/marketplace">
                        <Button className="bg-primary hover:bg-primary/90">Start Shopping</Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rentals" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Your Rental Requests</h3>
                  
                  {isLoadingRentals ? (
                    // Rental loading skeletons
                    Array(2).fill(0).map((_, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                            <div>
                              <Skeleton className="h-5 w-40 mb-2" />
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="text-right">
                              <Skeleton className="h-6 w-24 ml-auto mb-2" />
                            </div>
                          </div>
                          <Skeleton className="h-px w-full my-4" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))
                  ) : rentalRequests && rentalRequests.length > 0 ? (
                    rentalRequests.map((request) => (
                      <Card key={request.id} className="mb-4">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-lg">Ticket #{request.ticketNumber}</h4>
                              <p className="text-sm text-gray-500">Requested on {formatDate(request.createdAt)}</p>
                              <div className="mt-2">
                                <Badge className={
                                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {request.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-primary">
                                {request.requestType}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="border-t my-4 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Start Date:</p>
                                <p className="text-sm text-gray-600">{formatDate(request.startDate)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Duration:</p>
                                <p className="text-sm text-gray-600">{request.duration}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Description:</p>
                              <p className="text-sm text-gray-600">{request.description}</p>
                            </div>
                          </div>
                          
                          {request.status === 'Pending' && (
                            <div className="mt-4 text-sm text-gray-500 italic">
                              Our team will contact you shortly to discuss your request.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Tractor className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Rental Requests</h3>
                      <p className="text-gray-500 mb-4">You haven't made any equipment or labor rental requests yet.</p>
                      <Link href="/rentals">
                        <Button className="bg-primary hover:bg-primary/90">Browse Rentals</Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
