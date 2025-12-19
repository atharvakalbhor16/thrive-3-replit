import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, User, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { data: cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href} 
      className={`text-sm font-medium tracking-wide uppercase hover:text-white transition-colors ${
        location === href ? "text-white" : "text-neutral-400"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background border-r border-white/10 w-[300px] p-0">
                <div className="flex flex-col h-full pt-16 px-6 space-y-8">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display font-bold uppercase">Thrive 3</Link>
                  <div className="flex flex-col space-y-6">
                    <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">All Products</Link>
                    <Link href="/products?category=T-Shirts" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">T-Shirts</Link>
                    <Link href="/products?category=Hoodies" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">Hoodies</Link>
                    <Link href="/products?category=Accessories" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-white">Accessories</Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start flex-1 sm:flex-none">
            <Link href="/" className="font-display text-2xl font-bold tracking-tighter uppercase text-white">
              Thrive<span className="text-neutral-500">3</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:space-x-8 md:space-x-12">
            <NavLink href="/products">Shop</NavLink>
            <NavLink href="/products?category=New">New Arrivals</NavLink>
            <NavLink href="/products?category=Collections">Collections</NavLink>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-neutral-400 hover:text-white hidden sm:flex"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/account">
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-white ring-2 ring-background animate-pulse" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
