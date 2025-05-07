import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductCategory } from "@shared/schema";
import ProductCard from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/product-categories'],
    queryFn: async () => {
      const res = await fetch('/api/product-categories');
      return res.json() as Promise<ProductCategory[]>;
    }
  });
  
  const {
    data: products,
    isLoading: isProductsLoading,
    isError
  } = useQuery({
    queryKey: [activeCategory ? `/api/products/category/${activeCategory}` : '/api/products'],
    queryFn: async () => {
      const url = activeCategory 
        ? `/api/products/category/${activeCategory}` 
        : '/api/products';
      const res = await fetch(url);
      return res.json() as Promise<Product[]>;
    }
  });

  const isLoading = isCategoriesLoading || isProductsLoading;

  return (
    <>
      <Helmet>
        <title>Farm Supply Marketplace | AgriConnect</title>
        <meta 
          name="description" 
          content="Shop for high-quality farming supplies including fertilizers, pesticides, seeds, and tools at competitive prices." 
        />
        <meta property="og:title" content="Farm Supply Marketplace | AgriConnect" />
        <meta 
          property="og:description" 
          content="Shop for high-quality farming supplies including fertilizers, pesticides, seeds, and tools." 
        />
      </Helmet>
    
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Farm Supply Marketplace</h1>
            <p className="text-gray-600 max-w-3xl">
              Browse our extensive collection of high-quality farming supplies from trusted suppliers. 
              We offer competitive prices on fertilizers, pesticides, seeds, tools, and more to help you 
              maximize your farm's productivity.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center mb-8">
            <div className="text-lg font-medium text-[#333333]">Filter by category:</div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeCategory === null ? "default" : "outline"}
                className={activeCategory === null 
                  ? "bg-[#2E7D32] hover:bg-[#1B5E20] text-white" 
                  : "text-[#333333] hover:text-[#2E7D32]"
                }
                onClick={() => setActiveCategory(null)}
                disabled={isLoading}
              >
                All Products
              </Button>
              {categories?.map((category) => (
                <Button 
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id 
                    ? "bg-[#2E7D32] hover:bg-[#1B5E20] text-white" 
                    : "text-[#333333] hover:text-[#2E7D32]"
                  }
                  onClick={() => setActiveCategory(category.id)}
                  disabled={isLoading}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {isError ? (
            <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
              Failed to load products. Please try again.
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm h-[350px] animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-12 bg-[#F5F5F5] rounded-lg">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">
                {activeCategory 
                  ? "There are no products in this category yet. Please check back later or select another category."
                  : "There are no products available at the moment. Please check back later."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
