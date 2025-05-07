import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { OrderWithItems } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import Receipt from "@/components/orders/Receipt";
import { formatDateTime } from "@/lib/utils";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: order, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: [`/api/orders/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      return res.json() as Promise<OrderWithItems>;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Order Details | AgriConnect</title>
        <meta 
          name="description" 
          content="View your order details and receipt. Track your purchase status and download receipts for your records." 
        />
        <meta property="og:title" content="Order Details | AgriConnect" />
        <meta 
          property="og:description" 
          content="View your order details and receipt." 
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
              <Link to="/order-history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">Order Details</h1>
          </div>

          {isError ? (
            <div className="bg-red-50 p-6 rounded-lg text-red-500">
              <h2 className="text-xl font-medium mb-2">Error</h2>
              <p>Failed to load order details. Please try again.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
            </div>
          ) : !order ? (
            <div className="bg-yellow-50 p-6 rounded-lg text-yellow-800">
              <h2 className="text-xl font-medium mb-2">Order Not Found</h2>
              <p>The order you're looking for doesn't exist or has been removed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Order #{order.id}</h2>
                      <p className="text-gray-500">Placed on {formatDateTime(order.orderDate)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center border-b border-gray-100 pb-4">
                          <div className="w-16 h-16 min-w-[4rem] bg-gray-100 rounded overflow-hidden mr-4">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.product.unit} × {item.quantity}
                            </p>
                          </div>
                          <div className="font-medium whitespace-nowrap">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold mb-4">Shipping Information</h3>
                  <div className="mb-6">
                    <p className="font-medium">Shipping Address:</p>
                    <p className="text-gray-700">{order.shippingAddress}</p>
                  </div>
                  
                  <h3 className="font-bold mb-4">Payment Information</h3>
                  <div>
                    <p className="font-medium">Payment Method:</p>
                    <p className="text-gray-700">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="font-bold mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold mb-4">Actions</h3>
                  <Button 
                    variant="outline" 
                    className="w-full mb-3 border-[#2E7D32] text-[#2E7D32] hover:bg-[#F5F5F5]"
                    onClick={() => window.print()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Need help with your order? Contact our support team at{" "}
                    <a href="mailto:support@agriconnect.com" className="text-[#2E7D32]">
                      support@agriconnect.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hidden receipt for printing */}
      {order && (
        <div className="hidden print:block">
          <Receipt order={order} />
        </div>
      )}
    </>
  );
}
