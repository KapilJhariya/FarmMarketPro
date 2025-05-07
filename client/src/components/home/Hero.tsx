import { Link } from "wouter";
import { TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-[#2E7D32] text-white">
      {/* Background with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=500" 
          alt="Farm field landscape" 
          className="w-full h-full object-cover opacity-25"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Farming Solutions
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Monitor crop prices, purchase supplies, and arrange equipment rentals all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="bg-white text-[#2E7D32] hover:bg-gray-100 border-0"
            >
              <Link to="/crops">
                <TrendingUp className="mr-2 h-5 w-5" />
                Track Prices
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              className="bg-[#FFA000] hover:bg-[#F57C00] text-white border-0"
            >
              <Link to="/marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Supplies
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
