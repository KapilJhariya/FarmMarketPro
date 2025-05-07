import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PdfReceipt from "@/components/receipts/pdf-receipt";

// Mock order data for testing PDF receipt
const mockOrder = {
  id: 1,
  orderNumber: "AG12345-ABC12",
  orderDate: new Date().toISOString(),
  subtotal: 149.97,
  shippingCost: 12.50,
  total: 162.47,
  status: "Processing",
  shippingAddress: "123 Farm Road, Farmington, IL 61234",
  paymentMethod: "Card ending in 4242",
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 49.99,
      subtotal: 99.98
    },
    {
      productId: 2,
      quantity: 1,
      price: 49.99,
      subtotal: 49.99
    }
  ]
};

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Premium Organic Fertilizer",
    price: 49.99,
    unit: "25kg bag",
    imageUrl: "/images/fertilizer.jpg"
  },
  {
    id: 2,
    name: "Farm-Grade Pesticide",
    price: 49.99,
    unit: "5L container",
    imageUrl: "/images/pesticide.jpg"
  }
];

export default function MockReceipt() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-roboto mb-2">Mock Receipt Demo</h1>
          <p className="text-gray-600">
            This is a demonstration of the PDF receipt functionality
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* PDF receipt component with mock data */}
          <PdfReceipt order={mockOrder} products={mockProducts} />
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}