import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertBookingSchema, insertBusinessInquirySchema } from "@shared/schema";
import { geminiService } from "./services/gemini.js";
import contactRouter from "./api/contact";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bookings endpoints
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      // Update user points
      if (booking.userId) {
        await storage.updateUserPoints(booking.userId, booking.pointsEarned || 0);
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["active", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      res.json(booking);
    } catch (error) {
      console.error("Update booking error:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Business inquiries endpoint
  app.post("/api/business-inquiries", async (req, res) => {
    try {
      const inquiryData = insertBusinessInquirySchema.parse(req.body);
      const inquiry = await storage.createBusinessInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      console.error("Create business inquiry error:", error);
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  // Users endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const insertUser = req.body;
      const user = await storage.createUser(insertUser);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id/points", async (req, res) => {
    try {
      const { id } = req.params;
      const { points } = req.body;
      
      if (typeof points !== 'number') {
        return res.status(400).json({ message: "Invalid points value" });
      }
      
      const user = await storage.updateUserPoints(id, points);
      res.json(user);
    } catch (error) {
      console.error("Update user points error:", error);
      res.status(500).json({ message: "Failed to update points" });
    }
  });

  // Documents endpoints
  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = z.object({
        userId: z.string(),
        type: z.enum(["license", "rc", "puc"]),
        fileName: z.string(),
        fileUrl: z.string(),
        expiryDate: z.string().optional()
      }).parse(req.body);

      const document = await storage.createDocument({
        ...documentData,
        expiryDate: documentData.expiryDate ? new Date(documentData.expiryDate) : undefined
      });
      
      res.json(document);
    } catch (error) {
      console.error("Create document error:", error);
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Parking spots endpoint
  app.get("/api/parking-spots", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }
      
      const spots = await storage.getNearbyParkingSpots(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius ? parseInt(radius as string) : 5000
      );
      
      res.json(spots);
    } catch (error) {
      console.error("Get parking spots error:", error);
      res.status(500).json({ message: "Failed to fetch parking spots" });
    }
  });

  // EV stations endpoint
  app.get("/api/ev-stations", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }
      
      const stations = await storage.getNearbyEVStations(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius ? parseInt(radius as string) : 10000
      );
      
      res.json(stations);
    } catch (error) {
      console.error("Get EV stations error:", error);
      res.status(500).json({ message: "Failed to fetch EV stations" });
    }
  });

  // Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await geminiService.sendMessage(message, conversationId);
      res.json({ response, conversationId: response.conversationId });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Vehicle details endpoint (mock implementation)
  app.get("/api/vehicle/:number", async (req, res) => {
    try {
      const { number } = req.params;
      
      // Mock vehicle data for demo
      const mockVehicleData = {
        vehicleNumber: number.toUpperCase(),
        owner: "Vehicle Owner",
        location: "Last seen at C21 Mall Parking",
        status: "Active",
        registrationDate: "2020-01-15",
        model: "Honda City",
        fuelType: "Petrol"
      };
      
      res.json(mockVehicleData);
    } catch (error) {
      console.error("Get vehicle details error:", error);
      res.status(500).json({ message: "Failed to fetch vehicle details" });
    }
  });

  // Challan check endpoint (mock implementation)
  app.get("/api/challan/:vehicleNumber", async (req, res) => {
    try {
      const { vehicleNumber } = req.params;
      
      // Mock challan data for demo
      const mockChallans = [
        {
          id: "CH001",
          amount: 500,
          reason: "Over speeding",
          date: "2024-01-15",
          location: "MG Road, Indore",
          status: "pending"
        },
        {
          id: "CH002", 
          amount: 300,
          reason: "No parking zone",
          date: "2024-01-10",
          location: "AB Road, Indore",
          status: "pending"
        }
      ];
      
      res.json({
        vehicleNumber: vehicleNumber.toUpperCase(),
        challans: mockChallans,
        totalAmount: mockChallans.reduce((sum, challan) => sum + challan.amount, 0)
      });
    } catch (error) {
      console.error("Get challan error:", error);
      res.status(500).json({ message: "Failed to fetch challan data" });
    }
  });

  // Contact form endpoint
  app.use("/api/contact", contactRouter);

  // Simple wallet endpoints integrated with existing system
  app.get("/api/wallet/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: 1,
        userId,
        balance: user.points || 0,
        totalEarned: user.points || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ message: 'Failed to fetch wallet' });
    }
  });

  app.post("/api/wallet/:userId/earn", async (req, res) => {
    try {
      const { userId } = req.params;
      const { amount, action, description } = req.body;
      
      const updatedUser = await storage.updateUserPoints(userId, amount);
      
      const wallet = {
        id: 1,
        userId,
        balance: updatedUser.points,
        totalEarned: updatedUser.points,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json({ 
        wallet,
        message: `You earned ${amount} coins for ${description}!`
      });
    } catch (error) {
      console.error('Error adding coins:', error);
      res.status(500).json({ message: 'Failed to add coins' });
    }
  });

  app.get("/api/wallet/:userId/transactions", async (req, res) => {
    try {
      const { userId } = req.params;
      // Mock transaction history for now
      const transactions = [
        {
          id: 1,
          userId,
          amount: 25,
          type: 'earn',
          action: 'BOOKING_COMPLETE',
          description: 'Completed parking booking',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          userId,
          amount: 10,
          type: 'earn', 
          action: 'NAVIGATION_USE',
          description: 'Used navigation to find parking',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
