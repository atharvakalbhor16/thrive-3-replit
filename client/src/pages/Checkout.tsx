import { Navbar } from "@/components/Navbar";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Checkout() {
  const { data: cartItems, isLoading } = useCart();
  const [, setLocation] = useLocation();

  const subtotal = cartItems?.reduce((acc, item) => {
    return acc + (Number(item.product.price) * item.quantity);
  }, 0) || 0;

  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate checkout process
    setTimeout(() => {
      alert("Order placed successfully! (Demo)");
      setLocation("/");
    }, 1500);
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-white" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-display font-bold uppercase text-white mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8">
            <form onSubmit={handleCheckout} className="space-y-12">
              
              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-bold uppercase text-white mb-6 flex items-center">
                  <span className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input id="zip" required className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                 <h2 className="text-xl font-bold uppercase text-white mb-6 flex items-center">
                  <span className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                  Payment Method
                </h2>

                <RadioGroup defaultValue="card" className="grid gap-4">
                  <div className="flex items-center justify-between border border-white/20 p-4 hover:border-white transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" className="border-white text-white" />
                      <Label htmlFor="card" className="text-white cursor-pointer font-bold">Credit Card</Label>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-8 h-5 bg-white/10 rounded"></div>
                       <div className="w-8 h-5 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border border-white/20 p-4 hover:border-white transition-colors cursor-pointer opacity-50">
                    <RadioGroupItem value="paypal" id="paypal" disabled className="border-white text-white" />
                    <Label htmlFor="paypal" className="text-neutral-400">PayPal (Unavailable)</Label>
                  </div>
                </RadioGroup>

                <div className="mt-6 space-y-4 p-6 bg-neutral-900/50 border border-white/5">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="0000 0000 0000 0000" className="bg-transparent border-white/20 text-white rounded-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" className="bg-transparent border-white/20 text-white rounded-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input placeholder="123" className="bg-transparent border-white/20 text-white rounded-none" />
                    </div>
                  </div>
                </div>
              </section>

              <Button type="submit" size="lg" className="w-full md:w-auto rounded-none bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest py-6 text-lg">
                Complete Order <Lock className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
             <div className="bg-neutral-900 p-6 sticky top-24 border border-white/5">
                <h3 className="font-display font-bold uppercase text-white mb-6 text-lg">Order Summary</h3>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems?.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-neutral-800 flex-shrink-0">
                        <img src={item.product.images[0]} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white uppercase">{item.product.name}</h4>
                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-neutral-200">${Number(item.product.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping</span>
                    <span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10 mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center text-xs text-neutral-500 gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Secure SSL Encryption
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
