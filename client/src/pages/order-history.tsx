import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Tractor, Clock, PackageCheck, PackageX, Truck, ArrowRight, Trash2, AlertCircle, LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrderHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("orders");
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [deleteRentalId, setDeleteRentalId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // If user is not logged in, show login message
  if (!user) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-12 bg-white rounded-lg shadow">
            <LogIn className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to view your orders and rental history.
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fetch user's orders
  const { data: orders = [], isLoading: isLoadingOrders, refetch: refetchOrders } = useQuery<any[]>({
    queryKey: [`/api/orders/user/${user.id}`],
  });
  
  // Refresh orders when component mounts or user changes
  useEffect(() => {
    if (user) {
      refetchOrders();
    }
  }, [refetchOrders, user]);

  // Fetch user's rental requests
  const { data: rentalRequests = [], isLoading: isLoadingRentals, refetch: refetchRentals } = useQuery<any[]>({
    queryKey: [`/api/rental-requests/user/${user.id}`],
  });
  
  // Refresh rental requests when component mounts or user changes
  useEffect(() => {
    if (user) {
      refetchRentals();
    }
  }, [refetchRentals, user]);

  // Delete an order
  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/orders/${deleteOrderId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      // Reset the delete id
      setDeleteOrderId(null);
      
      // Invalidate and refetch orders
      await queryClient.invalidateQueries({ queryKey: [`/api/orders/user/${user.id}`] });
      
      toast({
        title: "Order Deleted",
        description: "Order has been deleted successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete a rental request
  const handleDeleteRental = async () => {
    if (!deleteRentalId) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/rental-requests/${deleteRentalId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete rental request');
      }
      
      // Reset the delete id
      setDeleteRentalId(null);
      
      // Invalidate and refetch rental requests
      await queryClient.invalidateQueries({ queryKey: [`/api/rental-requests/user/${user.id}`] });
      
      toast({
        title: "Rental Request Deleted",
        description: "Rental request has been deleted successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error deleting rental request:', error);
      toast({
        title: "Error",
        description: "Failed to delete rental request. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
                    orders.map((order: any) => (
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
                              <p className="text-sm text-gray-500">Order Total</p>
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
                          
                          <div className="mt-4 flex justify-between items-center">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                  onClick={() => setDeleteOrderId(order.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this order and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteOrderId(null)} disabled={isDeleting}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteOrder} 
                                    disabled={isDeleting}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
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
                    rentalRequests.map((request: any) => (
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
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Contractor Number:</p>
                                <p className="text-sm text-gray-600 font-mono font-medium">{request.contractorNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Estimated Wait:</p>
                                <p className="text-sm text-gray-600">{request.estimatedWaitTime}</p>
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
                          
                          <div className="mt-4 flex justify-end">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                  onClick={() => setDeleteRentalId(request.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete Request
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this rental request and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteRentalId(null)} disabled={isDeleting}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteRental} 
                                    disabled={isDeleting}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
