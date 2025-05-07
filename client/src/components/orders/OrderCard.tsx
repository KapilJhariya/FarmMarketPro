import { Order, RentalBooking } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatDateTime, generateTicketNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, FileText, CalendarDays } from "lucide-react";

interface OrderCardProps {
  item: Order | RentalBooking;
  type: "orders" | "rentals";
}

export default function OrderCard({ item, type }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (type === "orders") {
    const order = item as Order;
    return (
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-[#2E7D32] mr-2" />
                <h3 className="font-bold">Order #{order.id}</h3>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {formatDateTime(order.orderDate)}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Total:</span> {formatCurrency(order.total)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Shipping to:</span> {order.shippingAddress.split(',')[0]}...
              </p>
            </div>
            <Button 
              asChild
              variant="outline" 
              className="mt-4 md:mt-0"
            >
              <Link to={`/orders/${order.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    const booking = item as RentalBooking;
    return (
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-[#2E7D32] mr-2" />
                <h3 className="font-bold">Booking #{booking.ticketNumber}</h3>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Booked on {formatDate(booking.bookingDate)}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Equipment ID:</span> #{booking.equipmentId}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Rental Period:</span> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total:</span> {formatCurrency(booking.totalPrice)}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              asChild
            >
              <Link to={`/rentals/${booking.equipmentId}`}>
                View Equipment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}
