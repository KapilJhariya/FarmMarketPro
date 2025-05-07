import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Printer, Download } from "lucide-react";
import { downloadOrderReceipt } from "@/lib/pdf-generator";

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
}

interface PdfReceiptProps {
  order: OrderData;
  products: any[];
}

const PdfReceipt = ({ order, products }: PdfReceiptProps) => {
  // Function to handle downloading the PDF
  const handleDownloadPdf = () => {
    downloadOrderReceipt(order, products);
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

  // Function to handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2 no-print">
          <h2 className="text-2xl font-bold">Order Receipt</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              onClick={handleDownloadPdf}
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        <div className="print-content">
          <div className="header text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">AgriManage</h2>
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
                  <tr key={index} className="border-b border-gray-100">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 mb-6">
            <div>
              <h3 className="font-bold mb-2">Shipping Information</h3>
              <p>John Farmer</p>
              <p>{order.shippingAddress}</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Payment Method</h3>
              <p>{order.paymentMethod}</p>
            </div>
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

export default PdfReceipt;