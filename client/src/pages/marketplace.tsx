import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/context/cart-context";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/marketplace/product-card";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { isCartOpen, openCart } = useCart();

  const categories = [
    "All Products",
    "Seeds",
    "Fertilizers",
    "Pesticides",
    "Tools",
    "Equipment"
  ];

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (products) {
      let filtered = [...products];
      
      // Filter by category if not "All Products"
      if (selectedCategory !== "All Products") {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-roboto mb-2">Farming Supplies Marketplace</h1>
          <p className="text-gray-600">Quality products for your agricultural needs</p>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-primary text-white" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 pl-10 pr-4 border rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            // Loading skeletons
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                unit={product.unit}
                tags={product.tags}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or category filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("All Products");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View More Products
            </Button>
          </div>
        )}
        
        {filteredProducts.length > 0 && !isCartOpen && (
          <div className="fixed bottom-6 right-6 md:hidden">
            <Button 
              className="rounded-full h-14 w-14 bg-primary shadow-lg flex items-center justify-center"
              onClick={openCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
