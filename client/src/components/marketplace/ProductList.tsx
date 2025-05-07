import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductCategory } from "@shared/schema";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function ProductList() {
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
    <section id="marketplace" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#333333]">Farm Supply Marketplace</h2>
            <p className="text-gray-600">Purchase high-quality farming supplies</p>
          </div>
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
              All
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/marketplace" className="text-[#2E7D32] font-medium inline-flex items-center hover:underline">
            Browse all products 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
