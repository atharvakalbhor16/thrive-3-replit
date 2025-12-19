import { 
  users, products, cartItems, orders, orderItems, wishlistItems, reviews,
  type User, type InsertUser, type Product, type CartItem, type Order, type OrderItem, type WishlistItem, type Review 
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, ilike, desc, asc, and, inArray } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";

const PgSession = connectPgSimple(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(filters?: { category?: string; sort?: string; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product>;
  
  // Cart
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: Omit<CartItem, "id">): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Orders
  getOrders(userId: number): Promise<Order[]>;
  createOrder(order: Omit<Order, "id" | "createdAt" | "status">, items: Omit<OrderItem, "id">[]): Promise<Order>;

  // Wishlist
  getWishlist(userId: number): Promise<(WishlistItem & { product: Product })[]>;
  toggleWishlist(userId: number, productId: number): Promise<boolean>; // returns true if added, false if removed
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(filters?: { category?: string; sort?: string; search?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (filters?.category) {
      query.where(eq(products.category, filters.category));
    }

    if (filters?.search) {
      query.where(ilike(products.name, `%${filters.search}%`));
    }

    if (filters?.sort) {
      if (filters.sort === 'price_asc') {
        query.orderBy(asc(products.price));
      } else if (filters.sort === 'price_desc') {
        query.orderBy(desc(products.price));
      } else if (filters.sort === 'newest') {
        query.orderBy(desc(products.createdAt));
      }
    } else {
      query.orderBy(desc(products.createdAt));
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product as any).returning();
    return newProduct;
  }

  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await db.select({
      cartItem: cartItems,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
    
    return items.map(item => ({ ...item.cartItem, product: item.product }));
  }

  async addToCart(item: Omit<CartItem, "id">): Promise<CartItem> {
    // Check if item exists
    const [existing] = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, item.userId!),
        eq(cartItems.productId, item.productId),
        eq(cartItems.size, item.size || ''),
        eq(cartItems.color, item.color || '')
      ));

    if (existing) {
      const [updated] = await db.update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async getOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: Omit<Order, "id" | "createdAt" | "status">, items: Omit<OrderItem, "id">[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values(order as any).returning();
      
      if (items.length > 0) {
        await tx.insert(orderItems).values(
          items.map(item => ({ ...item, orderId: newOrder.id }))
        );
      }
      
      return newOrder;
    });
  }

  async getWishlist(userId: number): Promise<(WishlistItem & { product: Product })[]> {
    const items = await db.select({
      wishlistItem: wishlistItems,
      product: products,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId));

    return items.map(item => ({ ...item.wishlistItem, product: item.product }));
  }

  async toggleWishlist(userId: number, productId: number): Promise<boolean> {
    const [existing] = await db.select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));

    if (existing) {
      await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
      return false; // removed
    } else {
      await db.insert(wishlistItems).values({ userId, productId });
      return true; // added
    }
  }

  // Session store for authentication
  sessionStore = new PgSession({
    pool: pool as any,
    tableName: 'session',
    createTableIfMissing: true,
  });
}

export const storage = new DatabaseStorage();
