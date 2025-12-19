import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Set up authentication (passport-local)
  setupAuth(app);

  // === PRODUCTS ===
  app.get(api.products.list.path, async (req, res) => {
    const filters = {
      category: req.query.category as string,
      sort: req.query.sort as string,
      search: req.query.search as string,
    };
    const products = await storage.getProducts(filters);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    // Basic admin check for MVP - just check if user is admin
    if (!req.isAuthenticated() || !(req.user as any).isAdmin) {
       // Allow seeding for now if needed, or strictly enforce.
       // For MVP development, we might relax this or rely on seeded data.
       // Let's implement seed logic separately.
       return res.status(403).json({ message: "Unauthorized" });
    }
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input as any);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === CART ===
  app.get(api.cart.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const cart = await storage.getCartItems((req.user as any).id);
    res.json(cart);
  });

  app.post(api.cart.add.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.cart.add.input.parse(req.body);
      const item = await storage.addToCart({ ...input, userId: (req.user as any).id } as any);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.cart.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const quantity = Number(req.body.quantity);
    if (isNaN(quantity) || quantity < 1) return res.status(400).json({ message: "Invalid quantity" });
    const item = await storage.updateCartItem(Number(req.params.id), quantity);
    res.json(item);
  });

  app.delete(api.cart.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.removeFromCart(Number(req.params.id));
    res.sendStatus(204);
  });

  // === ORDERS ===
  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders((req.user as any).id);
    res.json(orders);
  });

  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.orders.create.input.parse(req.body);
      
      // Calculate total (re-verify prices backend side ideally)
      let total = 0;
      input.items.forEach(item => {
        total += item.price * item.quantity;
      });

      const order = await storage.createOrder(
        { 
          userId: (req.user as any).id, 
          total: total as any,
          address: input.address 
        },
        input.items.map(item => ({ ...item, orderId: 0 })) // orderId set in storage
      );
      
      // Clear cart
      await storage.clearCart((req.user as any).id);
      
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === WISHLIST ===
  app.get(api.wishlist.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getWishlist((req.user as any).id);
    res.json(items);
  });

  app.post(api.wishlist.toggle.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const productId = Number(req.body.productId);
    const added = await storage.toggleWishlist((req.user as any).id, productId);
    res.json({ added });
  });

  // === SEED DATA ===
  // In a real app, this would be a separate script or admin endpoint
  // Check if products exist, if not, seed them
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding database...");
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  const sampleProducts = [
    {
      name: "Street Oversized Tee",
      description: "Premium cotton oversized t-shirt with urban graphic print. Heavyweight fabric for structured drape.",
      price: 35.00,
      category: "T-Shirts",
      images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
      stock: 100,
      colors: ["Black", "White", "Olive"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      tags: ["oversized", "graphic", "cotton"],
    },
    {
      name: "Cargo Tech Joggers",
      description: "Functional cargo joggers with multiple pockets and tapered fit. Water-resistant material.",
      price: 65.00,
      category: "Joggers",
      images: ["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80"],
      stock: 50,
      colors: ["Black", "Khaki"],
      sizes: ["S", "M", "L", "XL"],
      tags: ["techwear", "cargo", "pants"],
    },
    {
      name: "Urban Hoodie",
      description: "Essential streetwear hoodie with drop shoulders and kangaroo pocket. Soft fleece lining.",
      price: 55.00,
      category: "Hoodies",
      images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"],
      stock: 75,
      colors: ["Black", "Grey", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      tags: ["essential", "hoodie", "fleece"],
    },
    {
      name: "Boxy Fit Shirt",
      description: "Short sleeve button-up shirt with boxy silhouette. Abstract pattern print.",
      price: 45.00,
      category: "Shirts",
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"],
      stock: 40,
      colors: ["Multi"],
      sizes: ["M", "L", "XL"],
      tags: ["pattern", "summer", "boxy"],
    },
    {
      name: "Distressed Denim Jacket",
      description: "Vintage wash denim jacket with distressed details and custom hardware.",
      price: 85.00,
      category: "Jackets",
      images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80"],
      stock: 30,
      colors: ["Blue Wash"],
      sizes: ["S", "M", "L", "XL"],
      tags: ["denim", "vintage", "outerwear"],
    }
  ];

  for (const p of sampleProducts) {
    await storage.createProduct(p as any);
  }
  console.log("Database seeded successfully.");
}
