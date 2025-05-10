import {
  users,
  type User,
  type InsertUser,
  crops,
  type Crop,
  type InsertCrop,
  products,
  type Product,
  type InsertProduct,
  orders,
  type Order,
  type InsertOrder,
  orderItems,
  type OrderItem,
  type InsertOrderItem,
  equipment,
  type Equipment,
  type InsertEquipment,
  labor,
  type Labor,
  type InsertLabor,
  rentalRequests,
  type RentalRequest,
  type InsertRentalRequest,
  priceAlerts,
  type PriceAlert,
  type InsertPriceAlert,
  cartItems,
  type CartItem,
  type InsertCartItem,
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
  getCartItems(
    userId: number,
  ): Promise<{ cartItem: CartItem; product: Product }[]>;
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
    // Sample crops (prices in Indian Rupees)
    const sampleCrops: InsertCrop[] = [
      {
        name: "Wheat",
        variety: "Common",
        currentPrice: 24800, // ₹24,800
        previousPrice: 23900, // ₹23,900
        change: 900, // ₹900
        percentChange: 3.8,
        trend: "up",
        imageUrl:
          "https://pixabay.com/get/gd624dd32f1da5fea4cd11e809bfc2ca6df3e07a91d9615e42e6a4b45c9292c54c5339bef94658687f4afbc0cc6fe30932fc5555c8c5df656e1d68580ced90ebb_1280.jpg",
        priceHistory: [22000, 22500, 23000, 23500, 23900, 24800],
      },
      {
        name: "Corn",
        variety: "Yellow",
        currentPrice: 21910, // ₹21,910
        previousPrice: 22600, // ₹22,600
        change: -690, // -₹690
        percentChange: -2.9,
        trend: "down",
        imageUrl:
          "https://images.unsplash.com/photo-1534313218094-b30d7888478c?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
        priceHistory: [24000, 23500, 23100, 22800, 22600, 21910],
      },
      {
        name: "Soybeans",
        variety: "Standard",
        currentPrice: 42000, // ₹42,000
        previousPrice: 41150, // ₹41,150
        change: 850, // ₹850
        percentChange: 2.1,
        trend: "up",
        imageUrl:
          "https://pixabay.com/get/g36a9fd44ef1035d0efa51c912c3e774b089fc572c97b2e0ba3db2a46ee375e180bb32ec8004315c254aadefb2151f5e1e154923bc0a7dc550b16bef6af0c01ec_1280.jpg",
        priceHistory: [39000, 39800, 40500, 41000, 41150, 42000],
      },
      {
        name: "Rice",
        variety: "Long Grain",
        currentPrice: 33215, // ₹33,215
        previousPrice: 32300, // ₹32,300
        change: 915, // ₹915
        percentChange: 2.8,
        trend: "up",
        imageUrl:
          "https://pixabay.com/get/gd3f1914c6ab2b7bfc21dc6657b803bd0b50d9768acfb44f94f235dd328dab2f87bb079eac58dd8b7ce6adb3976d2cd2c7dffaa89cadf255f5cbf678056ca2fde_1280.jpg",
        priceHistory: [30800, 31200, 31700, 32000, 32300, 33215],
      },
      {
        name: "Barley",
        variety: "Feed",
        currentPrice: 6500, // ₹6,500
        previousPrice: 6340, // ₹6,340
        change: 160, // ₹160
        percentChange: 2.5,
        trend: "up",
        imageUrl:
          "https://pixabay.com/get/g0a2e1f2dc24ca6afbfec3ab47c7a14c4c1d2f07e71a08a88abf0ec9b5b323e11ac4aa4097cc5f242faf59a2e5e11a6c8a55b08e5f7beaf41bfd79c55e1ac15b9_1280.jpg",
        priceHistory: [6000, 6100, 6200, 6300, 6340, 6500],
      },
      {
        name: "Cotton",
        variety: "Upland",
        currentPrice: 63680, // ₹63,680
        previousPrice: 66550, // ₹66,550
        change: -2870, // -₹2,870
        percentChange: -4.3,
        trend: "down",
        imageUrl:
          "https://pixabay.com/get/g3afab27efa9d32a63d1c546ab2a301baa6f6b9dbc5df9cf4df5b89a0e42edb7e9eeee6ac56c5c9c0775e4b8eb38d7cb80fcaeff74ea2ad0c9c18ad74d3a0ecc5_1280.jpg",
        priceHistory: [68500, 68000, 67500, 66550, 65000, 63680],
      },
    ];

    // Sample products (prices in Indian Rupees)
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Organic Fertilizer",
        description: "High-quality organic fertilizer for all crops",
        price: 11000, // ₹11,000
        category: "Fertilizers",
        imageUrl: "/images/Images/premium organic fertilizer.jpeg",
        unit: "25kg Bag",
        inStock: true,
        tags: ["Organic", "Premium"],
      },
      {
        name: "Garden Tool Set",
        description: "Complete set of garden tools for all your farming needs",
        price: 1300, // ₹1,300
        category: "Tools",
        imageUrl: "/images/Images/Garden Tool kit.jpeg",
        unit: "5-Piece Set",
        inStock: true,
        tags: ["Best Seller", "Durable"],
      },
      {
        name: "Heirloom Vegetable Seeds",
        description:
          "Collection of heirloom vegetable seeds for diverse planting",
        price: 300, // ₹300
        category: "Seeds",
        imageUrl: "/images/Images/Heirloom Vegetable seeds.jpeg",
        unit: "20 Variety Pack",
        inStock: true,
        tags: ["Non-GMO", "Heirloom"],
      },
      {
        name: "Organic Pest Control",
        description: "Natural pest control solution safe for organic farming",
        price: 690, // ₹690
        category: "Pesticides",
        imageUrl: "/images/Images/Organic pest control.jpeg",
        unit: "1L Concentrate",
        inStock: true,
        tags: ["Eco-Friendly", "Organic"],
      },
      {
        name: "Heavy-Duty Garden Hose",
        description: "Durable, kink-resistant garden hose for farm irrigation",
        price: 2100, // ₹2,100
        category: "Tools",
        imageUrl: "/images/Images/Heavy duty Hose.jpeg",
        unit: "30m Length",
        inStock: true,
        tags: ["Durable", "Heavy-Duty"],
      },
      {
        name: "Soil pH Testing Kit",
        description:
          "Professional soil pH testing kit for optimal crop management",
        price: 525, // ₹525
        category: "Tools",
        imageUrl: "/images/Images/Ph testing kit.jpeg",
        unit: "Complete Kit",
        inStock: true,
        tags: ["Professional", "Essential"],
      },
    ];

    // Sample equipment (rates in Indian Rupees)
    const sampleEquipment: InsertEquipment[] = [
      {
        name: "John Deere Tractor",
        model: "6120M, 120 HP",
        description: "Versatile tractor suitable for various farm operations",
        imageUrl: "/images/Images/John deere tractor.jpeg",
        availableUnits: 3,
        dailyRate: 456.0, // ₹456/day
        weeklyRate: 2800.0, // ₹2,800/week
        category: "Tractor",
      },
      {
        name: "Combine Harvester",
        model: "Case IH 7150, 350 HP",
        description:
          "High-performance combine harvester for efficient grain harvesting",
        imageUrl: "/images/Images/Harvestor.jpeg",
        availableUnits: 1,
        dailyRate: 5625.0, // ₹562.50 (reduced by factor of 1/100)
        weeklyRate: 2400.0, // ₹2,400.00 (reduced by factor of 1/100)
        category: "Harvester",
      },
      {
        name: "Seed Drill",
        model: "Amazone D9-30",
        description: "Precision seed drill for consistent seed placement",
        imageUrl: "/images/Images/Seed drill.jpeg",
        availableUnits: 2,
        dailyRate: 1875.0, // ₹187.50 (reduced by factor of 1/100)
        weeklyRate: 900.0, // ₹900.00 (reduced by factor of 1/100)
        category: "Seeder",
      },
      {
        name: "Irrigation System",
        model: "Valley Center Pivot",
        description: "Efficient irrigation system for large fields",
        imageUrl: "/images/Images/Irrigation system.jpeg",
        availableUnits: 2,
        dailyRate: 1500.0, // ₹150.00 (reduced by factor of 1/100)
        weeklyRate: 750.0, // ₹750.00 (reduced by factor of 1/100)
        category: "Irrigation",
      },
    ];

    // Sample labor (rates in Indian Rupees)
    const sampleLabor: InsertLabor[] = [
      {
        title: "Seasonal Farm Workers",
        description:
          "Team of 5-10 experienced workers for harvesting and planting",
        imageUrl: "/images/Images/Equipment operator.jpeg",
        hourlyRate: 70, // ₹70/hr
        availability: "Immediate",
        skills: ["Harvesting", "Planting", "General Farm Work"],
      },
      {
        title: "Equipment Operator",
        description:
          "Skilled operator for tractors, harvesters and other farm equipment",
        imageUrl: "/images/Images/Equipment operator.jpeg",
        hourlyRate: 49, // ₹49/hr
        availability: "From 08/15",
        skills: [
          "Tractor Operation",
          "Harvester Operation",
          "Equipment Maintenance",
        ],
      },
      {
        title: "Agricultural Technician",
        description:
          "Experienced technician for equipment setup and maintenance",
        imageUrl: "/images/Images/Agriculture Technician.jpeg",
        hourlyRate: 100, // ₹100/hr
        availability: "Weekends Only",
        skills: ["Equipment Repair", "Machinery Setup", "Technical Support"],
      },
    ];

    // Add sample data to storage
    sampleCrops.forEach((crop) => this.addCrop(crop));
    sampleProducts.forEach((product) => this.addProduct(product));
    sampleEquipment.forEach((equip) => this.addEquipment(equip));
    sampleLabor.forEach((lab) => this.addLabor(lab));
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
      (product) => product.category === category,
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
      (order) => order.userId === userId,
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderNumber === orderNumber,
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
      (item) => item.orderId === orderId,
    );
  }

  // Equipment operations
  private async addEquipment(
    insertEquipment: InsertEquipment,
  ): Promise<Equipment> {
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
  async createRentalRequest(
    insertRequest: InsertRentalRequest,
  ): Promise<RentalRequest> {
    const id = this.currentRentalRequestId++;
    const now = new Date();
    // Use provided ticket number or generate a new one
    const ticketNumber =
      insertRequest.ticketNumber ||
      `RT-${Date.now().toString().slice(-6)}-${id}`;
    const request: RentalRequest = {
      ...insertRequest,
      id,
      status: "Pending",
      ticketNumber,
      createdAt: now,
    };
    this.rentalRequests.set(id, request);
    return request;
  }

  async getRentalRequestsByUser(userId: number): Promise<RentalRequest[]> {
    return Array.from(this.rentalRequests.values()).filter(
      (request) => request.userId === userId,
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
      createdAt: now,
    };
    this.priceAlerts.set(id, alert);
    return alert;
  }

  async getPriceAlertsByUser(userId: number): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values()).filter(
      (alert) => alert.userId === userId,
    );
  }

  // Cart operations
  async getCartItems(
    userId: number,
  ): Promise<{ cartItem: CartItem; product: Product }[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId,
    );

    return Promise.all(
      userCartItems.map(async (cartItem) => {
        const product = await this.getProduct(cartItem.productId);
        if (!product) {
          throw new Error(`Product with ID ${cartItem.productId} not found`);
        }
        return { cartItem, product };
      }),
    );
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if this product is already in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) =>
        item.userId === insertCartItem.userId &&
        item.productId === insertCartItem.productId,
    );

    if (existingItem) {
      // Update the quantity instead of adding a new item
      return this.updateCartItem(
        existingItem.id,
        existingItem.quantity + insertCartItem.quantity,
      ) as Promise<CartItem>;
    }

    // Add new item to cart
    const id = this.currentCartItemId++;
    const now = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, addedAt: now };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(
    id: number,
    quantity: number,
  ): Promise<CartItem | undefined> {
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
      (item) => item.userId === userId,
    );

    userCartItems.forEach((item) => {
      this.cartItems.delete(item.id);
    });

    return true;
  }
}

export const storage = new MemStorage();
