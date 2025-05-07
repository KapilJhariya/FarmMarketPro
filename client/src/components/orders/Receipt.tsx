import { OrderWithItems } from "@shared/schema";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface ReceiptProps {
  order: OrderWithItems;
}

export default function Receipt({ order }: ReceiptProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-[#2E7D32] h-10 w-10"
          >
            <path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.95 7.92 7 8.8V22l4-2 .5 2 .5-2 4 2v-2.2c4.05-.88 7-4.63 7-8.8a9 9 0 0 0-9-9Z"/>
            <path d="M8 12h8"/>
            <path d="M10 9v6"/>
            <path d="M14 9v6"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold">AgriConnect</h1>
        <p className="text-gray-600">Receipt for Order #{order.id}</p>
      </div>

      <div className="mb-8 flex justify-between flex-wrap">
        <div>
          <h2 className="font-bold text-lg mb-2">Bill To:</h2>
          <p>
            <strong>User ID:</strong> {order.userId}
          </p>
          <p><strong>Address:</strong> {order.shippingAddress}</p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-2">Order Information:</h2>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {formatDateTime(order.orderDate)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-4">Items:</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 text-left">{item.product.name}</td>
                <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Shipping:</span>
            <span>{formatCurrency(order.shipping)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax:</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold border-t border-gray-300">
            <span>Total:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-12">
        <p>Thank you for your business!</p>
        <p>For questions about this order, please contact support@agriconnect.com or call (800) 123-4567</p>
        <p className="mt-4">
          AgriConnect, Inc. • 123 Farming Road • Agriville, CA 95864
        </p>
      </div>
    </div>
  );
}
