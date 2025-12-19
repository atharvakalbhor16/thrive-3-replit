import { Link } from "wouter";
import { Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useToggleWishlist, useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { mutate: toggleWishlist } = useToggleWishlist();
  const { data: wishlist } = useWishlist();
  
  const isWishlisted = wishlist?.some(item => item.productId === product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="aspect-[3/4] overflow-hidden bg-neutral-900 relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Discount Badge */}
          {Number(product.discountPrice) > 0 && (
            <div className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
              Sale
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
             <Button 
               size="sm" 
               className="w-full bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-wide rounded-none"
             >
               View Product
             </Button>
          </div>
          
          <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm text-white transition-colors"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-white uppercase tracking-wide group-hover:text-neutral-300 transition-colors truncate">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-neutral-400">
              ${Number(product.price).toFixed(2)}
            </span>
            {Number(product.discountPrice) > 0 && (
              <span className="text-xs text-neutral-600 line-through">
                ${Number(product.discountPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
