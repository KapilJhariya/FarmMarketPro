import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertRentalRequestSchema,
  insertPriceAlertSchema,
  insertCartItemSchema
} from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Crop Routes
  app.get("/api/crops", async (req: Request, res: Response) => {
    try {
      const crops = await storage.getAllCrops();
      res.json(crops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crops" });
    }
  });

  app.get("/api/crops/:id", async (req: Request, res: Response) => {
    try {
      const crop = await storage.getCrop(Number(req.params.id));
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json(crop);
    } catch (error) {
      res.status(500).json({ message: "Error fetching crop" });
    }
  });

  // Product Routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  // Equipment Routes
  app.get("/api/equipment", async (req: Request, res: Response) => {
    try {
      const equipment = await storage.getAllEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment" });
    }
  });

  app.get("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const equipment = await storage.getEquipment(Number(req.params.id));
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment" });
    }
  });

  // Labor Routes
  app.get("/api/labor", async (req: Request, res: Response) => {
    try {
      const labor = await storage.getAllLabor();
      res.json(labor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching labor" });
    }
  });

  app.get("/api/labor/:id", async (req: Request, res: Response) => {
    try {
      const labor = await storage.getLabor(Number(req.params.id));
      if (!labor) {
        return res.status(404).json({ message: "Labor not found" });
      }
      res.json(labor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching labor" });
    }
  });

  // Cart Routes
  app.get("/api/cart/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      
      // Calculate totals
      let subtotal = 0;
      const items = cartItems.map(({ cartItem, product }) => {
        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;
        
        return {
          id: cartItem.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          imageUrl: product.imageUrl,
          unit: product.unit,
          subtotal: itemTotal
        };
      });
      
      const shippingCost = subtotal > 0 ? 12.50 : 0;
      const total = subtotal + shippingCost;
      
      res.json({
        items,
        subtotal,
        shippingCost,
        total
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart items" });
    }
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const removed = await storage.removeFromCart(id);
      
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error removing cart item" });
    }
  });

  app.delete("/api/cart/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      await storage.clearCart(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });

  // Order Routes
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Generate a random order number
      const orderNumber = `AG${Date.now().toString().slice(-5)}-${nanoid(5)}`;
      
      const order = await storage.createOrder({
        ...orderData,
        orderNumber
      });
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.post("/api/orders/:orderId/items", async (req: Request, res: Response) => {
    try {
      const orderId = Number(req.params.orderId);
      const orderItemData = insertOrderItemSchema.parse({
        ...req.body,
        orderId
      });
      
      const orderItem = await storage.addOrderItem(orderItemData);
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid order item data" });
    }
  });

  app.get("/api/orders/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const orders = await storage.getOrdersByUser(userId);
      
      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return { ...order, items };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  // Rental Request Routes
  app.post("/api/rental-requests", async (req: Request, res: Response) => {
    try {
      console.log("Rental request body:", req.body);
      const { userId, requestType, startDate, duration, farmSize, description, ticketNumber, contractorNumber, estimatedWaitTime } = req.body;
      
      if (!userId || !requestType || !startDate || !duration || !farmSize || !description || !ticketNumber || !contractorNumber || !estimatedWaitTime) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          received: { userId, requestType, startDate, duration, farmSize, description, ticketNumber, contractorNumber, estimatedWaitTime }
        });
      }
      
      // Create rental request with the provided data
      const rentalRequest = await storage.createRentalRequest({
        userId,
        requestType,
        startDate,
        duration,
        farmSize,
        description,
        ticketNumber,
        contractorNumber,
        estimatedWaitTime
      });
      
      res.status(201).json(rentalRequest);
    } catch (error) {
      console.error("Error creating rental request:", error);
      res.status(400).json({ message: "Invalid rental request data", error: String(error) });
    }
  });

  app.get("/api/rental-requests/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const requests = await storage.getRentalRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rental requests" });
    }
  });

  // Price Alert Routes
  app.post("/api/price-alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertPriceAlertSchema.parse(req.body);
      const alert = await storage.createPriceAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid price alert data" });
    }
  });

  app.get("/api/price-alerts/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const alerts = await storage.getPriceAlertsByUser(userId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching price alerts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
