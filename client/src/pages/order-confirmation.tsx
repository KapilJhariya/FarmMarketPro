import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PdfReceipt from "@/components/receipts/pdf-receipt";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const orderIdNum = parseInt(orderId);

  // Fetch order details
  const { data: order, isLoading: isLoadingOrder, error } = useQuery({
    queryKey: [`/api/orders/${orderIdNum}`],
    enabled: !isNaN(orderIdNum),
  });

  // Fetch product details to display product names
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/products"],
  });

  const isLoading = isLoadingOrder || isLoadingProducts;

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isNaN(orderIdNum) || error) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-md">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the order you're looking for. It may have been removed or the link is invalid.
            </p>
            <Link href="/marketplace">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-gray-600">Loading your order details...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-green-100 text-success mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h1 className="text-3xl font-bold font-roboto mb-2">Order Confirmation</h1>
              <p className="text-gray-600">
                Thank you for your order! Your order #{order.orderNumber} has been received.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {/* Enhanced receipt component with PDF download functionality */}
              <PdfReceipt order={order} products={products} />
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>
                <Link href="/order-history">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    View Order History
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
