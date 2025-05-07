import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  products?: any[]; // Optional product details for display
}

interface ReceiptTemplateProps {
  order: OrderData;
  products: any[];
}

const ReceiptTemplate = ({ order, products }: ReceiptTemplateProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = receiptRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Order Receipt #${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              h2, h3 { margin-top: 0; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { font-weight: bold; border-bottom: 2px solid #ddd; }
              .header { text-align: center; margin-bottom: 20px; }
              .footer { text-align: center; margin-top: 30px; font-size: 0.9em; }
              .total-row { font-weight: bold; }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  // Format the order date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get product details using productId
  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.unit})` : `Product #${productId}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Receipt</h2>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-1" />
            Print Receipt
          </Button>
        </div>

        <div ref={receiptRef} className="print-content">
          <div className="header text-center mb-6">
            <h2 className="text-2xl font-bold">AgriManage</h2>
            <p>Agricultural Management Platform</p>
            <p className="text-sm">Order #{order.orderNumber}</p>
            <p className="text-sm">{formatDate(order.orderDate)}</p>
          </div>
          
          <div className="border-t border-b py-4 my-4">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2">{getProductName(item.productId)}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(item.price)}</td>
                    <td className="text-right py-2">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <h3 className="font-bold mb-2">Shipping Information</h3>
            <p>John Farmer</p>
            <p>{order.shippingAddress}</p>
            <p>Phone: (555) 123-4567</p>
          </div>
          
          <div className="text-center text-sm footer">
            <p>Thank you for your purchase!</p>
            <p>Questions? Contact us at support@agrimanage.com</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptTemplate;
