import { Order, RentalBooking } from "@shared/schema";
import OrderCard from "./OrderCard";
import { Loader2 } from "lucide-react";

interface OrderHistoryProps {
  type: "orders" | "rentals";
  data: Order[] | RentalBooking[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function OrderHistory({ type, data, isLoading, isError }: OrderHistoryProps) {
  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
        Failed to load {type === "orders" ? "order" : "rental"} history. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No {type} found</h3>
        <p className="text-gray-500">
          {type === "orders" 
            ? "You haven't made any purchases yet. Visit our marketplace to find products for your farm."
            : "You haven't booked any equipment yet. Check out our equipment rentals section to find machinery for your farm."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((item) => (
        <OrderCard key={item.id} item={item} type={type} />
      ))}
    </div>
  );
}
