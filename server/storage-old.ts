import { type User, type InsertUser, type Booking, type InsertBooking, type Document, type InsertDocument, type ParkingSpot, type BusinessInquiry, type InsertBusinessInquiry, type EVStation, type WalletTransaction, type InsertWalletTransaction, type Achievement, type UserAchievement } from "@shared/schema";
import { randomUUID } from "crypto";
import { adminDb } from "./services/firebase-admin.js";

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

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.documents = new Map();
    this.businessInquiries = new Map();
    this.parkingSpots = new Map();
    this.evStations = new Map();

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
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
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
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      points: user.points! + points,
      level: Math.floor((user.points! + points) / 1000) + 1
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

class FirebaseStorage implements IStorage {
  private db = adminDb;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await this.db.collection('users').doc(id).get();
      if (!doc.exists) return undefined;
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const snapshot = await this.db.collection('users').where('email', '==', email).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const user: User = {
        ...insertUser,
        id,
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
      
      await this.db.collection('users').doc(id).set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    try {
      const userRef = this.db.collection('users').doc(userId);
      const doc = await userRef.get();
      
      if (!doc.exists) {
        throw new Error("User not found");
      }

      const userData = doc.data() as User;
      const newPoints = (userData.points || 0) + points;
      const newLevel = Math.floor(newPoints / 1000) + 1;

      const updatedUser: User = {
        ...userData,
        points: newPoints,
        level: Math.max(newLevel, userData.level || 1)
      };

      await userRef.update({ points: newPoints, level: updatedUser.level });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user points:', error);
      throw error;
    }
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
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

      await this.db.collection('bookings').doc(id).set(booking);

      // Update user total bookings
      if (booking.userId) {
        const userRef = this.db.collection('users').doc(booking.userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data() as User;
          await userRef.update({ 
            totalBookings: (userData.totalBookings || 0) + 1 
          });
        }
      }

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const snapshot = await this.db.collection('bookings').where('userId', '==', userId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    try {
      const bookingRef = this.db.collection('bookings').doc(bookingId);
      await bookingRef.update({ status });
      
      const doc = await bookingRef.get();
      if (!doc.exists) throw new Error("Booking not found");
      
      return { id: doc.id, ...doc.data() } as Booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Document operations
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    try {
      const id = randomUUID();
      const document: Document = {
        ...insertDocument,
        id,
        userId: insertDocument.userId || null,
        expiryDate: insertDocument.expiryDate || null,
        isValid: true,
        createdAt: new Date()
      };
      
      await this.db.collection('documents').doc(id).set(document);
      return document;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    try {
      const snapshot = await this.db.collection('documents').where('userId', '==', userId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
    } catch (error) {
      console.error('Error getting user documents:', error);
      return [];
    }
  }

  // Business inquiry operations
  async createBusinessInquiry(insertInquiry: InsertBusinessInquiry): Promise<BusinessInquiry> {
    try {
      const id = randomUUID();
      const inquiry: BusinessInquiry = {
        ...insertInquiry,
        id,
        message: insertInquiry.message || null,
        status: "pending",
        createdAt: new Date()
      };
      
      await this.db.collection('business_inquiries').doc(id).set(inquiry);
      return inquiry;
    } catch (error) {
      console.error('Error creating business inquiry:', error);
      throw error;
    }
  }

  // Parking spots operations (using mock data for demo)
  async getNearbyParkingSpots(lat: number, lng: number, radius: number): Promise<ParkingSpot[]> {
    // For demo purposes, return mock data. In production, this would query Firebase
    const mockParkingSpots: ParkingSpot[] = [
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

    return mockParkingSpots.filter(spot => {
      if (!spot.coordinates) return false;
      const distance = this.calculateDistance(lat, lng, spot.coordinates.lat, spot.coordinates.lng);
      return distance <= radius / 1000;
    });
  }

  // EV stations operations (using mock data for demo)
  async getNearbyEVStations(lat: number, lng: number, radius: number): Promise<EVStation[]> {
    const mockEVStations: EVStation[] = [
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

    return mockEVStations.filter(station => {
      if (!station.coordinates) return false;
      const distance = this.calculateDistance(lat, lng, station.coordinates.lat, station.coordinates.lng);
      return distance <= radius / 1000;
    });
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

// Use Firebase storage for complete database integration
export const storage = new FirebaseStorage();
