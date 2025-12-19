import { Navbar } from "@/components/Navbar";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveFromCart();

  const subtotal = cartItems?.reduce((acc, item) => {
    return acc + (Number(item.product.price) * item.quantity);
  }, 0) || 0;

  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
          <h1 className="text-4xl font-display font-bold uppercase text-white mb-4">Your Bag is Empty</h1>
          <p className="text-neutral-400 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Check out our latest drops.</p>
          <Link href="/products">
            <Button size="lg" className="rounded-none bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-4xl font-display font-bold uppercase text-white mb-12">Shopping Bag ({cartItems.length})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 pb-8 border-b border-white/10">
                <div className="w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-neutral-900">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
                        <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                      </h3>
                      <p className="text-sm text-neutral-400 mb-1">Category: {item.product.category}</p>
                      {item.size && <p className="text-sm text-neutral-400">Size: {item.size}</p>}
                    </div>
                    <p className="text-lg font-bold text-white">${Number(item.product.price).toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-neutral-800">
                      <button 
                        onClick={() => updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                        className="p-2 text-white hover:bg-white/5"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm text-white font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                        className="p-2 text-white hover:bg-white/5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-500 hover:text-red-500 transition-colors flex items-center text-xs uppercase font-bold tracking-wider"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-900/50 p-6 sm:p-8 sticky top-24 border border-white/5">
              <h2 className="text-xl font-display font-bold uppercase text-white mb-6">Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping Estimate</span>
                  <span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tax Estimate</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white uppercase">Total</span>
                  <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full rounded-none bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest py-6 text-base">
                  Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-neutral-500 mt-4">
                Secure Checkout • Free Shipping on Orders $150+
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
