import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Package, Settings, LogOut } from "lucide-react";

// Mock user data since auth is outside scope of provided schema/hooks for now
const mockUser = {
  name: "Alex Design",
  email: "alex@thrive3.com",
  joined: "Oct 2024",
};

const mockOrders = [
  { id: "#ORD-9921", date: "Oct 12, 2024", total: 145.00, status: "Delivered", items: 2 },
  { id: "#ORD-8832", date: "Sep 28, 2024", total: 89.50, status: "Shipped", items: 1 },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {mockUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">{mockUser.name}</h2>
                <p className="text-sm text-neutral-400">{mockUser.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button 
                variant={activeTab === "profile" ? "secondary" : "ghost"} 
                className="w-full justify-start rounded-none uppercase font-bold tracking-wider"
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-2" /> Profile
              </Button>
              <Button 
                variant={activeTab === "orders" ? "secondary" : "ghost"} 
                className="w-full justify-start rounded-none uppercase font-bold tracking-wider"
                onClick={() => setActiveTab("orders")}
              >
                <Package className="w-4 h-4 mr-2" /> Orders
              </Button>
              <Button 
                variant={activeTab === "settings" ? "secondary" : "ghost"} 
                className="w-full justify-start rounded-none uppercase font-bold tracking-wider"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-none uppercase font-bold tracking-wider mt-8"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-neutral-900/30 border border-white/5 p-8">
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold uppercase text-white">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-neutral-400 uppercase text-xs font-bold tracking-wider">Full Name</Label>
                    <Input defaultValue={mockUser.name} className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-neutral-400 uppercase text-xs font-bold tracking-wider">Email Address</Label>
                    <Input defaultValue={mockUser.email} className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-neutral-400 uppercase text-xs font-bold tracking-wider">Phone</Label>
                    <Input placeholder="+1 (555) 000-0000" className="bg-transparent border-white/20 text-white rounded-none focus:ring-0 focus:border-white" />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="rounded-none bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-wider">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold uppercase text-white">Order History</h2>
                </div>

                <div className="space-y-4">
                  {mockOrders.map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row justify-between items-center bg-black/20 p-6 border border-white/5 hover:border-white/20 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:mb-0 w-full sm:w-auto">
                        <div>
                          <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Order ID</p>
                          <p className="text-white font-mono font-bold">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Date</p>
                          <p className="text-white">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Status</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/20">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <p className="text-lg font-bold text-white">${order.total.toFixed(2)}</p>
                        <Button variant="outline" size="sm" className="rounded-none border-neutral-700 text-neutral-300 hover:text-white hover:border-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                 <div className="border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold uppercase text-white">Account Settings</h2>
                </div>
                <p className="text-neutral-400">Manage your notifications and password.</p>
                <div className="p-4 border border-yellow-500/20 bg-yellow-900/10 text-yellow-500 text-sm">
                  This section is under construction.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
