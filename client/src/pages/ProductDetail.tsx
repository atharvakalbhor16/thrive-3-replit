import { Navbar } from "@/components/Navbar";
import { useProduct } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, Truck, RefreshCw } from "lucide-react";
import { useToggleWishlist, useWishlist } from "@/hooks/use-wishlist";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id!);
  
  const { data: product, isLoading, error } = useProduct(productId);
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: toggleWishlist } = useToggleWishlist();
  const { data: wishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <ProductSkeleton />;
  if (error || !product) return <ProductNotFound />;

  const isWishlisted = wishlist?.some(item => item.productId === productId);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      alert("Please select a size");
      return;
    }
    addToCart({
      productId,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 h-24 lg:w-24 lg:h-32 border-2 transition-all ${
                    activeImage === idx ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover bg-neutral-900" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] bg-neutral-900 relative">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col h-full justify-center">
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">{product.category}</h2>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-white">${Number(product.price).toFixed(2)}</span>
                {product.discountPrice && (
                  <span className="text-xl text-neutral-500 line-through">${Number(product.discountPrice).toFixed(2)}</span>
                )}
              </div>
              <p className="text-neutral-400 leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            <div className="space-y-8 border-t border-white/10 pt-8">
              
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Color</h3>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor === color ? "border-white scale-110" : "border-transparent hover:scale-110"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Size</h3>
                    <button className="text-xs text-neutral-500 underline hover:text-white">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-sm font-bold uppercase transition-all border ${
                          selectedSize === size 
                            ? "bg-white text-black border-white" 
                            : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border border-neutral-800 w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 text-white hover:bg-white/5 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 text-white hover:bg-white/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button 
                  size="lg" 
                  className="flex-1 rounded-none bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest h-auto py-4"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>

                <Button 
                  size="icon" 
                  variant="outline" 
                  className={`rounded-none h-auto w-14 border-neutral-800 hover:bg-white/5 hover:text-white hover:border-white ${isWishlisted ? "text-red-500 border-red-500/50" : "text-neutral-400"}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-4 pt-8 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping over $150</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>30-Day Returns</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="space-y-6 py-12">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2 pt-8">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-display font-bold text-white mb-4">Product Not Found</h1>
      <p className="text-neutral-400 mb-8">The product you are looking for does not exist or has been removed.</p>
      <Link href="/products">
        <Button className="rounded-none bg-white text-black font-bold uppercase">Back to Shop</Button>
      </Link>
    </div>
  );
}
