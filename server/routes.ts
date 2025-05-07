import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCropSchema, insertEquipmentSchema, insertOrderItemSchema, 
  insertOrderSchema, insertProductSchema, insertRentalBookingSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const user = await storage.createUser(userData);
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  // Crop routes
  app.get("/api/crops", async (_req: Request, res: Response) => {
    try {
      const crops = await storage.getCrops();
      res.status(200).json(crops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crops" });
    }
  });

  app.get("/api/crops/market/:marketId", async (req: Request, res: Response) => {
    try {
      const marketId = parseInt(req.params.marketId);
      
      if (isNaN(marketId)) {
        return res.status(400).json({ message: "Invalid market ID" });
      }
      
      const crops = await storage.getCropsByMarket(marketId);
      res.status(200).json(crops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crops by market" });
    }
  });

  app.get("/api/crops/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid crop ID" });
      }
      
      const crop = await storage.getCrop(id);
      
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      
      res.status(200).json(crop);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crop" });
    }
  });

  app.post("/api/crops", async (req: Request, res: Response) => {
    try {
      const cropData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(cropData);
      res.status(201).json(crop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid crop data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating crop" });
    }
  });

  app.put("/api/crops/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid crop ID" });
      }
      
      const cropData = insertCropSchema.partial().parse(req.body);
      const updatedCrop = await storage.updateCrop(id, cropData);
      
      if (!updatedCrop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      
      res.status(200).json(updatedCrop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid crop data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating crop" });
    }
  });

  // Market routes
  app.get("/api/markets", async (_req: Request, res: Response) => {
    try {
      const markets = await storage.getMarkets();
      res.status(200).json(markets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching markets" });
    }
  });

  // Product Category routes
  app.get("/api/product-categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getProductCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product categories" });
    }
  });

  // Product routes
  app.get("/api/products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const products = await storage.getProductsByCategory(categoryId);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products by category" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  // Equipment routes
  app.get("/api/equipment", async (req: Request, res: Response) => {
    try {
      const distance = req.query.distance ? parseInt(req.query.distance as string) : undefined;
      
      let equipmentList;
      if (distance && !isNaN(distance)) {
        equipmentList = await storage.getEquipmentByDistance(distance);
      } else {
        equipmentList = await storage.getEquipment();
      }
      
      res.status(200).json(equipmentList);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment" });
    }
  });

  app.get("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const equipment = await storage.getEquipmentItem(id);
      
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment" });
    }
  });

  app.post("/api/equipment", async (req: Request, res: Response) => {
    try {
      const equipmentData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(equipmentData);
      res.status(201).json(equipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating equipment" });
    }
  });

  // Order routes
  app.get("/api/orders/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await storage.getOrders(userId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Validate that user exists
      const user = await storage.getUser(orderData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order" });
    }
  });

  app.post("/api/order-items", async (req: Request, res: Response) => {
    try {
      const orderItemData = insertOrderItemSchema.parse(req.body);
      
      // Validate that the order exists
      const order = await storage.getOrder(orderItemData.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Validate that the product exists
      const product = await storage.getProduct(orderItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Update product stock
      await storage.updateProductStock(orderItemData.productId, orderItemData.quantity);
      
      const orderItem = await storage.createOrderItem(orderItemData);
      res.status(201).json(orderItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order item data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order item" });
    }
  });

  // Rental booking routes
  app.get("/api/rental-bookings/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const bookings = await storage.getRentalBookings(userId);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rental bookings" });
    }
  });

  app.get("/api/rental-bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = await storage.getRentalBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rental booking" });
    }
  });

  app.post("/api/rental-bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertRentalBookingSchema.parse(req.body);
      
      // Validate that user exists
      const user = await storage.getUser(bookingData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate that equipment exists
      const equipment = await storage.getEquipmentItem(bookingData.equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      // Create the booking
      const booking = await storage.createRentalBooking(bookingData);
      
      // Update equipment availability
      const startDate = new Date(bookingData.startDate);
      const formattedDate = startDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      await storage.updateEquipment(bookingData.equipmentId, {
        availabilityStatus: `Booked until ${formattedDate}`,
        availabilityDate: startDate
      });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating rental booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
