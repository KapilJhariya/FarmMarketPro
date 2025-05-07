import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingBasket, Tractor } from "lucide-react";
import FeatureCard from "@/components/home/feature-card";
import HeroSection from "@/components/home/hero-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// Market Insights Component
const MarketInsights = () => {
  return (
    <Card className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-bold text-lg mb-4">Market Insights</h3>
      <ul className="space-y-4">
        <li className="flex items-start">
          <span className="text-primary mr-2 mt-1">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Weather Impact</p>
            <p className="text-sm text-gray-600">Recent rainfall in the Midwest is expected to boost corn yields, potentially lowering prices in the coming weeks.</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-warning mr-2 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </span>
          <div>
            <p className="font-medium">Supply Chain Alert</p>
            <p className="text-sm text-gray-600">Transportation disruptions may affect wheat deliveries to eastern markets. Plan accordingly.</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-success mr-2 mt-1">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Rice Export Opportunity</p>
            <p className="text-sm text-gray-600">International demand for long grain rice increasing due to shortages in Asian markets.</p>
          </div>
        </li>
      </ul>
    </Card>
  );
};

// Featured Products Component
const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-9 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {products && products.slice(0, 4).map((product) => (
        <Card key={product.id} className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
          <div className="h-48 overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.unit}</p>
              </div>
              {product.tags && product.tags.length > 0 && (
                <Badge 
                  className={`
                    ${product.tags[0] === "Organic" || product.tags[0] === "Eco-Friendly" || product.tags[0] === "Non-GMO" 
                      ? "bg-green-100 text-success" 
                      : "bg-blue-100 text-blue-800"}
                    text-xs py-1 px-2 rounded-full
                  `}
                >
                  {product.tags[0]}
                </Badge>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      quote: "AgriManage has completely transformed how I run my farm. The price tracker alone has helped me increase profits by 15% this season.",
      name: "John Smith",
      role: "Wheat Farmer, Kansas"
    },
    {
      quote: "The equipment rental platform saved me thousands compared to buying new machinery. Extremely convenient and reliable service.",
      name: "Maria Rodriguez",
      role: "Organic Farm, California"
    },
    {
      quote: "Being able to compare supply prices and get everything delivered directly to my farm has been a game-changer. Highly recommend!",
      name: "David Johnson",
      role: "Corn Grower, Iowa"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold font-roboto mb-2">What Farmers Say</h2>
          <p className="text-gray-600">Trusted by thousands of farmers across the country</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-600">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16">
          <FeatureCard 
            icon={<TrendingUp />} 
            title="Crop Price Tracker" 
            description="Monitor real-time market prices and trends for your crops." 
            link="/prices" 
            linkText="View Prices" 
          />
          <FeatureCard 
            icon={<ShoppingBasket />} 
            title="Farming Supplies" 
            description="Purchase high-quality seeds, fertilizers, tools, and more." 
            link="/marketplace" 
            linkText="Shop Now" 
          />
          <FeatureCard 
            icon={<Tractor />} 
            title="Equipment Rental" 
            description="Rent machinery and labor for your farming operations." 
            link="/rentals" 
            linkText="Rent Equipment" 
          />
        </div>
      </div>
      
      {/* Market Updates Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-roboto mb-2">Latest Market Updates</h2>
            <p className="text-gray-600">Stay informed with current agricultural market trends</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MarketInsights />
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Top Farming Products</h3>
              <FeaturedProducts />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <Testimonials />
    </>
  );
};

export default HomePage;
