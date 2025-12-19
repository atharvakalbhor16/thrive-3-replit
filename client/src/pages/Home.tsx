import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading } = useProducts({ sort: "newest" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Unsplash image: Urban fashion street style dark moody */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-white/80 mb-4">
              Est. 2024 • Global
            </h2>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tighter uppercase leading-none mb-8">
              Thrive<br/>Three
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/products">
                <Button size="lg" className="rounded-none bg-white text-black hover:bg-neutral-200 px-8 py-6 text-lg font-bold uppercase tracking-wider">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/products?category=New">
                <Button variant="outline" size="lg" className="rounded-none border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold uppercase tracking-wider">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
        <Link href="/products?category=Hoodies" className="relative group overflow-hidden">
          {/* Unsplash: Man in hoodie street style */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
             <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight relative z-10">
               Hoodies <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
             </h3>
          </div>
        </Link>
        <Link href="/products?category=Accessories" className="relative group overflow-hidden">
          {/* Unsplash: Streetwear accessories chains rings */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582226296181-e2341b538743?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
             <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight relative z-10">
               Accessories <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
             </h3>
          </div>
        </Link>
      </section>

      {/* Marquee Section */}
      <div className="bg-white py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex space-x-8">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-black font-display font-black text-4xl uppercase tracking-tighter">
              New Drop Available Now • Limited Stock • 
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight">
            Trending Now
          </h2>
          <Link href="/products" className="group flex items-center text-sm font-medium uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">
            View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-900 aspect-[3/4] w-full" />
                <div className="mt-4 h-4 bg-neutral-900 w-3/4" />
                <div className="mt-2 h-4 bg-neutral-900 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {featuredProducts?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="font-display text-3xl font-bold uppercase tracking-tighter text-white mb-6 block">
                Thrive 3
              </Link>
              <p className="text-neutral-400 max-w-md">
                Defining the future of urban fashion. Built for those who dare to stand out. Premium quality, limited drops, global shipping.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase tracking-wider text-white mb-6">Shop</h4>
              <ul className="space-y-4">
                <li><Link href="/products?category=New" className="text-neutral-400 hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link href="/products" className="text-neutral-400 hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/products?category=Accessories" className="text-neutral-400 hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase tracking-wider text-white mb-6">Support</h4>
              <ul className="space-y-4">
                <li><Link href="/account" className="text-neutral-400 hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
            <p>© 2024 Thrive 3. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
