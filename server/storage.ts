import {
  Crop, Equipment, InsertCrop, InsertEquipment, InsertMarket, InsertOrder, InsertOrderItem,
  InsertProduct, InsertProductCategory, InsertRentalBooking, InsertUser, Market, Order,
  OrderItem, OrderWithItems, Product, ProductCategory, RentalBooking, User
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Crop operations
  getCrops(): Promise<Crop[]>;
  getCropsByMarket(marketId: number): Promise<Crop[]>;
  getCrop(id: number): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  updateCrop(id: number, crop: Partial<InsertCrop>): Promise<Crop | undefined>;

  // Market operations
  getMarkets(): Promise<Market[]>;
  getMarket(id: number): Promise<Market | undefined>;
  createMarket(market: InsertMarket): Promise<Market>;

  // Product Category operations
  getProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductStock(id: number, quantity: number): Promise<Product | undefined>;

  // Equipment operations
  getEquipment(): Promise<Equipment[]>;
  getEquipmentByDistance(maxDistance: number): Promise<Equipment[]>;
  getEquipmentItem(id: number): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;

  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Rental booking operations
  getRentalBookings(userId: number): Promise<RentalBooking[]>;
  getRentalBooking(id: number): Promise<RentalBooking | undefined>;
  createRentalBooking(booking: InsertRentalBooking): Promise<RentalBooking>;
  updateRentalBookingStatus(id: number, status: string): Promise<RentalBooking | undefined>;
}

// Memory-based storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private crops: Map<number, Crop>;
  private markets: Map<number, Market>;
  private productCategories: Map<number, ProductCategory>;
  private products: Map<number, Product>;
  private equipment: Map<number, Equipment>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private rentalBookings: Map<number, RentalBooking>;

  // Current IDs for auto-increment
  private currentUserId: number;
  private currentCropId: number;
  private currentMarketId: number;
  private currentProductCategoryId: number;
  private currentProductId: number;
  private currentEquipmentId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentRentalBookingId: number;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.markets = new Map();
    this.productCategories = new Map();
    this.products = new Map();
    this.equipment = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.rentalBookings = new Map();

    this.currentUserId = 1;
    this.currentCropId = 1;
    this.currentMarketId = 1;
    this.currentProductCategoryId = 1;
    this.currentProductId = 1;
    this.currentEquipmentId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentRentalBookingId = 1;

    // Initialize with some data
    this.initializeData();
  }

  // Initialize with sample data
  private initializeData() {
    // Add markets
    const nationalMarket = this.createMarket({ name: "National Average" });
    const midwestMarket = this.createMarket({ name: "Midwest Region" });
    const easternMarket = this.createMarket({ name: "Eastern Market" });
    const westernMarket = this.createMarket({ name: "Western Market" });

    // Add crops
    this.createCrop({
      name: "Corn",
      variety: "Yellow Dent",
      currentPrice: 5.73,
      previousPrice: 5.59,
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
      lastUpdated: new Date(),
      marketId: nationalMarket.id
    });
    
    this.createCrop({
      name: "Wheat",
      variety: "Hard Red",
      currentPrice: 6.85,
      previousPrice: 6.93,
      imageUrl: "https://pixabay.com/get/ga18e37eafe731c049a4e3a9b08a383b683230463e00c348919e490b81ed431eee55fa0dd6aa6557e9bc4af47523846ed8d2920cf2d4e04d6427e998db4109b98_1280.jpg",
      lastUpdated: new Date(),
      marketId: nationalMarket.id
    });
    
    this.createCrop({
      name: "Soybeans",
      variety: "Standard",
      currentPrice: 13.45,
      previousPrice: 12.97,
      imageUrl: "https://pixabay.com/get/g9288d8ceef6503146a1437ecc2ef9eeb579796dca3454adc0adb2a7e4660d915dcf09a81994a1fe4cafab890ee284261_1280.jpg",
      lastUpdated: new Date(),
      marketId: nationalMarket.id
    });
    
    this.createCrop({
      name: "Rice",
      variety: "Long Grain",
      currentPrice: 14.22,
      previousPrice: 14.11,
      imageUrl: "https://pixabay.com/get/g0866e159699a193246497197df19cb7effe70eaaa80f9ce8456b7098bbf2969424510d7bc5ad7d47c477ff9f64b12724da7a8219ff6aaa58586aa3b958800212_1280.jpg",
      lastUpdated: new Date(),
      marketId: nationalMarket.id
    });
    
    this.createCrop({
      name: "Cotton",
      variety: "Upland",
      currentPrice: 0.73,
      previousPrice: 0.75,
      imageUrl: "https://pixabay.com/get/ga77bd6a9ace3ea5e41d562ebafcac83efc3a167187837ad4f44ab3f54636293635fd84a75c26bad31c9167626b7111c6585b06eb7d97943a16b4e447c6958c6d_1280.jpg",
      lastUpdated: new Date(),
      marketId: nationalMarket.id
    });
    
    this.createCrop({
      name: "Potatoes",
      variety: "Russet",
      currentPrice: 11.50,
      previousPrice: 11.50,
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
      lastUpdated: new Date(),
      marketId: nationalMarket.id
    });

    // Add product categories
    const fertilizers = this.createProductCategory({ name: "Fertilizers" });
    const pesticides = this.createProductCategory({ name: "Pesticides" });
    const seeds = this.createProductCategory({ name: "Seeds" });
    const tools = this.createProductCategory({ name: "Tools" });

    // Add products
    this.createProduct({
      name: "Premium NPK Fertilizer",
      description: "Balanced nutrition for all crops. Promotes healthy growth and high yields.",
      price: 49.99,
      unit: "50 lb bag",
      imageUrl: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300",
      categoryId: fertilizers.id,
      stock: 100,
      tags: ["balanced", "nutrition", "growth"],
      isBestSeller: true
    });

    this.createProduct({
      name: "Organic Herbicide",
      description: "Natural weed control solution. Safe for food crops and environmentally friendly.",
      price: 32.50,
      unit: "1 gallon",
      imageUrl: "https://pixabay.com/get/gb0f1ea4fabd6c6de32e0c9aad7bc1b908c3a78cb2a63f437728ad5610bdbce46e7567aefd23f99592a395d146b81eb7d11890e53913e253d469e7e068b7fc0ee_1280.jpg",
      categoryId: pesticides.id,
      stock: 75,
      tags: ["organic", "eco-friendly", "weed control"],
      isBestSeller: false
    });

    this.createProduct({
      name: "Hybrid Corn Seeds",
      description: "Drought-resistant variety with excellent yield potential. Germination rate: 95%.",
      price: 89.99,
      unit: "80,000 seeds",
      imageUrl: "https://pixabay.com/get/gae97c7454ca5ba7d146f31ec012ecfb71622cd70bda8ceeeb66c47bb470997e8b6d1ff808d1a80fa9cb555cc07566ebd5003687df240ddecb398c2ca96469dc8_1280.jpg",
      categoryId: seeds.id,
      stock: 50,
      tags: ["drought-resistant", "high yield", "corn"],
      isBestSeller: false
    });

    this.createProduct({
      name: "Premium Hand Tools Set",
      description: "Professional-grade garden tools. Includes trowel, pruners, and cultivator.",
      price: 74.95,
      unit: "5-piece set",
      imageUrl: "https://pixabay.com/get/g80500fd100a18722dfa81adb9b2405ac0ebdcca554e54c1cf7db5621477878cf0b5bf1e3b712222d15b2d342315c879b09a04339705527ae34849451ff16da4c_1280.jpg",
      categoryId: tools.id,
      stock: 30,
      tags: ["professional", "durable", "garden tools"],
      isBestSeller: true
    });

    // Add equipment
    this.createEquipment({
      name: "John Deere 8R Tractor",
      description: "Powerful row-crop tractor with precision technology. Includes GPS guidance system.",
      price: 350.00, // per day
      imageUrl: "https://pixabay.com/get/g946e199b4e2fa279bbc0eb13b62a691506539bd87b076da63a543490ffe70fd2da5044fb4a3df4b8b6cb2a13bfb70789128ac676fb4a4f50c8f2b119883c1486_1280.jpg",
      availabilityStatus: "Available Now",
      availabilityDate: null,
      rating: 4.5,
      reviewCount: 28,
      features: ["370 HP", "Climate Controlled", "GPS Ready"],
      contactPhone: "(555) 123-4567",
      location: "Springfield, IL",
      distanceInMiles: 15
    });

    this.createEquipment({
      name: "Case IH Axial-Flow Combine",
      description: "Efficient grain harvesting with minimal grain loss. Includes corn and grain heads.",
      price: 500.00, // per day
      imageUrl: "https://pixabay.com/get/g0edfd35fca82b169051f9150eb37740041514d0f5ef67bb095182c0daa4f84a4218deff6006c94d9f7d383c4825d9fb7ef337fbe7773e667792e5607e9cd34a1_1280.jpg",
      availabilityStatus: "Available Sep 20",
      availabilityDate: new Date("2023-09-20"),
      rating: 4.0,
      reviewCount: 15,
      features: ["410 HP", "350 bu Capacity", "Yield Monitoring"],
      contactPhone: "(555) 234-5678",
      location: "Decatur, IL",
      distanceInMiles: 25
    });

    this.createEquipment({
      name: "Self-Propelled Sprayer",
      description: "Precision application of fertilizers and crop protection products with 120' boom.",
      price: 275.00, // per day
      imageUrl: "https://pixabay.com/get/gb132713cb7c7ff757d78590dd3c38ba150e1051e2643d85ec605d44399167eb9d5bf35032c19b2b1e45d121b3a04728d473742030240967749684a99c94084c5_1280.jpg",
      availabilityStatus: "Booked until Oct 5",
      availabilityDate: new Date("2023-10-05"),
      rating: 5.0,
      reviewCount: 9,
      features: ["1,000 gal Tank", "120' Boom", "Sectional Control"],
      contactPhone: "(555) 345-6789",
      location: "Champaign, IL",
      distanceInMiles: 35
    });

    this.createEquipment({
      name: "Harvest Crew (5 workers)",
      description: "Experienced team for harvest season. Skilled in various crops and equipment operation.",
      price: 950.00, // per day
      imageUrl: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300",
      availabilityStatus: "Available Now",
      availabilityDate: null,
      rating: 4.0,
      reviewCount: 22,
      features: ["Experienced", "All Certifications", "Equipment Operators"],
      contactPhone: "(555) 456-7890",
      location: "Bloomington, IL",
      distanceInMiles: 45
    });

    // Add a test user
    this.createUser({
      username: "johnfarmer",
      password: "password123",
      fullName: "John Farmer",
      email: "john@farmer.com",
      phone: "(555) 987-6543",
      address: "123 Farm Road, Farmington, IL 61234"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Crop operations
  async getCrops(): Promise<Crop[]> {
    return Array.from(this.crops.values());
  }

  async getCropsByMarket(marketId: number): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(crop => crop.marketId === marketId);
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async createCrop(crop: InsertCrop): Promise<Crop> {
    const id = this.currentCropId++;
    const newCrop: Crop = { ...crop, id };
    this.crops.set(id, newCrop);
    return newCrop;
  }

  async updateCrop(id: number, crop: Partial<InsertCrop>): Promise<Crop | undefined> {
    const existingCrop = this.crops.get(id);
    if (!existingCrop) return undefined;
    
    const updatedCrop: Crop = { ...existingCrop, ...crop };
    this.crops.set(id, updatedCrop);
    return updatedCrop;
  }

  // Market operations
  async getMarkets(): Promise<Market[]> {
    return Array.from(this.markets.values());
  }

  async getMarket(id: number): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async createMarket(market: InsertMarket): Promise<Market> {
    const id = this.currentMarketId++;
    const newMarket: Market = { ...market, id };
    this.markets.set(id, newMarket);
    return newMarket;
  }

  // Product Category operations
  async getProductCategories(): Promise<ProductCategory[]> {
    return Array.from(this.productCategories.values());
  }

  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    return this.productCategories.get(id);
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const id = this.currentProductCategoryId++;
    const newCategory: ProductCategory = { ...category, id };
    this.productCategories.set(id, newCategory);
    return newCategory;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { 
      ...existingProduct, 
      stock: Math.max(0, existingProduct.stock - quantity)
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Equipment operations
  async getEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipmentByDistance(maxDistance: number): Promise<Equipment[]> {
    return Array.from(this.equipment.values())
      .filter(item => item.distanceInMiles <= maxDistance);
  }

  async getEquipmentItem(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async createEquipment(equipment: InsertEquipment): Promise<Equipment> {
    const id = this.currentEquipmentId++;
    const newEquipment: Equipment = { ...equipment, id };
    this.equipment.set(id, newEquipment);
    return newEquipment;
  }

  async updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const existingEquipment = this.equipment.get(id);
    if (!existingEquipment) return undefined;
    
    const updatedEquipment: Equipment = { ...existingEquipment, ...equipment };
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = await this.getOrderItems(id);
    const itemsWithProducts = await Promise.all(items.map(async item => {
      const product = await this.getProduct(item.productId);
      return { ...item, product: product! };
    }));

    return { ...order, items: itemsWithProducts };
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder: Order = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder: Order = { ...existingOrder, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Rental booking operations
  async getRentalBookings(userId: number): Promise<RentalBooking[]> {
    return Array.from(this.rentalBookings.values())
      .filter(booking => booking.userId === userId);
  }

  async getRentalBooking(id: number): Promise<RentalBooking | undefined> {
    return this.rentalBookings.get(id);
  }

  async createRentalBooking(booking: InsertRentalBooking): Promise<RentalBooking> {
    const id = this.currentRentalBookingId++;
    const newBooking: RentalBooking = { ...booking, id };
    this.rentalBookings.set(id, newBooking);
    return newBooking;
  }

  async updateRentalBookingStatus(id: number, status: string): Promise<RentalBooking | undefined> {
    const existingBooking = this.rentalBookings.get(id);
    if (!existingBooking) return undefined;
    
    const updatedBooking: RentalBooking = { ...existingBooking, status };
    this.rentalBookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemStorage();
