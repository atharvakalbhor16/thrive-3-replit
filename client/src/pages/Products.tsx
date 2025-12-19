import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get("category") || undefined;
  
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [category, setCategory] = useState<string | undefined>(categoryParam);
  
  // Update state when URL params change
  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  const { data: products, isLoading } = useProducts({ 
    category,
    sort 
  });

  const categories = ["T-Shirts", "Hoodies", "Pants", "Accessories", "Footwear"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white mb-2">
              {category || "All Products"}
            </h1>
            <p className="text-neutral-400">
              {products?.length || 0} items
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Filters Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden border-neutral-800 text-white">
                  <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l border-white/10 w-[300px]">
                <div className="mt-8 space-y-8">
                  <div>
                    <h3 className="font-display font-bold uppercase text-lg mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setCategory(undefined)}
                        className={`block text-sm uppercase tracking-wide ${!category ? 'text-white font-bold' : 'text-neutral-400'}`}
                      >
                        All
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`block text-sm uppercase tracking-wide ${category === cat ? 'text-white font-bold' : 'text-neutral-400'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Select */}
            <Select value={sort} onValueChange={(val: any) => setSort(val)}>
              <SelectTrigger className="w-[180px] bg-transparent border-neutral-800 text-white rounded-none">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0 sticky top-24 h-fit">
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold uppercase text-sm mb-4 text-white">Categories</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setCategory(undefined)}
                    className={`block text-sm uppercase tracking-wide hover:text-white transition-colors ${!category ? 'text-white font-bold' : 'text-neutral-400'}`}
                  >
                    View All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`block text-sm uppercase tracking-wide hover:text-white transition-colors ${category === cat ? 'text-white font-bold' : 'text-neutral-400'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10">
                <h3 className="font-display font-bold uppercase text-sm mb-4 text-white">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} className="border border-neutral-800 hover:border-white text-neutral-400 hover:text-white py-2 text-xs font-bold uppercase transition-colors">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-neutral-900 aspect-[3/4] w-full" />
                    <div className="mt-4 h-4 bg-neutral-900 w-3/4" />
                    <div className="mt-2 h-4 bg-neutral-900 w-1/4" />
                  </div>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h3 className="text-2xl font-display font-bold uppercase text-white mb-2">No products found</h3>
                <p className="text-neutral-400 mb-6">Try adjusting your filters.</p>
                <Button 
                  onClick={() => { setCategory(undefined); setSort("newest"); }}
                  variant="outline"
                  className="rounded-none text-white border-white hover:bg-white hover:text-black"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
