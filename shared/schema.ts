import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  address: true,
});

// Crop price schema
export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  variety: text("variety").notNull(),
  currentPrice: doublePrecision("current_price").notNull(),
  previousPrice: doublePrecision("previous_price").notNull(),
  imageUrl: text("image_url").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  marketId: integer("market_id").notNull(),
});

export const insertCropSchema = createInsertSchema(crops).pick({
  name: true,
  variety: true,
  currentPrice: true,
  previousPrice: true,
  imageUrl: true,
  lastUpdated: true,
  marketId: true,
});

// Market schema
export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertMarketSchema = createInsertSchema(markets).pick({
  name: true,
});

// Product category schema
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  stock: integer("stock").notNull(),
  tags: text("tags").array(),
  isBestSeller: boolean("is_best_seller").default(false),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  unit: true,
  imageUrl: true,
  categoryId: true,
  stock: true,
  tags: true,
  isBestSeller: true,
});

// Equipment schema
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(), // price per day
  imageUrl: text("image_url").notNull(),
  availabilityStatus: text("availability_status").notNull(),
  availabilityDate: timestamp("availability_date"),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  features: text("features").array(),
  contactPhone: text("contact_phone").notNull(),
  location: text("location").notNull(),
  distanceInMiles: integer("distance_in_miles"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  availabilityStatus: true,
  availabilityDate: true,
  rating: true,
  reviewCount: true,
  features: true,
  contactPhone: true,
  location: true,
  distanceInMiles: true,
});

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderDate: timestamp("order_date").notNull(),
  status: text("status").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  tax: doublePrecision("tax").notNull(),
  shipping: doublePrecision("shipping").notNull(),
  total: doublePrecision("total").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  orderDate: true,
  status: true,
  subtotal: true,
  tax: true,
  shipping: true,
  total: true,
  shippingAddress: true,
  paymentMethod: true,
});

// Order item schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

// Rental booking schema
export const rentalBookings = pgTable("rental_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  ticketNumber: text("ticket_number").notNull(),
});

export const insertRentalBookingSchema = createInsertSchema(rentalBookings).pick({
  userId: true,
  equipmentId: true,
  startDate: true,
  endDate: true,
  totalPrice: true,
  status: true,
  bookingDate: true,
  ticketNumber: true,
});

// Define the types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof crops.$inferSelect;

export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type Market = typeof markets.$inferSelect;

export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertRentalBooking = z.infer<typeof insertRentalBookingSchema>;
export type RentalBooking = typeof rentalBookings.$inferSelect;

// Define an OrderWithItems type for returning orders with their items
export type OrderWithItems = Order & { items: (OrderItem & { product: Product })[] };

// Cart Item type (for frontend use)
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl: string;
};
