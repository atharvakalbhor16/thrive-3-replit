import { Navbar } from "@/components/Navbar";
import { useWishlist, useToggleWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Wishlist() {
  const { data: wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-4xl font-display font-bold uppercase text-white mb-2">My Wishlist</h1>
        <p className="text-neutral-400 mb-12">
          {wishlist?.length || 0} items saved for later
        </p>

        {!wishlist || wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-lg">
            <h3 className="text-2xl font-bold uppercase text-white mb-2">Your wishlist is empty</h3>
            <p className="text-neutral-400 mb-6">Save items you love to track them easily.</p>
            <Link href="/products">
              <Button className="rounded-none bg-white text-black hover:bg-neutral-200 font-bold uppercase">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
