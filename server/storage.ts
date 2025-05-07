import { 
  users, type User, type InsertUser,
  crops, type Crop, type InsertCrop,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  equipment, type Equipment, type InsertEquipment,
  labor, type Labor, type InsertLabor,
  rentalRequests, type RentalRequest, type InsertRentalRequest,
  priceAlerts, type PriceAlert, type InsertPriceAlert,
  cartItems, type CartItem, type InsertCartItem
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Crop operations
  getAllCrops(): Promise<Crop[]>;
  getCrop(id: number): Promise<Crop | undefined>;
  updateCrop(crop: Crop): Promise<Crop>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Order Item operations
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Equipment operations
  getAllEquipment(): Promise<Equipment[]>;
  getEquipment(id: number): Promise<Equipment | undefined>;
  
  // Labor operations
  getAllLabor(): Promise<Labor[]>;
  getLabor(id: number): Promise<Labor | undefined>;
  
  // Rental Request operations
  createRentalRequest(request: InsertRentalRequest): Promise<RentalRequest>;
  getRentalRequestsByUser(userId: number): Promise<RentalRequest[]>;
  deleteRentalRequest(id: number): Promise<boolean>;
  
  // Price Alert operations
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  getPriceAlertsByUser(userId: number): Promise<PriceAlert[]>;
  
  // Cart operations
  getCartItems(userId: number): Promise<{ cartItem: CartItem; product: Product }[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
}

// Memory Storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private crops: Map<number, Crop>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private equipment: Map<number, Equipment>;
  private labor: Map<number, Labor>;
  private rentalRequests: Map<number, RentalRequest>;
  private priceAlerts: Map<number, PriceAlert>;
  private cartItems: Map<number, CartItem>;

  // ID counters for each entity
  private currentUserId: number;
  private currentCropId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentEquipmentId: number;
  private currentLaborId: number;
  private currentRentalRequestId: number;
  private currentPriceAlertId: number;
  private currentCartItemId: number;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.equipment = new Map();
    this.labor = new Map();
    this.rentalRequests = new Map();
    this.priceAlerts = new Map();
    this.cartItems = new Map();

    this.currentUserId = 1;
    this.currentCropId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentEquipmentId = 1;
    this.currentLaborId = 1;
    this.currentRentalRequestId = 1;
    this.currentPriceAlertId = 1;
    this.currentCartItemId = 1;

    // Initialize with sample data
    this.initSampleData();
  }

  // Initialize sample data for demonstration
  private initSampleData() {
    // Sample crops
    const sampleCrops: InsertCrop[] = [
      {
        name: "Wheat",
        variety: "Common",
        currentPrice: 320.45,
        previousPrice: 308.15,
        change: 12.30,
        percentChange: 3.8,
        trend: "up",
        imageUrl: "https://pixabay.com/get/gd624dd32f1da5fea4cd11e809bfc2ca6df3e07a91d9615e42e6a4b45c9292c54c5339bef94658687f4afbc0cc6fe30932fc5555c8c5df656e1d68580ced90ebb_1280.jpg",
        priceHistory: [290, 295, 300, 305, 308.15, 320.45]
      },
      {
        name: "Corn",
        variety: "Yellow",
        currentPrice: 185.20,
        previousPrice: 190.85,
        change: -5.65,
        percentChange: -2.9,
        trend: "down",
        imageUrl: "https://images.unsplash.com/photo-1534313218094-b30d7888478c?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        priceHistory: [195, 193, 192, 191, 190.85, 185.20]
      },
      {
        name: "Soybeans",
        variety: "Standard",
        currentPrice: 425.70,
        previousPrice: 416.80,
        change: 8.90,
        percentChange: 2.1,
        trend: "up",
        imageUrl: "https://pixabay.com/get/g36a9fd44ef1035d0efa51c912c3e774b089fc572c97b2e0ba3db2a46ee375e180bb32ec8004315c254aadefb2151f5e1e154923bc0a7dc550b16bef6af0c01ec_1280.jpg",
        priceHistory: [400, 405, 410, 415, 416.80, 425.70]
      },
      {
        name: "Rice",
        variety: "Long Grain",
        currentPrice: 560.30,
        previousPrice: 545.10,
        change: 15.20,
        percentChange: 2.8,
        trend: "up",
        imageUrl: "https://pixabay.com/get/gd3f1914c6ab2b7bfc21dc6657b803bd0b50d9768acfb44f94f235dd328dab2f87bb079eac58dd8b7ce6adb3976d2cd2c7dffaa89cadf255f5cbf678056ca2fde_1280.jpg",
        priceHistory: [520, 530, 535, 540, 545.10, 560.30]
      },
      {
        name: "Barley",
        variety: "Feed",
        currentPrice: 210.75,
        previousPrice: 205.50,
        change: 5.25,
        percentChange: 2.5,
        trend: "up",
        imageUrl: "https://pixabay.com/get/g0a2e1f2dc24ca6afbfec3ab47c7a14c4c1d2f07e71a08a88abf0ec9b5b323e11ac4aa4097cc5f242faf59a2e5e11a6c8a55b08e5f7beaf41bfd79c55e1ac15b9_1280.jpg",
        priceHistory: [190, 195, 200, 205, 205.50, 210.75]
      },
      {
        name: "Cotton",
        variety: "Upland",
        currentPrice: 78.90,
        previousPrice: 82.45,
        change: -3.55,
        percentChange: -4.3,
        trend: "down",
        imageUrl: "https://pixabay.com/get/g3afab27efa9d32a63d1c546ab2a301baa6f6b9dbc5df9cf4df5b89a0e42edb7e9eeee6ac56c5c9c0775e4b8eb38d7cb80fcaeff74ea2ad0c9c18ad74d3a0ecc5_1280.jpg",
        priceHistory: [85, 84, 83, 82.45, 80, 78.90]
      }
    ];

    // Sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Organic Fertilizer",
        description: "High-quality organic fertilizer for all crops",
        price: 45.99,
        category: "Fertilizers",
        imageUrl: "https://pixabay.com/get/g339f989526ef7457dcfe5b8989e59cacf082420bf04ec1ad124e4ff9c720abcc19d3efdba80cf118159838c212f56ece96dbeb27a0dce2985cf6b143d092f12e_1280.jpg",
        unit: "50lb Bag",
        inStock: true,
        tags: ["Organic", "Premium"]
      },
      {
        name: "Garden Tool Set",
        description: "Complete set of garden tools for all your farming needs",
        price: 89.95,
        category: "Tools",
        imageUrl: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        unit: "5-Piece Set",
        inStock: true,
        tags: ["Best Seller", "Durable"]
      },
      {
        name: "Heirloom Vegetable Seeds",
        description: "Collection of heirloom vegetable seeds for diverse planting",
        price: 24.50,
        category: "Seeds",
        imageUrl: "https://pixabay.com/get/g4dfcba4e620a948c283c0f5ecb12938a6dd258cc41f640f7e4faeb85479f30bccfb93072f9f97c5c1d0111751d12f0c081aeed2892d21acfcf8f69406bcb39f1_1280.jpg",
        unit: "20 Variety Pack",
        inStock: true,
        tags: ["Non-GMO", "Heirloom"]
      },
      {
        name: "Organic Pest Control",
        description: "Natural pest control solution safe for organic farming",
        price: 35.75,
        category: "Pesticides",
        imageUrl: "https://pixabay.com/get/ga2f1f794ea119827f3789c9ef07b1f4df764db10d4870364c6dbc39ad995cdc14964f17cb6e91691a2effb0657ccc8c9496280e8fee1e902d4f2783005cf1cee_1280.jpg",
        unit: "32oz Concentrate",
        inStock: true,
        tags: ["Eco-Friendly", "Organic"]
      },
      {
        name: "Heavy-Duty Garden Hose",
        description: "Durable, kink-resistant garden hose for farm irrigation",
        price: 67.99,
        category: "Tools",
        imageUrl: "https://pixabay.com/get/gacede183ce2aba93aec4e97fb5d3ace6fb33c62c0aa06e86d60b5e54cefd08be5a8db5fb78c055eb97afaf7f5e83b81b55f7f3c4c2eca6a89c2b7eb59aeec01a_1280.jpg",
        unit: "100ft Length",
        inStock: true,
        tags: ["Durable", "Heavy-Duty"]
      },
      {
        name: "Soil pH Testing Kit",
        description: "Professional soil pH testing kit for optimal crop management",
        price: 29.95,
        category: "Tools",
        imageUrl: "https://pixabay.com/get/ga8c7cc2cb17fdfeaa6fe7a83a5b5e5b9d65e0cc25baef9de2b6a2fa835b5b7d0b1b9a2ef4b16a2db7e4d05cad2e8a0fdfaa8e3c5f0aad1af84c4acd25f6c0c1e_1280.jpg",
        unit: "Complete Kit",
        inStock: true,
        tags: ["Professional", "Essential"]
      }
    ];

    // Sample equipment
    const sampleEquipment: InsertEquipment[] = [
      {
        name: "John Deere Tractor",
        model: "6120M, 120 HP",
        description: "Versatile tractor suitable for various farm operations",
        imageUrl: "https://pixabay.com/get/g440f6ef9c6af140cb22b6042bb50438021f289b481dbca852577c74c4abb008b64c36a5c8ce4380ea9bd86d4cd88a6e8e60c04430fbba77f2fdfe2a1b12abded_1280.jpg",
        availableUnits: 3,
        dailyRate: 350,
        weeklyRate: 1500,
        category: "Tractor"
      },
      {
        name: "Combine Harvester",
        model: "Case IH 7150, 350 HP",
        description: "High-performance combine harvester for efficient grain harvesting",
        imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        availableUnits: 1,
        dailyRate: 750,
        weeklyRate: 3200,
        category: "Harvester"
      },
      {
        name: "Seed Drill",
        model: "Amazone D9-30",
        description: "Precision seed drill for consistent seed placement",
        imageUrl: "https://pixabay.com/get/g3a17f33b5afbd7ce6536de3fbca77f22307bb02097df3a14bba76adeb3bb3f38fd75e3607b80ec1f25c0b5b5d94e7664dc0f8da5d0a9ca7abe6f3ede3e9e5c8d_1280.jpg",
        availableUnits: 2,
        dailyRate: 250,
        weeklyRate: 1200,
        category: "Seeder"
      },
      {
        name: "Irrigation System",
        model: "Valley Center Pivot",
        description: "Efficient irrigation system for large fields",
        imageUrl: "https://pixabay.com/get/gd0e2c9f3a839e6f18d3b42f2bab10d79a0f4e3dc9b16cdcd9db0ddd0e28f0eb87b9c4b25c7095ba48cd35a0baf4a1efe84f453b11fe13e9c22654e90d21f8d44_1280.jpg",
        availableUnits: 2,
        dailyRate: 200,
        weeklyRate: 1000,
        category: "Irrigation"
      }
    ];

    // Sample labor
    const sampleLabor: InsertLabor[] = [
      {
        title: "Seasonal Farm Workers",
        description: "Team of 5-10 experienced workers for harvesting and planting",
        imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        hourlyRate: 15,
        availability: "Immediate",
        skills: ["Harvesting", "Planting", "General Farm Work"]
      },
      {
        title: "Equipment Operator",
        description: "Skilled operator for tractors, harvesters and other farm equipment",
        imageUrl: "https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        hourlyRate: 25,
        availability: "From 08/15",
        skills: ["Tractor Operation", "Harvester Operation", "Equipment Maintenance"]
      },
      {
        title: "Agricultural Technician",
        description: "Experienced technician for equipment setup and maintenance",
        imageUrl: "https://pixabay.com/get/g61ac3f90cc59d8d02f512a08a65f0fd40d9aa5e5db1d8ce45f6e75a46e99ac7af1b27f6f2bc9c1ebebf1ee4cf9ab76adb399e1ae1c18f12cb92c5a3f8cee9775_1280.jpg",
        hourlyRate: 30,
        availability: "Weekends Only",
        skills: ["Equipment Repair", "Machinery Setup", "Technical Support"]
      }
    ];

    // Add sample data to storage
    sampleCrops.forEach(crop => this.addCrop(crop));
    sampleProducts.forEach(product => this.addProduct(product));
    sampleEquipment.forEach(equip => this.addEquipment(equip));
    sampleLabor.forEach(lab => this.addLabor(lab));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Crop operations
  private async addCrop(insertCrop: InsertCrop): Promise<Crop> {
    const id = this.currentCropId++;
    const now = new Date();
    const crop: Crop = { ...insertCrop, id, updatedAt: now };
    this.crops.set(id, crop);
    return crop;
  }

  async getAllCrops(): Promise<Crop[]> {
    return Array.from(this.crops.values());
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async updateCrop(crop: Crop): Promise<Crop> {
    this.crops.set(crop.id, crop);
    return crop;
  }

  // Product operations
  private async addProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const order: Order = { ...insertOrder, id, orderDate: now };
    this.orders.set(id, order);
    return order;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber
    );
  }
  
  async deleteOrder(id: number): Promise<boolean> {
    // First check if the order exists
    const order = this.orders.get(id);
    if (!order) {
      return false;
    }
    
    // Delete the order items related to this order
    const orderItems = await this.getOrderItems(id);
    for (const item of orderItems) {
      this.orderItems.delete(item.id);
    }
    
    // Finally delete the order
    return this.orders.delete(id);
  }

  // Order Item operations
  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  // Equipment operations
  private async addEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = this.currentEquipmentId++;
    const equipment: Equipment = { ...insertEquipment, id };
    this.equipment.set(id, equipment);
    return equipment;
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  // Labor operations
  private async addLabor(insertLabor: InsertLabor): Promise<Labor> {
    const id = this.currentLaborId++;
    const labor: Labor = { ...insertLabor, id };
    this.labor.set(id, labor);
    return labor;
  }

  async getAllLabor(): Promise<Labor[]> {
    return Array.from(this.labor.values());
  }

  async getLabor(id: number): Promise<Labor | undefined> {
    return this.labor.get(id);
  }

  // Rental Request operations
  async createRentalRequest(insertRequest: InsertRentalRequest): Promise<RentalRequest> {
    const id = this.currentRentalRequestId++;
    const now = new Date();
    // Use provided ticket number or generate a new one
    const ticketNumber = insertRequest.ticketNumber || `RT-${Date.now().toString().slice(-6)}-${id}`;
    const request: RentalRequest = { 
      ...insertRequest, 
      id, 
      status: 'Pending', 
      ticketNumber, 
      createdAt: now 
    };
    this.rentalRequests.set(id, request);
    return request;
  }

  async getRentalRequestsByUser(userId: number): Promise<RentalRequest[]> {
    return Array.from(this.rentalRequests.values()).filter(
      (request) => request.userId === userId
    );
  }
  
  async deleteRentalRequest(id: number): Promise<boolean> {
    // Check if the rental request exists
    const request = this.rentalRequests.get(id);
    if (!request) {
      return false;
    }
    
    // Delete the rental request
    return this.rentalRequests.delete(id);
  }

  // Price Alert operations
  async createPriceAlert(insertAlert: InsertPriceAlert): Promise<PriceAlert> {
    const id = this.currentPriceAlertId++;
    const now = new Date();
    const alert: PriceAlert = { 
      ...insertAlert, 
      id, 
      isActive: true, 
      createdAt: now 
    };
    this.priceAlerts.set(id, alert);
    return alert;
  }

  async getPriceAlertsByUser(userId: number): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values()).filter(
      (alert) => alert.userId === userId
    );
  }

  // Cart operations
  async getCartItems(userId: number): Promise<{ cartItem: CartItem; product: Product }[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
    
    return Promise.all(
      userCartItems.map(async (cartItem) => {
        const product = await this.getProduct(cartItem.productId);
        if (!product) {
          throw new Error(`Product with ID ${cartItem.productId} not found`);
        }
        return { cartItem, product };
      })
    );
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if this product is already in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update the quantity instead of adding a new item
      return this.updateCartItem(existingItem.id, existingItem.quantity + insertCartItem.quantity) as Promise<CartItem>;
    }

    // Add new item to cart
    const id = this.currentCartItemId++;
    const now = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, addedAt: now };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      return undefined;
    }

    const updatedItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );

    userCartItems.forEach((item) => {
      this.cartItems.delete(item.id);
    });

    return true;
  }
}

export const storage = new MemStorage();
