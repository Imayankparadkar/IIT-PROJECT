import { type User, type InsertUser, type Booking, type InsertBooking, type Document, type InsertDocument, type ParkingSpot, type BusinessInquiry, type InsertBusinessInquiry, type EVStation, type WalletTransaction, type InsertWalletTransaction, type Achievement, type UserAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<User>;
  updateUserWallet(userId: string, amount: number, type: string, description: string): Promise<User>;
  updateUserLanguage(userId: string, language: string): Promise<User>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getUserDocuments(userId: string): Promise<Document[]>;

  // Business inquiry operations
  createBusinessInquiry(inquiry: InsertBusinessInquiry): Promise<BusinessInquiry>;

  // Parking spots operations
  getNearbyParkingSpots(lat: number, lng: number, radius: number): Promise<ParkingSpot[]>;

  // EV stations operations
  getNearbyEVStations(lat: number, lng: number, radius: number): Promise<EVStation[]>;

  // Wallet operations
  createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
  getUserWalletTransactions(userId: string): Promise<WalletTransaction[]>;

  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private documents: Map<string, Document>;
  private businessInquiries: Map<string, BusinessInquiry>;
  private parkingSpots: Map<string, ParkingSpot>;
  private evStations: Map<string, EVStation>;
  private walletTransactions: Map<string, WalletTransaction>;
  private achievements: Map<string, Achievement>;
  private userAchievements: Map<string, UserAchievement>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.documents = new Map();
    this.businessInquiries = new Map();
    this.parkingSpots = new Map();
    this.evStations = new Map();
    this.walletTransactions = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();

    // Initialize with some demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Demo parking spots
    const parkingSpots: ParkingSpot[] = [
      {
        id: "ps1",
        location: "C21 Mall Indore",
        totalSlots: 100,
        availableSlots: 12,
        pricePerHour: 20,
        coordinates: { lat: 22.7196, lng: 75.8577 },
        amenities: ["Security", "CCTV", "Valet Service"],
        isActive: true
      },
      {
        id: "ps2",
        location: "Treasure Island Mall",
        totalSlots: 80,
        availableSlots: 3,
        pricePerHour: 25,
        coordinates: { lat: 22.7283, lng: 75.8641 },
        amenities: ["Security", "Car Wash", "Food Court"],
        isActive: true
      },
      {
        id: "ps3",
        location: "Orbit Mall",
        totalSlots: 150,
        availableSlots: 0,
        pricePerHour: 30,
        coordinates: { lat: 22.7045, lng: 75.8732 },
        amenities: ["Security", "Valet Service", "Car Service"],
        isActive: true
      }
    ];

    // Demo EV stations
    const evStations: EVStation[] = [
      {
        id: "ev1",
        name: "Tata Power Station",
        location: "Near C21 Mall, AB Road, Indore",
        coordinates: { lat: 22.7156, lng: 75.8547 },
        availablePorts: 4,
        totalPorts: 6,
        pricePerKwh: 8,
        distance: "0.5 km",
        isActive: true
      },
      {
        id: "ev2",
        name: "BPCL Charging Hub",
        location: "MG Road, Indore",
        coordinates: { lat: 22.7223, lng: 75.8611 },
        availablePorts: 2,
        totalPorts: 4,
        pricePerKwh: 7,
        distance: "1.2 km",
        isActive: true
      },
      {
        id: "ev3",
        name: "ChargePoint Station",
        location: "Vijay Nagar, Indore",
        coordinates: { lat: 22.7098, lng: 75.8765 },
        availablePorts: 1,
        totalPorts: 3,
        pricePerKwh: 9,
        distance: "2.3 km",
        isActive: true
      }
    ];

    parkingSpots.forEach(spot => this.parkingSpots.set(spot.id, spot));
    evStations.forEach(station => this.evStations.set(station.id, station));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    console.log(`Looking for user with ID: ${id}, Map has: ${this.users.has(id)}, Total users: ${this.users.size}`);
    console.log('Available user IDs:', Array.from(this.users.keys()));
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Use Firebase UID as the user ID for consistency  
    const id = insertUser.firebaseUid || randomUUID();
    const user: User = {
      id,
      firebaseUid: insertUser.firebaseUid || null,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name || null,
      phoneNumber: insertUser.phoneNumber || null,
      points: 0,
      level: 1,
      totalBookings: 0,
      achievements: [],
      walletBalance: 0,
      tier: "bronze",
      language: "en",
      profileImage: null,
      isEmailVerified: false,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    console.log(`User created with ID: ${id}, stored in Map: ${this.users.has(id)}`);
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      points: (user.points || 0) + points,
      level: Math.floor(((user.points || 0) + points) / 1000) + 1,
      updatedAt: new Date()
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserWallet(userId: string, amount: number, type: string, description: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const balanceBefore = user.walletBalance || 0;
    const balanceAfter = balanceBefore + amount;

    const updatedUser: User = {
      ...user,
      walletBalance: balanceAfter,
      updatedAt: new Date()
    };

    this.users.set(userId, updatedUser);

    // Create transaction record
    await this.createWalletTransaction({
      userId: userId,
      type: type,
      amount: amount,
      description: description,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      bookingId: null
    });

    return updatedUser;
  }

  async updateUserLanguage(userId: string, language: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const updatedUser: User = {
      ...user,
      language,
      updatedAt: new Date()
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      userId: insertBooking.userId || null,
      slotNumber: insertBooking.slotNumber || null,
      isPreBooked: insertBooking.isPreBooked || null,
      status: "active",
      pointsEarned: insertBooking.isPreBooked ? 50 : 30,
      createdAt: new Date()
    };

    this.bookings.set(id, booking);

    // Update user total bookings
    if (booking.userId) {
      const user = this.users.get(booking.userId);
      if (user) {
        const updatedUser: User = {
          ...user,
          totalBookings: (user.totalBookings || 0) + 1
        };
        this.users.set(booking.userId, updatedUser);
      }
    }

    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const updatedBooking: Booking = { ...booking, status };
    this.bookings.set(bookingId, updatedBooking);
    return updatedBooking;
  }

  // Document operations
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      userId: insertDocument.userId || null,
      expiryDate: insertDocument.expiryDate || null,
      isValid: true,
      createdAt: new Date()
    };
    this.documents.set(id, document);
    return document;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  // Business inquiry operations
  async createBusinessInquiry(insertInquiry: InsertBusinessInquiry): Promise<BusinessInquiry> {
    const id = randomUUID();
    const inquiry: BusinessInquiry = {
      ...insertInquiry,
      id,
      message: insertInquiry.message || null,
      status: "pending",
      createdAt: new Date()
    };
    this.businessInquiries.set(id, inquiry);
    return inquiry;
  }

  // Parking spots operations
  async getNearbyParkingSpots(lat: number, lng: number, radius: number): Promise<ParkingSpot[]> {
    // Simple distance calculation for demo - in production would use proper geospatial queries
    return Array.from(this.parkingSpots.values()).filter(spot => {
      if (!spot.coordinates) return false;
      
      const distance = this.calculateDistance(lat, lng, spot.coordinates.lat, spot.coordinates.lng);
      return distance <= radius / 1000; // Convert meters to km
    });
  }

  // EV stations operations
  async getNearbyEVStations(lat: number, lng: number, radius: number): Promise<EVStation[]> {
    return Array.from(this.evStations.values()).filter(station => {
      if (!station.coordinates) return false;
      
      const distance = this.calculateDistance(lat, lng, station.coordinates.lat, station.coordinates.lng);
      return distance <= radius / 1000; // Convert meters to km
    });
  }

  // Wallet operations
  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const id = randomUUID();
    const walletTransaction: WalletTransaction = {
      id,
      userId: transaction.userId || null,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      bookingId: transaction.bookingId || null,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      createdAt: new Date()
    };
    this.walletTransactions.set(id, walletTransaction);
    return walletTransaction;
  }

  async getUserWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    return Array.from(this.walletTransactions.values()).filter(transaction => transaction.userId === userId);
  }

  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(ua => ua.userId === userId);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const id = randomUUID();
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      earnedAt: new Date()
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Helper method to calculate distance between two coordinates
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

// Use memory storage for reliable operation
export const storage = new MemStorage();