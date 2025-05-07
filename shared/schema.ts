import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

// Crop model with price information
export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  variety: text("variety").notNull(),
  currentPrice: doublePrecision("current_price").notNull(),
  previousPrice: doublePrecision("previous_price").notNull(),
  change: doublePrecision("change").notNull(),
  percentChange: doublePrecision("percent_change").notNull(),
  trend: text("trend").notNull(), // 'up' or 'down'
  imageUrl: text("image_url").notNull(),
  priceHistory: jsonb("price_history").notNull(), // Array of historical prices
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCropSchema = createInsertSchema(crops).omit({
  id: true,
  updatedAt: true
});

// Product model for marketplace
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(), // 'Seeds', 'Fertilizers', 'Pesticides', 'Tools', 'Equipment'
  imageUrl: text("image_url").notNull(),
  unit: text("unit").notNull(), // e.g., '50lb Bag', '1L Bottle', etc.
  inStock: boolean("in_stock").default(true).notNull(),
  tags: jsonb("tags").notNull(), // Array of tags like 'Organic', 'Non-GMO', etc.
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  shippingCost: doublePrecision("shipping_cost").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull(), // 'Pending', 'Processing', 'Shipped', 'Delivered'
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true
});

// Order Item model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});

// Equipment model for rentals
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  availableUnits: integer("available_units").notNull(),
  dailyRate: doublePrecision("daily_rate").notNull(),
  weeklyRate: doublePrecision("weekly_rate").notNull(),
  category: text("category").notNull(), // 'Tractor', 'Harvester', 'Plow', etc.
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true
});

// Labor model for worker rentals
export const labor = pgTable("labor", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  hourlyRate: doublePrecision("hourly_rate").notNull(),
  availability: text("availability").notNull(), // 'Immediate', 'From <date>', etc.
  skills: jsonb("skills").notNull(), // Array of skills
});

export const insertLaborSchema = createInsertSchema(labor).omit({
  id: true
});

// Rental Request model
export const rentalRequests = pgTable("rental_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  requestType: text("request_type").notNull(), // 'Equipment', 'Labor', 'Both'
  startDate: timestamp("start_date").notNull(),
  duration: text("duration").notNull(),
  farmSize: integer("farm_size").notNull(), // in acres
  description: text("description").notNull(),
  status: text("status").notNull().default('Pending'), // 'Pending', 'Approved', 'Rejected'
  ticketNumber: text("ticket_number").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRentalRequestSchema = createInsertSchema(rentalRequests).omit({
  id: true,
  status: true,
  ticketNumber: true,
  createdAt: true
});

// Price Alert model
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cropId: integer("crop_id").notNull(),
  alertType: text("alert_type").notNull(), // 'above' or 'below'
  priceThreshold: doublePrecision("price_threshold").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  isActive: true,
  createdAt: true
});

// Cart model (temporary storage for shopping cart items)
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  addedAt: true
});

// Type exports for all schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;

export type Labor = typeof labor.$inferSelect;
export type InsertLabor = z.infer<typeof insertLaborSchema>;

export type RentalRequest = typeof rentalRequests.$inferSelect;
export type InsertRentalRequest = z.infer<typeof insertRentalRequestSchema>;

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
